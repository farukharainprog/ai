import React, { useState } from 'react';
import { UserProfile, BusinessToolType } from '../../types';
import { generateBusinessAssistant } from '../../services/gemini';
import {
  Briefcase,
  TrendingUp,
  Target,
  Sparkles,
  ShieldAlert,
  Copy,
  Check,
  Compass,
  DollarSign,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface BusinessAssistantProps {
  currentUser: UserProfile;
  onQuotaUpdate?: (remaining: number) => void;
  initialPrompt?: string;
}

export const BusinessAssistant: React.FC<BusinessAssistantProps> = ({
  currentUser,
  onQuotaUpdate,
  initialPrompt = '',
}) => {
  const [toolType, setToolType] = useState<BusinessToolType>('business_plan');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [marketContext, setMarketContext] = useState('Pakistan & Overseas Exports');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const tools: { id: BusinessToolType; label: string; desc: string; icon: any; placeholder: string }[] = [
    {
      id: 'business_plan',
      label: 'Lean Business Canvas',
      desc: 'Formulate value proposition, customer segments, cost structures, and revenue streams.',
      icon: Briefcase,
      placeholder: 'Describe your business concept, target customers, and primary product or service...',
    },
    {
      id: 'idea_generator',
      label: 'Startup Idea Generator',
      desc: 'Identify high-potential, underserved market opportunities in Pakistan and globally.',
      icon: Compass,
      placeholder: 'What industry, budget level, or technical background do you want to explore?',
    },
    {
      id: 'marketing_strategy',
      label: '30-Day Marketing Plan',
      desc: 'Structured weekly customer acquisition roadmap across Meta, TikTok, and SEO.',
      icon: Target,
      placeholder: 'Describe your product, pricing, and initial marketing budget...',
    },
    {
      id: 'sales_pitch',
      label: 'Sales Pitch & Cold Call Script',
      desc: 'High-converting objection handling and outbound sales outreach frameworks.',
      icon: TrendingUp,
      placeholder: 'What are you selling, and what is the biggest pain point of the buyer?',
    },
    {
      id: 'brand_names',
      label: 'Brand Name & Tagline Ideator',
      desc: 'Memorable, brandable company names with available domain rationale.',
      icon: Sparkles,
      placeholder: 'What does your brand stand for? What emotions or vibes should it evoke?',
    },
  ];

  const currentToolObj = tools.find((t) => t.id === toolType) || tools[0];

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setError(null);
    setLoading(true);

    try {
      const response = await generateBusinessAssistant({
        toolType: currentToolObj.label,
        prompt,
        marketContext,
        userId: currentUser.id,
        plan: currentUser.plan,
      });

      setResult(response.result);
      if (onQuotaUpdate && typeof response.remainingQuota === 'number') {
        onQuotaUpdate(response.remainingQuota);
      }
    } catch (err: any) {
      setError(err?.message || 'Business generation error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <span>AI Business & Strategy Partner</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Strategic planning, marketing funnels, and pitch formulation for entrepreneurs & freelancers.
          </p>
        </div>
      </div>

      {/* Tools Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = toolType === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setToolType(t.id);
                setError(null);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                  : 'bg-[#101629] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold">{t.label}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">{t.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Pane */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-[#101629] border border-white/10 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Market Context
              </label>
              <select
                value={marketContext}
                onChange={(e) => setMarketContext(e.target.value)}
                className="w-full p-2.5 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Pakistan Domestic (Karachi, Lahore, Islamabad, Tier-2 cities)">
                  Pakistan Domestic (Tier 1 & Tier 2 Cities)
                </option>
                <option value="Pakistan & Overseas Exports (GCC, UK, North America)">
                  Pakistan & Overseas Exports (GCC / UK / US)
                </option>
                <option value="Global Remote / Freelance Agency">
                  Global Remote / Freelance Agency (Upwork / B2B)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Business Concept & Objective
              </label>
              <textarea
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={currentToolObj.placeholder}
                className="w-full p-3 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full py-3 px-4 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-xl transition-all disabled:opacity-40 shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Synthesizing Strategy...' : 'Generate Blueprint'}</span>
            </button>
          </div>

          {/* Regulatory Disclaimer Card */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Educational Guidance Notice:</strong> Business strategies generated are strictly for educational planning. Consult licensed legal and tax advisors for regulatory compliance.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Output Pane */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="p-5 rounded-2xl bg-[#101629] border border-white/10 flex-1 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">Strategic Strategy Output</span>
              </div>

              {result && (
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="flex-1 min-h-[360px] overflow-y-auto">
              {result ? (
                <div className="p-4 rounded-xl bg-[#080B14] border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {result}
                </div>
              ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3 border border-dashed border-white/10 rounded-xl">
                  <Briefcase className="w-8 h-8 text-slate-600" />
                  <p className="text-xs max-w-sm leading-relaxed">
                    Select a tool and outline your venture or client challenge to produce actionable operational roadmaps.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
