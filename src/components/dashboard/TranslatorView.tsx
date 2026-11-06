import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { translateContent } from '../../services/gemini';
import {
  Globe,
  ArrowRightLeft,
  Copy,
  Check,
  Trash2,
  Volume2,
  VolumeX,
  Sparkles,
  AlertCircle,
  Languages,
} from 'lucide-react';

interface TranslatorViewProps {
  currentUser: UserProfile;
  onQuotaUpdate?: (remaining: number) => void;
}

export const TranslatorView: React.FC<TranslatorViewProps> = ({ currentUser, onQuotaUpdate }) => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [fromLang, setFromLang] = useState('English');
  const [toLang, setToLang] = useState('Urdu (اردو)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const languageOptions = [
    'English',
    'Urdu (اردو)',
    'Roman Urdu',
    'Arabic (العربية)',
    'Turkish (Türkçe)',
    'French (Français)',
    'German (Deutsch)',
    'Spanish (Español)',
    'Chinese (Mandarin)',
    'Persian (فارسی)',
  ];

  const handleTranslate = async (textToUse?: string) => {
    const text = (textToUse || inputText).trim();
    if (!text || loading) return;

    setError(null);
    setLoading(true);

    try {
      const response = await translateContent({
        text,
        fromLang,
        toLang,
        userId: currentUser.id,
        plan: currentUser.plan,
      });

      setTranslatedText(response.translatedText);
      if (onQuotaUpdate && typeof response.remainingQuota === 'number') {
        onQuotaUpdate(response.remainingQuota);
      }
    } catch (err: any) {
      setError(err?.message || 'Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const prevFrom = fromLang;
    const prevTo = toLang;
    setFromLang(prevTo);
    setToLang(prevFrom);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setError(null);
  };

  const handleSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#`_]/g, ''));
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const isUrduScript = /[\u0600-\u06FF]/.test(translatedText);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>AI Multi-Lingual Translator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Preserves nuances, idioms, and authentic Urdu Nastaliq & Roman Urdu structures.
          </p>
        </div>
      </div>

      {/* Language Selector Bar */}
      <div className="p-4 rounded-2xl bg-[#101629] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-white bg-[#080B14] border border-white/10 rounded-xl outline-none cursor-pointer focus:border-cyan-400"
          >
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <button
            onClick={handleSwap}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-white transition-colors cursor-pointer"
            title="Swap Source and Target Languages"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-white bg-[#080B14] border border-white/10 rounded-xl outline-none cursor-pointer focus:border-cyan-400"
          >
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {inputText && (
            <button
              onClick={handleClear}
              className="p-2 text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Clear text"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => handleTranslate()}
            disabled={loading || !inputText.trim()}
            className="px-5 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-all disabled:opacity-40 shadow-lg shadow-cyan-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Translating...' : 'Translate'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Two-Column Translation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Box */}
        <div className="p-5 rounded-2xl bg-[#101629] border border-white/10 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-2">
            <span className="font-semibold text-white">Source: {fromLang}</span>
            <span>{inputText.length} characters</span>
          </div>

          <textarea
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste text to translate..."
            className="w-full flex-1 p-3 text-xs sm:text-sm text-white bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
          />

          {/* Quick suggestions */}
          <div className="pt-2 flex flex-wrap gap-1.5">
            <button
              onClick={() => {
                const sample = 'Where is the nearest tech incubator in Islamabad?';
                setInputText(sample);
                handleTranslate(sample);
              }}
              className="px-2.5 py-1 text-[11px] rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              Sample: Nearest tech incubator
            </button>
            <button
              onClick={() => {
                const sample = 'Please review the attached invoice for project milestone 2.';
                setInputText(sample);
                handleTranslate(sample);
              }}
              className="px-2.5 py-1 text-[11px] rounded bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              Sample: Review project invoice
            </button>
          </div>
        </div>

        {/* Target Box */}
        <div className="p-5 rounded-2xl bg-[#101629] border border-white/10 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-2">
            <span className="font-semibold text-white">Translation: {toLang}</span>
            {translatedText && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSpeech(translatedText)}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  title="Pronounce translation"
                >
                  {speaking ? <VolumeX className="w-3.5 h-3.5 text-cyan-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleCopy}
                  className="p-1 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  title="Copy text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[220px] p-3 rounded-xl bg-[#080B14] border border-white/10 flex flex-col justify-between">
            {translatedText ? (
              <div
                className={`text-xs sm:text-base leading-relaxed text-slate-100 whitespace-pre-wrap ${
                  isUrduScript ? 'text-right font-medium leading-loose' : ''
                }`}
                dir={isUrduScript ? 'rtl' : 'ltr'}
              >
                {translatedText}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                <Languages className="w-8 h-8 text-slate-600" />
                <p className="text-xs">Your translation will appear here.</p>
              </div>
            )}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Preserves grammatical gender and honorifics (آپ / جناب)</span>
            <span className="font-mono text-[10px]">Context-verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
