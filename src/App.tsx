import React, { useState, useEffect } from 'react';
import { UserProfile, SubscriptionPlan } from './types';
import { getCurrentUser, logout } from './services/auth';

// Common components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Landing components
import { HeroSection } from './components/landing/HeroSection';
import { FeatureGrid } from './components/landing/FeatureGrid';
import { EducationSection } from './components/landing/EducationSection';
import { WritingTranslationSection } from './components/landing/WritingTranslationSection';
import { BusinessSection } from './components/landing/BusinessSection';
import { PricingSection } from './components/landing/PricingSection';
import { FaqSection } from './components/landing/FaqSection';

// Dashboard components
import { DashboardLayout, DashboardTab } from './components/dashboard/DashboardLayout';
import { ChatAssistant } from './components/dashboard/ChatAssistant';
import { WritingStudio } from './components/dashboard/WritingStudio';
import { StudyAssistant } from './components/dashboard/StudyAssistant';
import { TranslatorView } from './components/dashboard/TranslatorView';
import { BusinessAssistant } from './components/dashboard/BusinessAssistant';
import { ProductivityPlanner } from './components/dashboard/ProductivityPlanner';
import { SubscriptionView } from './components/dashboard/SubscriptionView';
import { AdminDashboard } from './components/dashboard/AdminDashboard';

// Modals
import { AuthModal } from './components/auth/AuthModal';
import { UserProfileModal } from './components/auth/UserProfileModal';
import { PrivacyTermsModal } from './components/auth/PrivacyTermsModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<DashboardTab>('chat');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [privacyModal, setPrivacyModal] = useState<{ isOpen: boolean; type: 'privacy' | 'terms' | 'about' }>({
    isOpen: false,
    type: 'privacy',
  });

  // Prompt starter or pre-filled input
  const [prefilledPrompt, setPrefilledPrompt] = useState<string>('');

  // Daily quota trackers
  const [remainingQuota, setRemainingQuota] = useState<number>(30);
  const [quotaLimit, setQuotaLimit] = useState<number>(30);

  // Initialize theme and current user
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      const limit = user.plan === 'pro' ? 1000 : user.plan === 'plus' ? 200 : 30;
      setQuotaLimit(limit);
      setRemainingQuota(limit);
    }
  }, []);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    const limit = user.plan === 'pro' ? 1000 : user.plan === 'plus' ? 200 : 30;
    setQuotaLimit(limit);
    setRemainingQuota(limit);
    setView('dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setView('landing');
  };

  const handleQuotaUpdate = (remaining: number, limit?: number) => {
    setRemainingQuota(remaining);
    if (typeof limit === 'number') {
      setQuotaLimit(limit);
    }
  };

  const handleLaunchTool = (tab: DashboardTab, prompt?: string) => {
    if (prompt) {
      setPrefilledPrompt(prompt);
    }
    setActiveTab(tab);
    if (!currentUser) {
      setIsAuthOpen(true);
    } else {
      setView('dashboard');
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (view !== 'landing') {
      setView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080B14] text-white flex flex-col font-sans selection:bg-[#287BFF]/30 selection:text-white">
      {view === 'landing' ? (
        <>
          {/* Top Navbar adhering to Top Bar Contract */}
          <Navbar
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthOpen(true)}
            onEnterDashboard={() => setView('dashboard')}
            onNavigateSection={scrollToSection}
          />

          <main className="flex-1">
            {/* 1. Hero Section */}
            <HeroSection
              onStartFree={() => {
                if (currentUser) setView('dashboard');
                else setIsAuthOpen(true);
              }}
              onExploreFeatures={() => scrollToSection('capabilities')}
              onSelectPromptStarter={(prompt, tool) => {
                const targetTab = tool === 'study' ? 'study' : tool === 'business' ? 'business' : 'studio';
                handleLaunchTool(targetTab, prompt);
              }}
            />

            {/* 2. Platform Capabilities (Feature Grid) */}
            <FeatureGrid
              onSelectFeature={(featureId) => {
                const tabMap: Record<string, DashboardTab> = {
                  chat: 'chat',
                  studio: 'studio',
                  study: 'study',
                  translate: 'translate',
                  business: 'business',
                  planner: 'planner',
                };
                handleLaunchTool(tabMap[featureId] || 'chat');
              }}
            />

            {/* 3. Study and Education Section */}
            <EducationSection onLaunchStudy={() => handleLaunchTool('study')} />

            {/* 4. Writing & Translation Section (Urdu & Roman Urdu) */}
            <WritingTranslationSection
              onOpenStudio={() => handleLaunchTool('studio')}
              onOpenTranslator={() => handleLaunchTool('translate')}
            />

            {/* 5. Business Productivity Section */}
            <BusinessSection onOpenBusinessAssistant={() => handleLaunchTool('business')} />

            {/* 6. Subscription Plans */}
            <PricingSection
              onSelectPlan={(plan) => {
                if (!currentUser) {
                  setIsAuthOpen(true);
                } else {
                  setActiveTab('subscription');
                  setView('dashboard');
                }
              }}
            />

            {/* 7. FAQ */}
            <FaqSection />
          </main>

          {/* Clean Footer */}
          <Footer
            onOpenPrivacy={() => setPrivacyModal({ isOpen: true, type: 'privacy' })}
            onOpenTerms={() => setPrivacyModal({ isOpen: true, type: 'terms' })}
            onOpenAbout={() => setPrivacyModal({ isOpen: true, type: 'about' })}
            onNavigateSection={scrollToSection}
          />
        </>
      ) : currentUser ? (
        /* Authenticated User Workspace */
        <DashboardLayout
          currentUser={currentUser}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setPrefilledPrompt('');
          }}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenSubscription={() => setActiveTab('subscription')}
          onExitToLanding={() => setView('landing')}
          onLogout={handleLogout}
          remainingQuota={remainingQuota}
          quotaLimit={quotaLimit}
        >
          {activeTab === 'chat' && (
            <ChatAssistant
              currentUser={currentUser}
              onQuotaUpdate={handleQuotaUpdate}
              initialPrompt={prefilledPrompt}
            />
          )}

          {activeTab === 'studio' && (
            <WritingStudio
              currentUser={currentUser}
              onQuotaUpdate={(rem) => handleQuotaUpdate(rem)}
              initialPrompt={prefilledPrompt}
            />
          )}

          {activeTab === 'study' && (
            <StudyAssistant
              currentUser={currentUser}
              onQuotaUpdate={(rem) => handleQuotaUpdate(rem)}
              initialPrompt={prefilledPrompt}
            />
          )}

          {activeTab === 'translate' && (
            <TranslatorView
              currentUser={currentUser}
              onQuotaUpdate={(rem) => handleQuotaUpdate(rem)}
            />
          )}

          {activeTab === 'business' && (
            <BusinessAssistant
              currentUser={currentUser}
              onQuotaUpdate={(rem) => handleQuotaUpdate(rem)}
              initialPrompt={prefilledPrompt}
            />
          )}

          {activeTab === 'planner' && (
            <ProductivityPlanner currentUser={currentUser} />
          )}

          {activeTab === 'subscription' && (
            <SubscriptionView
              currentUser={currentUser}
              onPlanUpdated={(updated) => {
                setCurrentUser(updated);
                const limit = updated.plan === 'pro' ? 1000 : updated.plan === 'plus' ? 200 : 30;
                setQuotaLimit(limit);
                setRemainingQuota(limit);
              }}
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboard currentUser={currentUser} />
          )}
        </DashboardLayout>
      ) : (
        /* Fallback if user clicked dashboard without session */
        <div className="h-screen flex items-center justify-center p-4">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-white">Session Required</h2>
            <p className="text-xs text-slate-400">Please sign in to access your NEXORA workspace.</p>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#287BFF] rounded-xl hover:bg-[#2066d9]"
            >
              Log In / Register
            </button>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {currentUser && (
        <UserProfileModal
          isOpen={isProfileOpen}
          currentUser={currentUser}
          onClose={() => setIsProfileOpen(false)}
          onUpdate={(updated) => setCurrentUser(updated)}
          onLogout={handleLogout}
          onOpenSubscription={() => {
            setActiveTab('subscription');
            setView('dashboard');
          }}
        />
      )}

      <PrivacyTermsModal
        isOpen={privacyModal.isOpen}
        type={privacyModal.type}
        onClose={() => setPrivacyModal({ isOpen: false, type: 'privacy' })}
      />
    </div>
  );
}
