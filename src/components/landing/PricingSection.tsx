import React, { useState } from 'react';
import { Check, Sparkles, Shield, ArrowRight } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (plan: 'free' | 'plus' | 'pro', currency: 'PKR' | 'USD') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR');

  const plans = [
    {
      id: 'free' as const,
      name: 'Free Starter',
      target: 'For students and casual learners',
      price: currency === 'PKR' ? 'Rs. 0' : '$0',
      period: 'forever',
      desc: 'Essential AI capabilities for daily queries and basic writing tasks.',
      highlighted: false,
      features: [
        '30 AI queries per day',
        'Gemini 3.8 Flash model access',
        'Basic AI Writing Studio tools',
        'Standard Urdu & English translation',
        'Personal to-do list & planner',
        'Public community support',
      ],
      ctaText: 'Start Free',
      ctaStyle: 'bg-white/5 hover:bg-white/10 text-white border border-white/10',
    },
    {
      id: 'plus' as const,
      name: 'NEXORA Plus',
      target: 'For active students & freelancers',
      price: currency === 'PKR' ? 'Rs. 499' : '$4.99',
      period: 'per month',
      desc: 'Expanded quotas and specialized academic and client proposal tools.',
      highlighted: true,
      badge: 'Most Popular',
      features: [
        '200 AI queries per day',
        'High-speed priority response latency',
        'Full 13-tool AI Writing Studio',
        'Academic Study Assistant & Quiz generator',
        'Bi-directional Urdu, Roman Urdu & World translation',
        'Easypaisa, JazzCash & Card payment support',
      ],
      ctaText: 'Upgrade to Plus',
      ctaStyle: 'bg-[#287BFF] hover:bg-[#2066d9] text-white shadow-lg shadow-[#287BFF]/30',
    },
    {
      id: 'pro' as const,
      name: 'NEXORA Pro',
      target: 'For agencies & power professionals',
      price: currency === 'PKR' ? 'Rs. 999' : '$9.99',
      period: 'per month',
      desc: 'Maximum throughput and deep business strategy intelligence.',
      highlighted: false,
      features: [
        '1,000 AI queries per day',
        'Priority queue processing during peak hours',
        'Full Business Strategy & Startup Planner',
        'Interactive Quiz scoring & Exam simulation',
        'Advanced speech audio synthesis',
        'Direct priority support channel',
      ],
      ctaText: 'Upgrade to Pro',
      ctaStyle: 'bg-gradient-to-r from-[#287BFF] to-[#8955FF] hover:opacity-95 text-white shadow-lg shadow-[#8955FF]/20',
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-[#0A0E1A] border-t border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <p className="text-xs font-semibold tracking-wider text-[#287BFF] uppercase">
            Transparent Subscription Architecture
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Fair, Transparent Pricing for Everyone
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Honest pricing with explicit daily limits. Local Pakistani checkout via Easypaisa & JazzCash alongside international card options.
          </p>

          {/* Interactive Currency Selector (Functional Button Segment) */}
          <div className="pt-4 flex items-center justify-center">
            <div className="inline-flex p-1 rounded-xl bg-[#101629] border border-white/10">
              <button
                type="button"
                onClick={() => setCurrency('PKR')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  currency === 'PKR' ? 'bg-[#287BFF] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                PKR (Rs. Pakistan)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  currency === 'USD' ? 'bg-[#287BFF] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                USD ($ International)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-[#101629] border-2 border-[#287BFF] shadow-2xl shadow-[#287BFF]/15 scale-105 z-10'
                  : 'bg-[#101629] border border-white/10 hover:border-white/20'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#287BFF] to-[#8955FF] text-white text-[11px] font-bold rounded-full shadow-md uppercase tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.target}</p>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-white font-mono tabular-nums">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-400">/{plan.period}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{plan.desc}</p>

                <div className="pt-4 border-t border-white/5 space-y-2.5">
                  <span className="text-xs font-semibold text-slate-300 block">Included capabilities:</span>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {plan.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => onSelectPlan(plan.id, currency)}
                  className={`w-full py-3 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 ${plan.ctaStyle}`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment gateways note */}
        <div className="mt-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Manual and automated Easypaisa & JazzCash payment validation supervised by administration.</span>
        </div>
      </div>
    </section>
  );
};
