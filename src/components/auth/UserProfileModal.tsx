import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { updateUserProfile, logout } from '../../services/auth';
import { X, User, Shield, Download, Trash2, LogOut, Check, Sparkles } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onUpdate: (user: UserProfile) => void;
  onLogout: () => void;
  onOpenSubscription: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUpdate,
  onLogout,
  onOpenSubscription,
}) => {
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateUserProfile({ displayName });
    onUpdate(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      user: currentUser,
      exportDate: new Date().toISOString(),
      platform: 'NEXORA Intelligence',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexora_user_data_${currentUser.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    logout();
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-[#101629] border border-white/10 p-6 sm:p-7 shadow-2xl text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#287BFF] to-[#8955FF] p-0.5 overflow-hidden shrink-0 flex items-center justify-center">
            {currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="w-full h-full bg-[#101629] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{currentUser.displayName}</h3>
            <p className="text-xs text-slate-400">{currentUser.email}</p>
          </div>
        </div>

        {/* Plan card strip */}
        <div className="p-3.5 mb-5 rounded-xl bg-[#080B14] border border-white/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white capitalize">
                Plan: {currentUser.plan}
              </span>
              {currentUser.role === 'admin' && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#8955FF]/20 text-[#8955FF] border border-[#8955FF]/30 rounded">
                  Admin
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {currentUser.plan === 'pro'
                ? '1,000 queries/day · Full business & academic tools'
                : currentUser.plan === 'plus'
                ? '200 queries/day · Priority processing'
                : '30 queries/day · Basic writing & chat'}
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenSubscription();
            }}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#287BFF] hover:bg-[#2066d9] rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Manage Plan
          </button>
        </div>

        {/* Edit profile form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-[#287BFF]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-3 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-400" /> : null}
            <span>{saved ? 'Saved Successfully' : 'Save Changes'}</span>
          </button>
        </form>

        {/* Data & privacy options */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <span className="text-xs font-semibold text-slate-400 block">Privacy & Account Governance</span>

          <button
            onClick={handleExportData}
            className="w-full py-2 px-3 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Personal Workspace Data</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">JSON</span>
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full py-2 px-3 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5" />
              <span>{deleteConfirm ? 'Confirm: Click to Erase All Data' : 'Delete Account & Purge Records'}</span>
            </span>
          </button>

          <button
            onClick={() => {
              logout();
              onLogout();
              onClose();
            }}
            className="w-full py-2 px-3 text-xs text-slate-400 hover:text-white hover:bg-white/5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer mt-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
