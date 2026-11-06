import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Conversation, ChatMessage } from '../../types';
import { sendChatMessage } from '../../services/gemini';
import {
  getConversations,
  saveConversation,
  deleteConversation,
  getMessages,
  saveMessage,
} from '../../services/storage';
import {
  Send,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  RefreshCw,
  Volume2,
  VolumeX,
  Sparkles,
  AlertCircle,
  MessageSquare,
  Bot,
  User,
  Clock,
  Languages,
} from 'lucide-react';

interface ChatAssistantProps {
  currentUser: UserProfile;
  onQuotaUpdate?: (remaining: number, limit: number) => void;
  initialPrompt?: string;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({
  currentUser,
  onQuotaUpdate,
  initialPrompt,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState(initialPrompt || '');
  const [targetLanguage, setTargetLanguage] = useState<string>('Auto-Detect');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeakingId, setIsSpeakingId] = useState<string | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    const list = getConversations(currentUser.id);
    setConversations(list);
    if (list.length > 0) {
      setActiveConversationId(list[0].id);
      setMessages(getMessages(list[0].id));
    } else {
      handleNewConversation();
    }
  }, [currentUser.id]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (activeConversationId) {
      setMessages(getMessages(activeConversationId));
    }
  }, [activeConversationId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // If initialPrompt passed, autofill input
  useEffect(() => {
    if (initialPrompt) {
      setInputMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      userId: currentUser.id,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
    };
    saveConversation(currentUser.id, newConv);
    setConversations([newConv, ...conversations]);
    setActiveConversationId(newId);
    setMessages([]);
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConversation(currentUser.id, id);
    const updated = conversations.filter((c) => c.id !== id);
    setConversations(updated);
    if (activeConversationId === id) {
      if (updated.length > 0) {
        setActiveConversationId(updated[0].id);
      } else {
        handleNewConversation();
      }
    }
  };

  const handleStartRename = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitleId(conv.id);
    setEditedTitle(conv.title);
  };

  const handleSaveRename = (id: string) => {
    if (!editedTitle.trim()) {
      setEditingTitleId(null);
      return;
    }
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      const updated = { ...conv, title: editedTitle.trim(), updatedAt: new Date().toISOString() };
      saveConversation(currentUser.id, updated);
      setConversations(conversations.map((c) => (c.id === id ? updated : c)));
    }
    setEditingTitleId(null);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputMessage).trim();
    if (!textToSend || loading) return;

    setError(null);
    setInputMessage('');

    // Create user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversationId,
      userId: currentUser.id,
      role: 'user',
      content: textToSend,
      createdAt: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveMessage(activeConversationId, userMsg);

    // Update conversation title if first message
    const currentConv = conversations.find((c) => c.id === activeConversationId);
    if (currentConv && (currentConv.title === 'New Conversation' || currentConv.messageCount === 0)) {
      const snippet = textToSend.slice(0, 35) + (textToSend.length > 35 ? '...' : '');
      const updatedConv = {
        ...currentConv,
        title: snippet,
        updatedAt: new Date().toISOString(),
        messageCount: (currentConv.messageCount || 0) + 1,
      };
      saveConversation(currentUser.id, updatedConv);
      setConversations(conversations.map((c) => (c.id === activeConversationId ? updatedConv : c)));
    }

    setLoading(true);

    try {
      const apiPayload = {
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        language: targetLanguage !== 'Auto-Detect' ? targetLanguage : undefined,
        userId: currentUser.id,
        plan: currentUser.plan,
      };

      const response = await sendChatMessage(apiPayload);

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        conversationId: activeConversationId,
        userId: 'nexora',
        role: 'assistant',
        content: response.reply,
        createdAt: new Date().toISOString(),
        modelUsed: response.modelUsed || 'gemini-3.8-flash',
      };

      setMessages((prev) => [...prev, aiMsg]);
      saveMessage(activeConversationId, aiMsg);

      if (onQuotaUpdate && typeof response.remainingQuota === 'number' && typeof response.limit === 'number') {
        onQuotaUpdate(response.remainingQuota, response.limit);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to generate response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (messages.length === 0 || loading) return;
    // Find last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      await handleSendMessage(lastUserMsg.content);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all messages in this conversation?')) {
      localStorage.removeItem(`nexora_messages_${activeConversationId}`);
      setMessages([]);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeech = (text: string, id: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeakingId === id) {
        window.speechSynthesis.cancel();
        setIsSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#`_]/g, ''));
      utterance.onend = () => setIsSpeakingId(null);
      utterance.onerror = () => setIsSpeakingId(null);
      setIsSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col lg:flex-row gap-4 text-left">
      {/* Left: Conversation History List */}
      <div className="w-full lg:w-72 bg-[#0A0E1A] rounded-2xl border border-white/5 p-3 flex flex-col justify-between shrink-0 h-48 lg:h-full">
        <div className="space-y-2 overflow-hidden flex flex-col flex-1">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <span className="text-xs font-semibold text-slate-300">Conversations</span>
            <button
              onClick={handleNewConversation}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-[#287BFF] hover:bg-[#2066d9] rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {conversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              const isEditing = editingTitleId === conv.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`group relative p-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-[#101629] text-white border border-[#287BFF]/30 font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate mr-2">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#287BFF]' : 'text-slate-500'}`} />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onBlur={() => handleSaveRename(conv.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(conv.id)}
                        autoFocus
                        className="bg-[#080B14] px-1.5 py-0.5 rounded text-white border border-[#287BFF] text-xs outline-none w-full"
                      />
                    ) : (
                      <span className="truncate">{conv.title}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleStartRename(conv, e)}
                      className="p-1 hover:text-[#287BFF] transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="p-1 hover:text-rose-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clear Conversation Controls */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <span>{conversations.length} saved threads</span>
          {messages.length > 0 && (
            <button onClick={handleClearChat} className="hover:text-rose-400 transition-colors cursor-pointer">
              Clear thread
            </button>
          )}
        </div>
      </div>

      {/* Right: Active Chat Thread View */}
      <div className="flex-1 bg-[#101629] rounded-2xl border border-white/10 flex flex-col justify-between overflow-hidden relative shadow-xl">
        {/* Chat Header Bar */}
        <div className="p-3.5 bg-[#0A0E1A] border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#287BFF] to-[#8955FF] p-0.5 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>NEXORA AI</span>
                <span className="text-[10px] text-[#287BFF] font-mono">gemini-3.8-flash</span>
              </div>
              <p className="text-[10px] text-slate-400">Context-aware · Multi-lingual reasoning</p>
            </div>
          </div>

          {/* Language selector */}
          <div className="flex items-center gap-2">
            <Languages className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="px-2.5 py-1 text-xs text-white bg-[#080B14] border border-white/10 rounded-lg outline-none cursor-pointer focus:border-[#287BFF]"
            >
              <option value="Auto-Detect">Auto-Detect Language</option>
              <option value="English">English</option>
              <option value="Urdu">Urdu (اردو نستعلیق)</option>
              <option value="Roman Urdu">Roman Urdu</option>
              <option value="Arabic">Arabic (العربية)</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
            </select>

            {messages.length > 0 && (
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                title="Regenerate last response"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#287BFF]/20 to-[#8955FF]/20 border border-white/10 flex items-center justify-center text-[#287BFF]">
                <Bot className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">How can NEXORA assist you today?</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ask in English, Urdu (اردو), or Roman Urdu. Master complex STEM concepts, draft business proposals, or solve coding queries.
                </p>
              </div>

              {/* Sample starters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-2">
                <button
                  onClick={() => handleSendMessage('Explain the difference between photosynthesis and cellular respiration with a summary table.')}
                  className="p-2.5 text-xs text-left bg-[#080B14] hover:bg-white/5 border border-white/10 rounded-xl text-slate-300 transition-colors cursor-pointer"
                >
                  🌱 Biology photosynthesis comparison
                </button>
                <button
                  onClick={() => handleSendMessage('Mujhe aik client ke liye professional Cold Email sequence draft kar dein Roman Urdu me.')}
                  className="p-2.5 text-xs text-left bg-[#080B14] hover:bg-white/5 border border-white/10 rounded-xl text-slate-300 transition-colors cursor-pointer"
                >
                  ✉️ Cold Email sequence in Roman Urdu
                </button>
                <button
                  onClick={() => handleSendMessage('Solve the quadratic equation 2x² + 5x - 3 = 0 step by step.')}
                  className="p-2.5 text-xs text-left bg-[#080B14] hover:bg-white/5 border border-white/10 rounded-xl text-slate-300 transition-colors cursor-pointer"
                >
                  📐 Step-by-step quadratic equation
                </button>
                <button
                  onClick={() => handleSendMessage('اردو میں ایک پر اثر کاروباری خط (Business Proposal) تحریر کریں۔')}
                  className="p-2.5 text-xs text-right bg-[#080B14] hover:bg-white/5 border border-white/10 rounded-xl text-slate-300 transition-colors cursor-pointer font-medium"
                  dir="rtl"
                >
                  💼 اردو میں کاروباری پرپوزل
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isUrduScript = /[\u0600-\u06FF]/.test(msg.content);

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 text-left ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#287BFF] to-[#8955FF] p-0.5 shrink-0 flex items-center justify-center mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#287BFF] text-white rounded-tr-none'
                        : 'bg-[#080B14] text-slate-200 border border-white/10 rounded-tl-none shadow-md'
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 mb-1 border-b border-white/5 pb-1">
                      <span className="font-semibold text-slate-300">
                        {isUser ? currentUser.displayName : 'NEXORA Intelligence'}
                      </span>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Content body */}
                    <div
                      className={`whitespace-pre-wrap font-sans ${isUrduScript ? 'font-medium leading-loose text-base' : ''}`}
                      dir={isUrduScript ? 'rtl' : 'ltr'}
                    >
                      {msg.content}
                    </div>

                    {/* Action controls for assistant replies */}
                    {!isUser && (
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="font-mono text-[10px]">model: gemini-3.8-flash</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSpeech(msg.content, msg.id)}
                            className="p-1 hover:text-white transition-colors cursor-pointer"
                            title="Listen with Speech Synthesis"
                          >
                            {isSpeakingId === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-[#287BFF]" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleCopyText(msg.content, msg.id)}
                            className="p-1 hover:text-white transition-colors cursor-pointer"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-lg bg-[#101629] border border-white/10 shrink-0 flex items-center justify-center text-xs font-bold text-white mt-1">
                      {currentUser.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {loading && (
            <div className="flex gap-3 items-center text-left">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#287BFF] to-[#8955FF] p-0.5 shrink-0 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="p-3.5 rounded-2xl bg-[#080B14] border border-white/10 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#287BFF] animate-spin" />
                <span>NEXORA is thinking and analyzing context...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#0A0E1A] border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Message NEXORA Intelligence in English, Urdu (اردو), or Roman Urdu..."
              className="flex-1 px-4 py-3 text-xs sm:text-sm text-white bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-[#287BFF] transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-3 text-white bg-gradient-to-r from-[#287BFF] to-[#8955FF] hover:opacity-95 rounded-xl disabled:opacity-40 transition-opacity cursor-pointer shrink-0 shadow-md shadow-[#287BFF]/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
