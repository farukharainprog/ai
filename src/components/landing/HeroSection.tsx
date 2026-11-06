import React from 'react';
import { ArrowRight, Sparkles, MessageSquare, BookOpen, PenTool, Globe, Briefcase, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onStartFree: () => void;
  onExploreFeatures: () => void;
  onSelectPromptStarter: (prompt: string, tool: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartFree,
  onExploreFeatures,
  onSelectPromptStarter,
}) => {
  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#287BFF]/15 via-[#8955FF]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#287BFF] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#287BFF]" />
              <span>NEXORA Intelligence Platform</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">English, Urdu & Roman Urdu</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
              Your Smart Digital <span className="nexora-gradient-text">Partner.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              A unified, production-grade AI ecosystem crafted for students, educators, freelancers, developers, and businesses across Pakistan and global markets. Chat with depth, craft winning proposals, master complex subjects, and plan your growth.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartFree}
                className="flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-[#287BFF] to-[#8955FF] rounded-xl hover:opacity-95 shadow-lg shadow-[#287BFF]/25 hover:shadow-[#287BFF]/40 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Start Free Today</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreFeatures}
                className="flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Explore Capabilities</span>
              </button>
            </div>

            {/* Key benefits list without pills */}
            <div className="pt-4 flex flex-wrap gap-y-2 gap-x-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero configuration required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Urdu Nastaliq & Roman Urdu fidelity</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Easypaisa & JazzCash billing ready</span>
              </div>
            </div>

            {/* Quick interactive prompt starters */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <span className="text-xs text-slate-400 font-medium">Try a sample prompt:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onSelectPromptStarter('Mujhe freelance web development client ke liye aik winning proposal likh kar dein.', 'studio')}
                  className="text-xs text-left px-3 py-1.5 bg-[#101629] hover:bg-[#161e38] text-slate-200 border border-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  💬 Upwork Proposal in Roman Urdu
                </button>
                <button
                  onClick={() => onSelectPromptStarter('Explain Newton\'s three laws of motion with real-life cricket examples for a 10th grade student.', 'study')}
                  className="text-xs text-left px-3 py-1.5 bg-[#101629] hover:bg-[#161e38] text-slate-200 border border-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  📚 Physics Newton's Laws Explained
                </button>
                <button
                  onClick={() => onSelectPromptStarter('Generate a 30-day marketing plan for an online clothing brand in Lahore.', 'business')}
                  className="text-xs text-left px-3 py-1.5 bg-[#101629] hover:bg-[#161e38] text-slate-200 border border-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  🚀 Pakistan E-Commerce Marketing Plan
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Neural Core Display */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#101629] shadow-2xl shadow-[#287BFF]/20 group">
              <img
                src="/src/assets/images/hero_neural_core_1793892538265.jpg"
                alt="NEXORA Intelligence Neural Core"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B14] via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl backdrop-blur-md bg-[#080B14]/80 border border-white/10 text-left">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-semibold text-white">NEXORA Core Engine</span>
                  <span className="text-[#287BFF] font-mono">gemini-3.8-flash</span>
                </div>
                <p className="text-xs text-slate-300">
                  Multimodal intelligence with contextual memory, multi-lingual Urdu synthesis, and sub-second inference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
