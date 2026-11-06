import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Logo } from '../common/Logo';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  MessageSquare,
  PenTool,
  BookOpen,
  Globe,
  Briefcase,
  CalendarCheck,
  CreditCard,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  User,
  Sparkles,
} from 'lucide-react';

export type DashboardTab =
  | 'chat'
  | 'studio'
  | 'study'
  | 'translate'
  | 'business'
  | 'planner'
  | 'subscription'
  | 'admin';

interface DashboardLayoutProps {
  currentUser: UserProfile;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onOpenProfile: () => void;
  onOpenSubscription: () => void;
  onExitToLanding: () => void;
  onLogout: () => void;
  remainingQuota?: number;
  quotaLimit?: number;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onOpenProfile,
  onOpenSubscription,
  onExitToLanding,
  onLogout,
  remainingQuota = 28,
  quotaLimit = 30,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'chat' as DashboardTab, label: 'AI Chat Assistant', icon: MessageSquare, badge: 'Core' },
    { id: 'studio' as DashboardTab, label: 'Writing Studio', icon: PenTool, badge: '13 Tools' },
    { id: 'study' as DashboardTab, label: 'Study Assistant', icon: BookOpen, badge: 'Tutor' },
    { id: 'translate' as DashboardTab, label: 'AI Translator', icon: Globe, badge: 'Urdu/EN' },
    { id: 'business' as DashboardTab, label: 'Business Strategist', icon: Briefcase, badge: 'Pro' },
    { id: 'planner' as DashboardTab, label: 'Personal Planner', icon: CalendarCheck, badge: 'Tasks' },
    { id: 'subscription' as DashboardTab, label: 'Plans & Billing', icon: CreditCard },
  ];

  // If user is admin (e.g. farukharain962@gmail.com), append Admin tab
  if (currentUser.role === 'admin' || currentUser.email === 'farukharain962@gmail.com') {
    navItems.push({
      id: 'admin' as DashboardTab,
      label: 'Admin Console',
      icon: ShieldCheck,
      badge: 'Owner',
    });
  }

  const tabTitles: Record<DashboardTab, string> = {
    chat: 'AI Chat & Multi-Turn Reasoning',
    studio: 'AI Writing & Content Studio',
    study: 'AI Academic Study Assistant',
    translate: 'Urdu, Roman Urdu & World Translator',
    business: 'Business Strategy & Freelance Partner',
    planner: 'Personal Tasks, Goals & Timetable',
    subscription: 'Subscription & Billing Portal',
    admin: 'Owner Administration & Quota Console',
  };

  const usedQuota = Math.max(0, quotaLimit - remainingQuota);
  const quotaPercent = Math.min(100, Math.round((usedQuota / quotaLimit) * 100));

  return (
    <div className="min-h-screen bg-[#080B14] text-white flex flex-col md:flex-row antialiased">
      {/* Mobile Top Navigation */}
      <div className="md:hidden sticky top-0 z-40 bg-[#080B14]/95 backdrop-blur-md border-b border-white/10 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/5 cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Logo size="sm" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#287BFF] to-[#8955FF] p-0.5"
          >
            <div className="w-full h-full bg-[#101629] rounded-[7px] flex items-center justify-center text-xs font-bold text-white">
              {currentUser.displayName.charAt(0).toUpperCase()}
            </div>
          </button>
        </div>
      </div>

      {/* Sidebar: Desktop & Collapsible Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0A0E1A] border-r border-white/5 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Logo and User Capsule */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User mini profile card */}
          <div
            onClick={onOpenProfile}
            className="p-3 rounded-xl bg-[#101629] border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#287BFF] to-[#8955FF] p-0.5 shrink-0">
                <div className="w-full h-full bg-[#101629] rounded-[7px] flex items-center justify-center text-xs font-bold text-white">
                  {currentUser.displayName.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="truncate text-left">
                <div className="text-xs font-semibold text-white truncate group-hover:text-[#287BFF] transition-colors">
                  {currentUser.displayName}
                </div>
                <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                  <span className="capitalize">{currentUser.plan} Plan</span>
                  {currentUser.role === 'admin' && (
                    <span className="text-[#8955FF] font-semibold">· Owner</span>
                  )}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#287BFF] text-white shadow-md shadow-[#287BFF]/20 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.badge && !isActive && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom: Usage Meter and Actions */}
        <div className="p-4 border-t border-white/5 space-y-3">
          {/* Usage Meter */}
          <div className="p-3 rounded-xl bg-[#101629] border border-white/5 text-left space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Daily AI Quota</span>
              <span className="font-mono tabular-nums text-white">
                {usedQuota}/{quotaLimit}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  quotaPercent > 80 ? 'bg-amber-400' : 'bg-[#287BFF]'
                }`}
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
            {currentUser.plan === 'free' && (
              <button
                onClick={onOpenSubscription}
                className="w-full text-center text-[11px] font-semibold text-[#287BFF] hover:underline cursor-pointer block pt-0.5"
              >
                Upgrade for 200–1000/day →
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
            <button
              onClick={onExitToLanding}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Workspace Top Header */}
        <header className="sticky top-0 z-30 h-14 bg-[#080B14]/90 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-medium text-slate-500">Workspace</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-white truncate max-w-xs sm:max-w-md">
              {tabTitles[activeTab]}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <button
              onClick={onOpenSubscription}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#287BFF]/20 to-[#8955FF]/20 hover:from-[#287BFF]/30 hover:to-[#8955FF]/30 border border-[#287BFF]/40 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3 h-3 text-[#287BFF]" />
              <span className="capitalize">{currentUser.plan} Plan</span>
            </button>
            <button
              onClick={onOpenProfile}
              className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#287BFF] to-[#8955FF] p-0.5 cursor-pointer hidden sm:block"
            >
              <div className="w-full h-full bg-[#101629] rounded-[7px] flex items-center justify-center text-xs font-bold text-white">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
