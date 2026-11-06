import React, { useState } from 'react';
import { BookOpen, CheckCircle, HelpCircle, Sparkles, Award, ArrowRight } from 'lucide-react';

interface EducationSectionProps {
  onLaunchStudy: () => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ onLaunchStudy }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const sampleQuestion = {
    question: "If a cricket ball of mass 0.16 kg is bowled at 30 m/s, what is its momentum?",
    options: [
      "2.4 kg·m/s",
      "4.8 kg·m/s",
      "0.48 kg·m/s",
      "48.0 kg·m/s",
    ],
    correctIndex: 1,
    explanation: "Momentum (p) = mass (m) × velocity (v) = 0.16 kg × 30 m/s = 4.8 kg·m/s. Step-by-step clarity makes physical sciences intuitive!",
  };

  return (
    <section id="study" className="py-20 bg-[#080B14] border-t border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Explanatory Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>NEXORA Academic Assistant</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Primary to University Level</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
              Never Settle for Plain Answers. Master the Underlying Science.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Unlike generic chatbots that regurgitate raw homework answers, the NEXORA Study Assistant is trained to teach. It breaks down complex calculus, organic chemistry, matriculation/O-level physics, and English grammar into step-by-step logic.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Step-by-Step Problem Solving</h4>
                  <p className="text-xs text-slate-400">Guides students through equations line by line with clear rationale.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Interactive MCQ & Quiz Generator</h4>
                  <p className="text-xs text-slate-400">Generate custom practice quizzes for any chapter with instant score feedback.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Bilingual Explanation Capability</h4>
                  <p className="text-xs text-slate-400">Explains English or scientific terminology in plain Urdu or Roman Urdu.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onLaunchStudy}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Launch Study Assistant</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Live Interactive Quiz Simulation Component */}
          <div className="lg:col-span-6">
            <div className="p-6 rounded-2xl bg-[#101629] border border-white/10 shadow-xl space-y-5 text-left">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-white">Interactive Physics Quiz Demo</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Question 1 of 1</span>
              </div>

              <p className="text-sm font-medium text-slate-200">
                {sampleQuestion.question}
              </p>

              <div className="space-y-2">
                {sampleQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === sampleQuestion.correctIndex;
                  let btnStyle = "bg-[#080B14] border-white/10 text-slate-300 hover:border-white/30";
                  if (showAnswer) {
                    if (isCorrect) btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-200";
                    else if (isSelected) btnStyle = "bg-rose-500/20 border-rose-500 text-rose-200";
                  } else if (isSelected) {
                    btnStyle = "bg-[#287BFF]/20 border-[#287BFF] text-white";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedOption(idx);
                        setShowAnswer(true);
                      }}
                      className={`w-full text-left p-3 text-xs font-medium rounded-xl border transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>
                        <strong className="mr-2 text-slate-400">{String.fromCharCode(65 + idx)}.</strong>
                        {option}
                      </span>
                      {showAnswer && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>

              {showAnswer && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 space-y-1">
                  <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>NEXORA Tutor Explanation:</span>
                  </div>
                  <p className="leading-relaxed">{sampleQuestion.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
