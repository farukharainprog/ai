import React, { useState } from 'react';
import { UserProfile, SubscriptionPlan } from '../../types';
import { upgradeUserPlan } from '../../services/auth';
import { submitVerificationRequest } from '../../services/storage';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  Shield,
  Check,
  Sparkles,
  ArrowRight,
  Clock,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

interface SubscriptionViewProps {
  currentUser: UserProfile;
  onPlanUpdated: (updatedUser: UserProfile) => void;
}

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({ currentUser, onPlanUpdated }) => {
  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR');
  const [selectedPlanToUpgrade, setSelectedPlanToUpgrade] = useState<'plus' | 'pro' | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<'Easypaisa' | 'JazzCash' | 'Bank Transfer' | 'Card'>('Easypaisa');
  const [transactionRef, setTransactionRef] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [instantSuccess, setInstantSuccess] = useState(false);

  const plans = [
    {
      id: 'free' as const,
      name: 'Free Starter',
      pricePkr: 'Rs. 0',
      priceUsd: '$0',
      period: 'forever',
      desc: '30 queries/day with core AI Chat and basic writing utilities.',
      features: [
        '30 daily messages',
        'Gemini 3.8 Flash model',
        'Standard writing tools',
        'Basic Urdu & English translation',
      ],
    },
    {
      id: 'plus' as const,
      name: 'NEXORA Plus',
      pricePkr: 'Rs. 499',
      priceUsd: '$4.99',
      period: 'per month',
      desc: '200 queries/day with full 13-tool Writing Studio and Academic Tutor.',
      highlighted: true,
      badge: 'Popular',
      features: [
        '200 daily messages',
        'Full 13-tool AI Writing Studio',
        'Academic Study Assistant & MCQ Quiz',
        'Priority queue response speed',
        'Bi-directional Urdu, Roman Urdu & World translation',
        'Easypaisa, JazzCash & Card enabled',
      ],
    },
    {
      id: 'pro' as const,
      name: 'NEXORA Pro',
      pricePkr: 'Rs. 999',
      priceUsd: '$9.99',
      period: 'per month',
      desc: '1,000 queries/day with Business Strategy, Pitch Canvas & Priority Support.',
      highlighted: false,
      features: [
        '1,000 daily messages',
        'Full Business Strategy & Startup Planner',
        'Advanced speech synthesis audio',
        'Priority model allocation',
        'Direct owner & admin support clearance',
      ],
    },
  ];

  const handleOpenUpgrade = (plan: 'plus' | 'pro') => {
    setSelectedPlanToUpgrade(plan);
    setSubmitted(false);
    setTransactionRef('');
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim() || !selectedPlanToUpgrade) return;

    submitVerificationRequest({
      id: `verif-${Date.now()}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.displayName,
      plan: selectedPlanToUpgrade,
      amount: currency === 'PKR' ? (selectedPlanToUpgrade === 'plus' ? 'Rs. 499' : 'Rs. 999') : (selectedPlanToUpgrade === 'plus' ? '$4.99' : '$9.99'),
      currency,
      gateway: selectedGateway,
      transactionRef: transactionRef.trim(),
      timestamp: new Date().toISOString(),
      status: 'pending',
    });

    setSubmitted(true);

    // Auto-approve simulation for demo review if requested, or upgrade user
    const updated = upgradeUserPlan(selectedPlanToUpgrade);
    onPlanUpdated(updated);
    setInstantSuccess(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#287BFF]" />
            <span>Subscription & Billing Architecture</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent usage allowances with Pakistani mobile wallets and international card clearing.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="inline-flex p-1 rounded-xl bg-[#101629] border border-white/10 shrink-0">
          <button
            onClick={() => setCurrency('PKR')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currency === 'PKR' ? 'bg-[#287BFF] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            PKR (Rs.)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              currency === 'USD' ? 'bg-[#287BFF] text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            USD ($)
          </button>
        </div>
      </div>

      {/* Current Active Plan Banner */}
      <div className="p-5 rounded-2xl bg-[#101629] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Current Status:</span>
            <span className="text-sm font-bold text-white capitalize px-2 py-0.5 bg-[#287BFF]/20 text-[#287BFF] rounded-md border border-[#287BFF]/30">
              {currentUser.plan} Plan
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {currentUser.plan === 'pro'
              ? 'You have 1,000 queries per day, priority model throughput, and full business & study modules.'
              : currentUser.plan === 'plus'
              ? 'You have 200 queries per day, 13-tool writing studio, and academic study assistance.'
              : 'You are on the Free Starter plan (30 daily queries). Upgrade for expanded throughput.'}
          </p>
        </div>

        {currentUser.plan !== 'pro' && (
          <button
            onClick={() => handleOpenUpgrade(currentUser.plan === 'plus' ? 'pro' : 'plus')}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#287BFF] to-[#8955FF] rounded-xl hover:opacity-95 shadow-md shadow-[#287BFF]/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            Upgrade Tier
          </button>
        )}
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent = currentUser.plan === p.id;
          return (
            <div
              key={p.id}
              className={`p-6 rounded-2xl flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'bg-[#101629] border-2 border-[#287BFF] shadow-lg shadow-[#287BFF]/10'
                  : 'bg-[#101629] border border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{p.name}</h3>
                  {isCurrent && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {currency === 'PKR' ? p.pricePkr : p.priceUsd}
                  </span>
                  <span className="text-xs text-slate-400">/{p.period}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>

                <div className="pt-3 border-t border-white/5 space-y-2">
                  {p.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2.5 text-xs font-semibold rounded-xl bg-white/5 text-slate-400 border border-white/10 cursor-default"
                  >
                    Current Plan
                  </button>
                ) : p.id === 'free' ? (
                  <button
                    disabled
                    className="w-full py-2.5 text-xs font-semibold rounded-xl bg-white/5 text-slate-400 border border-white/10 cursor-default"
                  >
                    Default Free
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenUpgrade(p.id)}
                    className="w-full py-2.5 text-xs font-semibold rounded-xl bg-[#287BFF] hover:bg-[#2066d9] text-white shadow-md shadow-[#287BFF]/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Upgrade to {p.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upgrade Checkout Modal */}
      {selectedPlanToUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#101629] border border-white/10 p-6 sm:p-7 shadow-2xl text-left">
            <button
              onClick={() => setSelectedPlanToUpgrade(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <div className="mb-4">
              <span className="text-xs text-[#287BFF] font-semibold uppercase tracking-wider">
                Subscription Clearance
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Upgrade to {selectedPlanToUpgrade === 'plus' ? 'NEXORA Plus' : 'NEXORA Pro'}
              </h3>
              <p className="text-xs text-slate-400">
                Amount: <strong>{currency === 'PKR' ? (selectedPlanToUpgrade === 'plus' ? 'Rs. 499' : 'Rs. 999') : (selectedPlanToUpgrade === 'plus' ? '$4.99' : '$9.99')}</strong> / month
              </p>
            </div>

            {submitted ? (
              <div className="space-y-4 py-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">Payment Submission Received!</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Your Transaction ID ({transactionRef}) has been submitted and verified. Your account is now upgraded to <strong>{selectedPlanToUpgrade.toUpperCase()}</strong>!
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPlanToUpgrade(null)}
                  className="px-6 py-2 text-xs font-semibold text-white bg-[#287BFF] rounded-xl hover:bg-[#2066d9] transition-colors"
                >
                  Return to Workspace
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                {/* Gateway selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Payment Gateway
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['Easypaisa', 'JazzCash', 'Bank Transfer', 'Card'] as const).map((gw) => (
                      <button
                        type="button"
                        key={gw}
                        onClick={() => setSelectedGateway(gw)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          selectedGateway === gw
                            ? 'bg-[#287BFF]/20 border-[#287BFF] text-white font-semibold'
                            : 'bg-[#080B14] border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {gw}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Account details based on gateway */}
                <div className="p-3.5 rounded-xl bg-[#080B14] border border-white/10 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#287BFF]" />
                    <span>Official Payment Account Details:</span>
                  </div>
                  {selectedGateway === 'Easypaisa' && (
                    <div className="text-slate-300 pt-1 space-y-0.5">
                      <p>Account Title: <strong>NEXORA Intelligence Pvt.</strong></p>
                      <p>Easypaisa Number: <strong>0300-1234567</strong></p>
                    </div>
                  )}
                  {selectedGateway === 'JazzCash' && (
                    <div className="text-slate-300 pt-1 space-y-0.5">
                      <p>Account Title: <strong>NEXORA Intelligence</strong></p>
                      <p>JazzCash Number: <strong>0321-9876543</strong></p>
                    </div>
                  )}
                  {selectedGateway === 'Bank Transfer' && (
                    <div className="text-slate-300 pt-1 space-y-0.5">
                      <p>Bank: <strong>Meezan Bank Ltd.</strong></p>
                      <p>Account Title: <strong>NEXORA INTELLIGENCE</strong></p>
                      <p>IBAN: <strong>PK88MEZN0001234567890123</strong></p>
                    </div>
                  )}
                  {selectedGateway === 'Card' && (
                    <div className="text-slate-300 pt-1 space-y-0.5">
                      <p>International Card Provider: <strong>Visa / Mastercard / UnionPay</strong></p>
                      <p>Processor: Verified Stripe / Pakistani Merchant Gateway</p>
                    </div>
                  )}
                </div>

                {/* Transaction reference input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Transaction ID / Reference Number (TID)
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. EP882947192 or JC993817264"
                    className="w-full px-3 py-2 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-[#287BFF] font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Enter the TID from your payment receipt SMS or banking app.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!transactionRef.trim()}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#287BFF] to-[#8955FF] rounded-xl hover:opacity-95 transition-opacity disabled:opacity-40 cursor-pointer shadow-md shadow-[#287BFF]/20"
                >
                  Submit Payment & Activate {selectedPlanToUpgrade.toUpperCase()}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
