import React from 'react';
import { MessageSquare, PenTool, BookOpen, Globe, Briefcase, CalendarCheck, ArrowRight } from 'lucide-react';

interface FeatureGridProps {
  onSelectFeature: (featureKey: string) => void;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ onSelectFeature }) => {
  const features = [
    {
      id: 'chat',
      title: '01. Conversational AI Assistant',
      desc: 'Engage in natural, multi-turn dialogue with deep reasoning. Effortlessly switches between English, authentic Urdu, and Roman Urdu without defaulting to Hindi.',
      icon: MessageSquare,
      accent: 'from-[#287BFF]/20 to-[#287BFF]/5',
      borderColor: 'hover:border-[#287BFF]/50',
      tag: 'Multi-lingual Intelligence · Urdu & Roman Urdu Supported',
    },
    {
      id: 'studio',
      title: '02. AI Writing Studio',
      desc: '13 high-caliber writing tools: client emails, Upwork proposals, resumes, Instagram captions, YouTube scripts, and SEO articles with granular tone control.',
      icon: PenTool,
      accent: 'from-[#8955FF]/20 to-[#8955FF]/5',
      borderColor: 'hover:border-[#8955FF]/50',
      tag: '13 Professional Formats · Custom Tone & Audience',
    },
    {
      id: 'study',
      title: '03. Academic Study Assistant',
      desc: 'Pedagogical tutoring that explains math, physics, and science step by step. Generates interactive multiple-choice quizzes and chapter revision summaries.',
      icon: BookOpen,
      accent: 'from-emerald-500/20 to-emerald-500/5',
      borderColor: 'hover:border-emerald-500/50',
      tag: 'Step-by-Step Logic · Interactive MCQ Scoring',
    },
    {
      id: 'translate',
      title: '04. Multi-Lingual Translator',
      desc: 'High-fidelity bidirectional translation for English, Urdu (نستعلیق), Roman Urdu, Arabic, and major world languages, preserving cultural context and idioms.',
      icon: Globe,
      accent: 'from-cyan-500/20 to-cyan-500/5',
      borderColor: 'hover:border-cyan-500/50',
      tag: 'Context Preservation · Audio Speech Playback',
    },
    {
      id: 'business',
      title: '05. Business & Strategy Partner',
      desc: 'Generate viable business plans, financial projections, social media calendars, and sales scripts tuned for Pakistan and international market expansion.',
      icon: Briefcase,
      accent: 'from-amber-500/20 to-amber-500/5',
      borderColor: 'hover:border-amber-500/50',
      tag: 'Market Strategy · Sales & Pricing Architecture',
    },
    {
      id: 'planner',
      title: '06. Personal Productivity Suite',
      desc: 'Organize your day with prioritized tasks, long-term goal tracking, study schedules, and an autosaved markdown scratchpad for quick ideas.',
      icon: CalendarCheck,
      accent: 'from-purple-500/20 to-purple-500/5',
      borderColor: 'hover:border-purple-500/50',
      tag: 'Task Organization · Academic Timetable Manager',
    },
  ];

  return (
    <section id="capabilities" className="py-20 bg-[#0A0E1A] border-t border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-semibold tracking-wider text-[#287BFF] uppercase">
            Platform Capabilities
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Six Dedicated Modules. One Unified Workspace.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            NEXORA Intelligence is engineered as a comprehensive digital ecosystem, eliminating the need to jump between disconnected single-purpose tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => onSelectFeature(feature.id)}
                className={`group relative p-6 rounded-2xl bg-[#101629] border border-white/10 ${feature.borderColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.accent} border border-white/10 flex items-center justify-center text-white`}>
                    <Icon className="w-6 h-6 text-[#287BFF] group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Clean unboxed metadata separator */}
                  <div className="text-[11px] text-slate-400">
                    {feature.tag}
                  </div>

                  <h3 className="text-lg font-semibold text-white tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-medium text-[#287BFF] group-hover:text-white transition-colors">
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
