import React, { useState } from 'react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { UserProfile } from '../../types';
import { Menu, X, ArrowRight, User } from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onEnterDashboard: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onEnterDashboard,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#080B14]/85 dark:bg-[#080B14]/85 border-b border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center shrink-0 cursor-pointer" onClick={() => handleNavClick('hero')}>
          <Logo size="md" />
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300 dark:text-slate-300">
          <button
            onClick={() => handleNavClick('capabilities')}
            className="hover:text-white dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Capabilities
          </button>
          <button
            onClick={() => handleNavClick('studio')}
            className="hover:text-white dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Studio
          </button>
          <button
            onClick={() => handleNavClick('study')}
            className="hover:text-white dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Education
          </button>
          <button
            onClick={() => handleNavClick('pricing')}
            className="hover:text-white dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Plans
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="hover:text-white dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            FAQ
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />

          {currentUser ? (
            <button
              onClick={onEnterDashboard}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#287BFF] to-[#8955FF] rounded-lg hover:opacity-95 shadow-md shadow-[#287BFF]/20 transition-all whitespace-nowrap shrink-0"
            >
              <User className="w-3.5 h-3.5" />
              <span>Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors whitespace-nowrap shrink-0"
              >
                Log In
              </button>
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#287BFF] hover:bg-[#2066d9] rounded-lg shadow-sm shadow-[#287BFF]/30 transition-all whitespace-nowrap shrink-0"
              >
                <span>Start Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#080B14] px-4 pt-3 pb-5 space-y-2.5">
          <button
            onClick={() => handleNavClick('capabilities')}
            className="block w-full text-left py-2 text-sm text-slate-200 hover:text-white"
          >
            Capabilities
          </button>
          <button
            onClick={() => handleNavClick('studio')}
            className="block w-full text-left py-2 text-sm text-slate-200 hover:text-white"
          >
            Studio
          </button>
          <button
            onClick={() => handleNavClick('study')}
            className="block w-full text-left py-2 text-sm text-slate-200 hover:text-white"
          >
            Education
          </button>
          <button
            onClick={() => handleNavClick('pricing')}
            className="block w-full text-left py-2 text-sm text-slate-200 hover:text-white"
          >
            Plans
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="block w-full text-left py-2 text-sm text-slate-200 hover:text-white"
          >
            FAQ
          </button>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            {currentUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onEnterDashboard();
                }}
                className="w-full py-2.5 text-center text-xs font-semibold text-white bg-gradient-to-r from-[#287BFF] to-[#8955FF] rounded-lg"
              >
                Go to Workspace
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 text-center text-xs font-semibold text-white bg-[#287BFF] rounded-lg"
              >
                Start Free with NEXORA
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
