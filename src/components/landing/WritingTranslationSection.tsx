import React, { useState } from 'react';
import { PenTool, Globe, Copy, Check, ArrowRight, Volume2 } from 'lucide-react';

interface WritingTranslationSectionProps {
  onOpenStudio: () => void;
  onOpenTranslator: () => void;
}

export const WritingTranslationSection: React.FC<WritingTranslationSectionProps> = ({
  onOpenStudio,
  onOpenTranslator,
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  const samples = {
    english: "Empowering businesses and ambitious learners across Pakistan and worldwide with next-generation digital intelligence.",
    urdu: "پاکستان اور دنیا بھر کے کاروباروں اور باصلاحیت طلباء کو جدید ترین ڈیجیٹل انٹیلیجنس کے ذریعے بااختیار بنانا۔",
    romanUrdu: "Pakistan aur dunya bhar kay karobaron aur ba-salahiyat talba ko jadeed tareen digital intelligence kay zariye ba-ikhtiyar banana.",
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="studio" className="py-20 bg-[#0A0E1A] border-t border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-semibold tracking-wider text-[#8955FF] uppercase">
            Writing & Translation Studio
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            High-Fidelity Urdu, Roman Urdu & English Nuance
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Most generic AI models falter with Pakistani dialects or default to Devanagari Hindi. NEXORA Intelligence respects authentic Urdu script and colloquial Roman Urdu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          {/* Card 1: English Output */}
          <div className="p-6 rounded-2xl bg-[#101629] border border-white/10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-2">
                <span className="font-semibold text-white">English (International)</span>
                <span className="text-[11px] font-mono text-[#287BFF]">Source</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {samples.english}
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-500">Global Executive English</span>
              <button
                onClick={() => handleCopy(samples.english, 'en')}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copy English text"
              >
                {copied === 'en' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Card 2: Authentic Urdu Script */}
          <div className="p-6 rounded-2xl bg-[#101629] border border-[#8955FF]/30 flex flex-col justify-between shadow-lg shadow-[#8955FF]/10">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-2">
                <span className="font-semibold text-white">Urdu Script (اردو نستعلیق)</span>
                <span className="text-[11px] font-mono text-[#8955FF]">Target</span>
              </div>
              <p className="text-base text-slate-100 leading-loose text-right font-medium" dir="rtl">
                {samples.urdu}
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-500">Authentic Urdu Grammar</span>
              <button
                onClick={() => handleCopy(samples.urdu, 'ur')}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copy Urdu text"
              >
                {copied === 'ur' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Card 3: Roman Urdu */}
          <div className="p-6 rounded-2xl bg-[#101629] border border-white/10 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-2">
                <span className="font-semibold text-white">Roman Urdu (Phonetic)</span>
                <span className="text-[11px] font-mono text-cyan-400">Localized</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed italic">
                "{samples.romanUrdu}"
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-slate-500">Colloquial Pakistani Tone</span>
              <button
                onClick={() => handleCopy(samples.romanUrdu, 'ro')}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copy Roman Urdu text"
              >
                {copied === 'ro' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Action strip */}
        <div className="mt-12 p-6 rounded-2xl bg-[#101629] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-white">Need tailored copywriting or document translation?</h4>
            <p className="text-xs text-slate-400">Access the full 13-tool studio with custom tones, resume builder, and ad copywriting.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenStudio}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-[#8955FF] hover:bg-[#7840f0] rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              Open Writing Studio
            </button>
            <button
              onClick={onOpenTranslator}
              className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              Open Translator
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
