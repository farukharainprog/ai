import React from 'react';
import { Logo } from './Logo';
import { Shield, Sparkles, Globe, Heart } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAbout: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenTerms,
  onOpenAbout,
  onNavigateSection,
}) => {
  return (
    <footer className="border-t border-white/5 bg-[#06080F] text-slate-400 text-xs py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/5">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <Logo size="sm" />
            <p className="text-slate-400 leading-relaxed text-xs">
              Your Smart Digital Partner. Delivering production-grade AI tools for students, educators, professionals, and growing enterprises.
            </p>
            <div className="flex items-center gap-2 pt-1 text-slate-500">
              <Globe className="w-3.5 h-3.5" />
              <span>Engineered for Pakistan & Global Markets</span>
            </div>
          </div>

          {/* Platform tools */}
          <div>
            <h4 className="font-semibold text-slate-200 text-sm mb-3">AI Platform</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateSection('capabilities')} className="hover:text-white transition-colors">
                  AI Chat & Reasoning
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('studio')} className="hover:text-white transition-colors">
                  AI Writing Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('study')} className="hover:text-white transition-colors">
                  AI Study Assistant
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('capabilities')} className="hover:text-white transition-colors">
                  Urdu & Multi-lingual Translator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('capabilities')} className="hover:text-white transition-colors">
                  Business & Strategy Partner
                </button>
              </li>
            </ul>
          </div>

          {/* Solutions & Payments */}
          <div>
            <h4 className="font-semibold text-slate-200 text-sm mb-3">Billing & Payments</h4>
            <p className="text-slate-400 mb-3 leading-relaxed">
              Transparent pricing with local and international gateways:
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">Easypaisa</span>
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">JazzCash</span>
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">Bank Transfer</span>
              <span className="px-2 py-1 bg-white/5 border border-white/10 rounded">Visa / Mastercard</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Verified Admin Clearance</span>
            </div>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="font-semibold text-slate-200 text-sm mb-3">Trust & Governance</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-white transition-colors">
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-white transition-colors">
                  Terms of Service & Usage Limits
                </button>
              </li>
              <li>
                <button onClick={onOpenAbout} className="hover:text-white transition-colors">
                  About NEXORA Intelligence
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-white transition-colors">
                  Data Deletion & Account Controls
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} NEXORA Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Powered by secure server-side Gemini architecture</span>
            <span>·</span>
            <span>Strict zero-leakage privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
