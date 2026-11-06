import React, { useState } from 'react';
import { UserProfile, WritingToolType } from '../../types';
import { generateWritingStudio } from '../../services/gemini';
import {
  PenTool,
  Copy,
  Check,
  Download,
  Sparkles,
  AlertCircle,
  Mail,
  MessageCircle,
  FileText,
  Instagram,
  Youtube,
  Share2,
  FileCheck,
  Tag,
  Briefcase,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface WritingStudioProps {
  currentUser: UserProfile;
  onQuotaUpdate?: (remaining: number) => void;
  initialPrompt?: string;
}

export const WritingStudio: React.FC<WritingStudioProps> = ({
  currentUser,
  onQuotaUpdate,
  initialPrompt = '',
}) => {
  const [activeTool, setActiveTool] = useState<WritingToolType>('email');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [tone, setTone] = useState('Professional');
  const [language, setLanguage] = useState('English');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const tools: { id: WritingToolType; name: string; desc: string; icon: any; placeholder: string }[] = [
    {
      id: 'email',
      name: 'Email Writer',
      desc: 'High-impact cold emails, follow-ups, and corporate correspondence.',
      icon: Mail,
      placeholder: 'Describe your email recipient, core message, and required call to action...',
    },
    {
      id: 'client_message',
      name: 'Client Message',
      desc: 'Polished WhatsApp, Slack, or Upwork messaging for freelance clients.',
      icon: MessageCircle,
      placeholder: 'What update, deliverable, or query are you sending to the client?',
    },
    {
      id: 'business_proposal',
      name: 'Business Proposal',
      desc: 'Structured freelance project bids and corporate service proposals.',
      icon: Briefcase,
      placeholder: 'Enter client requirements, budget range, and your proposed deliverables...',
    },
    {
      id: 'cv_resume',
      name: 'CV & Resume Assistant',
      desc: 'ATS-optimized professional work experience bullets and summary statements.',
      icon: FileCheck,
      placeholder: 'Paste your current job title, skills, and key achievements to format...',
    },
    {
      id: 'cover_letter',
      name: 'Cover Letter',
      desc: 'Tailored application letters matching specific company job descriptions.',
      icon: FileText,
      placeholder: 'Enter the job title, target company name, and why you are the ideal candidate...',
    },
    {
      id: 'facebook_post',
      name: 'Facebook Post',
      desc: 'Engaging social media posts with hook questions and community call-outs.',
      icon: Share2,
      placeholder: 'What news, story, or product announcement do you want to share?',
    },
    {
      id: 'instagram_caption',
      name: 'Instagram Caption',
      desc: 'Punchy captions with aesthetic line breaks and trending niche hashtags.',
      icon: Instagram,
      placeholder: 'Describe the photo, reel concept, or promotional message...',
    },
    {
      id: 'youtube_description',
      name: 'YouTube Description',
      desc: 'SEO-optimized video summaries, timestamp placeholders, and links.',
      icon: Youtube,
      placeholder: 'What is your video about? Include main topics covered...',
    },
    {
      id: 'product_description',
      name: 'Product Description',
      desc: 'Benefit-driven e-commerce copy for Shopify, Daraz, or Amazon.',
      icon: Tag,
      placeholder: 'Enter product name, materials, features, and target buyers...',
    },
    {
      id: 'ad_copy',
      name: 'Advertisement Copy',
      desc: 'High-converting headlines and primary text for Meta & Google ads.',
      icon: Sparkles,
      placeholder: 'Enter your offer, target audience pain points, and discount/guarantee...',
    },
    {
      id: 'blog_article',
      name: 'Blog & Article Writer',
      desc: 'In-depth thought leadership pieces with H2/H3 subheadings and takeaway points.',
      icon: Layers,
      placeholder: 'Enter the article title or central topic and target keyword...',
    },
    {
      id: 'grammar_polish',
      name: 'Grammar Polish',
      desc: 'Flawless grammatical correction and tone refinement.',
      icon: PenTool,
      placeholder: 'Paste any draft in English, Urdu, or Roman Urdu to polish and refine...',
    },
    {
      id: 'summarizer',
      name: 'Text Summarizer',
      desc: 'Distill long reports, articles, or transcripts into key executive bullets.',
      icon: FileText,
      placeholder: 'Paste the full text or document excerpts you wish to summarize...',
    },
  ];

  const currentToolObj = tools.find((t) => t.id === activeTool) || tools[0];

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setError(null);
    setLoading(true);

    try {
      const response = await generateWritingStudio({
        toolType: currentToolObj.name,
        prompt,
        tone,
        language,
        userId: currentUser.id,
        plan: currentUser.plan,
      });

      setGeneratedContent(response.result);
      if (onQuotaUpdate && typeof response.remainingQuota === 'number') {
        onQuotaUpdate(response.remainingQuota);
      }
    } catch (err: any) {
      setError(err?.message || 'Writing Studio generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexora_${activeTool}_output.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <PenTool className="w-5 h-5 text-[#8955FF]" />
            <span>AI Writing Studio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            13 specialized writing engines tuned for international and Pakistani market messaging.
          </p>
        </div>
      </div>

      {/* Horizontal Tool Selector Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTool(t.id);
                setError(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#287BFF] to-[#8955FF] text-white shadow-md shadow-[#8955FF]/20'
                  : 'bg-[#101629] text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Instructions & Config */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#101629] border border-white/10 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {currentToolObj.name} Engine
              </span>
              <p className="text-xs text-slate-400">{currentToolObj.desc}</p>
            </div>

            {/* Prompt Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Instructions & Subject
              </label>
              <textarea
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={currentToolObj.placeholder}
                className="w-full p-3 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-[#8955FF] resize-none leading-relaxed"
              />
            </div>

            {/* Tone & Language Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tone of Voice</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-2.5 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-[#8955FF] cursor-pointer"
                >
                  <option value="Professional & Executive">Professional & Executive</option>
                  <option value="Persuasive & High-Converting">Persuasive & High-Converting</option>
                  <option value="Warm & Friendly">Warm & Friendly</option>
                  <option value="Urdu Formal (رسمی اردو)">Urdu Formal (رسمی اردو)</option>
                  <option value="Academic & Rigorous">Academic & Rigorous</option>
                  <option value="Casual & Relatable">Casual & Relatable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Output Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2.5 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-[#8955FF] cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Urdu (اردو نستعلیق)">Urdu (اردو نستعلیق)</option>
                  <option value="Roman Urdu">Roman Urdu</option>
                  <option value="Arabic">Arabic</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-gradient-to-r from-[#287BFF] to-[#8955FF] hover:opacity-95 rounded-xl transition-all disabled:opacity-40 shadow-lg shadow-[#8955FF]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Generating Content...' : 'Generate Content'}</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Area: Output Editor & Actions */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="p-5 rounded-2xl bg-[#101629] border border-white/10 flex-1 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Generated Content Editor</span>
                <span className="text-[11px] text-slate-500">· Real-time editable</span>
              </div>

              {generatedContent && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                    title="Download as markdown"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            {/* Editable Result Area */}
            <div className="flex-1 min-h-[360px] flex flex-col">
              {generatedContent ? (
                <textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  className="w-full flex-1 p-3 text-xs sm:text-sm text-slate-100 bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-[#8955FF] resize-none leading-relaxed font-sans"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3 border border-dashed border-white/10 rounded-xl">
                  <PenTool className="w-8 h-8 text-slate-600" />
                  <p className="text-xs max-w-sm leading-relaxed">
                    Select a tool, enter your topic or source text, and click "Generate Content" to craft your document.
                  </p>
                </div>
              )}
            </div>

            {generatedContent && (
              <div className="pt-2 text-right text-[11px] text-slate-500">
                Word count: {generatedContent.trim().split(/\s+/).filter(Boolean).length} words
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
