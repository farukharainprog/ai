import React from 'react';
import { X, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyTermsModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | 'about';
  onClose: () => void;
}

export const PrivacyTermsModal: React.FC<PrivacyTermsModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#101629] border border-white/10 p-6 sm:p-8 shadow-2xl text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#287BFF] text-xs font-semibold uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Security & Privacy Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Privacy Policy</h2>
            <p className="text-xs text-slate-400">Effective Date: November 2026</p>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
              <h4 className="font-semibold text-white">1. Data Minimization & Isolation</h4>
              <p>
                NEXORA Intelligence collects only the essential data required to provide personal workspaces: email address, display name, user-generated prompts, and task records. We never sell personal data or license individual conversation histories to third-party ad networks.
              </p>

              <h4 className="font-semibold text-white">2. AI Processing via Server-Side Proxy</h4>
              <p>
                All AI prompts are dispatched through secure server-side proxy routes with strict credential isolation. API keys are stored in secure cloud runtime environments and never transmitted to client browsers.
              </p>

              <h4 className="font-semibold text-white">3. Youth & Academic Protections</h4>
              <p>
                In compliance with global data protection frameworks and local Pakistani privacy guidelines, student accounts are insulated from behavioral tracking, unverified ads, and unauthorized third-party telemetry.
              </p>

              <h4 className="font-semibold text-white">4. User Data Erasure & Export</h4>
              <p>
                You retain complete sovereignty over your data. You may download a full JSON archive of your personal workspace records or initiate instantaneous account erasure at any time via your Profile Settings.
              </p>
            </div>
          </div>
        )}

        {type === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#8955FF] text-xs font-semibold uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Terms & Usage Standards</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Terms of Service</h2>
            <p className="text-xs text-slate-400">Last Revised: November 2026</p>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
              <h4 className="font-semibold text-white">1. Acceptable Use</h4>
              <p>
                NEXORA Intelligence is engineered for productive educational, professional, and commercial workflows. Users agree not to utilize the platform for illegal activities, mass automated spam, or the generation of harmful material.
              </p>

              <h4 className="font-semibold text-white">2. Quota Governance & Anti-Abuse</h4>
              <p>
                Each subscription plan operates with explicit, documented daily message limits (30 on Free, 200 on Plus, 1,000 on Pro). Automated scraping, botting, or attempting to bypass rate limits will result in account suspension.
              </p>

              <h4 className="font-semibold text-white">3. Payment Verification & Clearances</h4>
              <p>
                Transactions processed via Pakistani gateways (Easypaisa, JazzCash) or international credit/debit cards are cleared upon administrative verification. Subscription fees are non-refundable once activated for the ongoing monthly billing cycle.
              </p>

              <h4 className="font-semibold text-white">4. Professional Advice Disclaimer</h4>
              <p>
                AI outputs in the Business and Academic modules are for strategic planning, education, and research assistance. They do not constitute formal legal, financial, or medical advice.
              </p>
            </div>
          </div>
        )}

        {type === 'about' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Lock className="w-4 h-4" />
              <span>Company & Platform Mission</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">About NEXORA Intelligence</h2>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
              <p>
                <strong>Tagline:</strong> <em>Your Smart Digital Partner.</em>
              </p>
              <p>
                NEXORA Intelligence was conceived to bridge the gap between high-end international AI capabilities and the real-world linguistic and economic needs of creators, students, freelancers, and businesses across Pakistan and global emerging tech hubs.
              </p>
              <p>
                By engineering deep support for authentic Urdu typography, Roman Urdu colloquial understanding, and accessible payment gateways like Easypaisa and JazzCash, NEXORA delivers a world-class AI experience with local relevance.
              </p>
            </div>
          </div>
        )}

        <div className="pt-6 mt-6 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#287BFF] hover:bg-[#2066d9] rounded-xl transition-colors cursor-pointer"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
};
