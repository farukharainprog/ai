import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does NEXORA Intelligence handle Urdu and Roman Urdu?',
      a: 'NEXORA Intelligence uses custom system instructions tuned specifically for Pakistani linguistic nuance. When you prompt in Urdu script (اردو), it responds in authentic Urdu without slipping into Hindi or Devanagari. When you write in Roman Urdu (e.g., "Mujhe CV bana kar dein"), it communicates in natural, conversational Pakistani Roman Urdu.',
    },
    {
      q: 'Which AI models power the platform?',
      a: 'The platform integrates Google\'s latest Gemini model family (configured dynamically on the server-side, defaulting to gemini-3.8-flash). The server securely handles all API keys, rate limiting, and token counters, so keys are never exposed to client browsers.',
    },
    {
      q: 'Can I pay for NEXORA Plus or Pro using Easypaisa or JazzCash?',
      a: 'Yes. We support direct Pakistani payment gateways including Easypaisa and JazzCash, alongside direct local bank transfer and international credit/debit cards. Once you transfer the subscription fee, simply enter your Transaction ID (TID) in the Billing portal for verified administrative clearance.',
    },
    {
      q: 'How is user privacy and study data protected?',
      a: 'We strictly isolate user conversations and planner data. Passwords and credentials are cryptographically protected, conversation contents are never sold to data brokers, and users have single-click data export and account deletion controls.',
    },
    {
      q: 'What happens when I reach my daily message quota?',
      a: 'Every user has a daily allowance (30 queries on Free, 200 on Plus, 1,000 on Pro). If you reach your limit, your quota cleanly resets at midnight UTC, or you can instantly upgrade your tier for higher throughput.',
    },
    {
      q: 'Can teachers or institutions adopt NEXORA for classrooms?',
      a: 'Absolutely. The Study Assistant is intentionally designed with pedagogical discipline: rather than providing raw test cheat-sheets, it provides conceptual explanations, interactive quizzes with scored MCQs, and step-by-step math derivations.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#080B14] border-t border-white/5 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <p className="text-xs font-semibold tracking-wider text-[#287BFF] uppercase">
            Got Questions?
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Everything you need to know about NEXORA Intelligence, payments, and language support.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#101629] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-semibold text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#287BFF]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
