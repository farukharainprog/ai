import React, { useState, useEffect } from 'react';
import { UserProfile, AdminStats, SubscriptionVerificationRequest } from '../../types';
import {
  fetchAdminStats,
  fetchAdminUsers,
  toggleUserAccountStatus,
  fetchAdminSubscriptions,
  verifyAdminSubscription,
  updateAdminConfig,
} from '../../services/gemini';
import {
  ShieldCheck,
  Users,
  Activity,
  DollarSign,
  Cpu,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Check,
  Save,
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: UserProfile;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionVerificationRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'overview' | 'users' | 'ai' | 'billing'>('overview');

  // Config editing state
  const [activeModel, setActiveModel] = useState('gemini-3.8-flash');
  const [freeQuota, setFreeQuota] = useState(30);
  const [plusQuota, setPlusQuota] = useState(200);
  const [proQuota, setProQuota] = useState(1000);
  const [pkrPlusPrice, setPkrPlusPrice] = useState(499);
  const [pkrProPrice, setPkrProPrice] = useState(999);
  const [configSaved, setConfigSaved] = useState(false);

  const isOwner = currentUser.email === 'farukharain962@gmail.com' || currentUser.role === 'admin';

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, usersData, subsData] = await Promise.all([
        fetchAdminStats(),
        fetchAdminUsers(),
        fetchAdminSubscriptions(),
      ]);

      setStats(statsData);
      setUsers(usersData.users);
      setSubscriptions(subsData.subscriptions);

      if (statsData.config) {
        setActiveModel(statsData.config.activeModel);
        setFreeQuota(statsData.config.freeQuota);
        setPlusQuota(statsData.config.plusQuota);
        setProQuota(statsData.config.proQuota);
        if (statsData.config.pricing?.pkr) {
          setPkrPlusPrice(statsData.config.pricing.pkr.plus);
          setPkrProPrice(statsData.config.pricing.pkr.pro);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load administrator data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!isOwner) {
    return (
      <div className="p-8 text-center bg-[#101629] rounded-2xl border border-white/10 space-y-3">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
        <h3 className="text-base font-bold text-white">Owner Authorization Required</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          The Admin Console is restricted to the platform owner (farukharain962@gmail.com). Please log in with the administrator account to access system governance.
        </p>
      </div>
    );
  }

  const handleToggleUser = async (userId: string) => {
    try {
      await toggleUserAccountStatus(userId);
      setUsers(users.map((u) => (u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u)));
    } catch (err: any) {
      alert(err?.message || 'Failed to toggle user status');
    }
  };

  const handleVerifySub = async (subId: string, action: 'approve' | 'reject') => {
    try {
      await verifyAdminSubscription(subId, action);
      setSubscriptions(subscriptions.map((s) => (s.id === subId ? { ...s, status: action === 'approve' ? 'approved' : 'rejected' } : s)));
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Verification update failed');
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAdminConfig({
        activeModel,
        freeQuota: Number(freeQuota),
        plusQuota: Number(plusQuota),
        proQuota: Number(proQuota),
        pricing: {
          pkr: { free: 0, plus: Number(pkrPlusPrice), pro: Number(pkrProPrice) },
          usd: { free: 0, plus: Number((pkrPlusPrice / 100).toFixed(2)), pro: Number((pkrProPrice / 100).toFixed(2)) },
        },
      });
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 2000);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to update configuration');
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#8955FF]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Owner Administration Console</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time platform metrics, user controls, Gemini model limits, and payment verifications.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex p-1 rounded-xl bg-[#101629] border border-white/5 max-w-md">
        <button
          onClick={() => setActiveAdminSubTab('overview')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeAdminSubTab === 'overview' ? 'bg-[#287BFF] text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveAdminSubTab('users')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeAdminSubTab === 'users' ? 'bg-[#287BFF] text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveAdminSubTab('ai')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeAdminSubTab === 'ai' ? 'bg-[#287BFF] text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          AI & Quotas
        </button>
        <button
          onClick={() => setActiveAdminSubTab('billing')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeAdminSubTab === 'billing' ? 'bg-[#287BFF] text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Payments ({subscriptions.length})
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Overview Tab */}
      {activeAdminSubTab === 'overview' && stats && (
        <div className="space-y-6">
          {/* Key KPI Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-[#101629] border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Total Registered</span>
              <div className="text-xl font-bold text-white font-mono tabular-nums">{stats.totalUsers}</div>
              <div className="text-[10px] text-emerald-400">100% Verified</div>
            </div>

            <div className="p-4 rounded-xl bg-[#101629] border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Active Accounts</span>
              <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums">{stats.activeUsers}</div>
              <div className="text-[10px] text-slate-500">Zero Suspensions</div>
            </div>

            <div className="p-4 rounded-xl bg-[#101629] border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">AI Queries Run</span>
              <div className="text-xl font-bold text-[#287BFF] font-mono tabular-nums">{stats.totalQueriesProcessed}</div>
              <div className="text-[10px] text-slate-500">Live Traffic</div>
            </div>

            <div className="p-4 rounded-xl bg-[#101629] border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Tokens Handled</span>
              <div className="text-xl font-bold text-purple-400 font-mono tabular-nums">{stats.totalTokensProcessed}</div>
              <div className="text-[10px] text-slate-500">Gemini 3.8 Flash</div>
            </div>

            <div className="p-4 rounded-xl bg-[#101629] border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Est. API Expense</span>
              <div className="text-xl font-bold text-amber-400 font-mono tabular-nums">${stats.estimatedCostUsd}</div>
              <div className="text-[10px] text-slate-500">Sub-cent efficiency</div>
            </div>

            <div className="p-4 rounded-xl bg-[#101629] border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Gross Revenue</span>
              <div className="text-xl font-bold text-white font-mono tabular-nums">Rs. {stats.revenuePkr}</div>
              <div className="text-[10px] text-emerald-400">PKR / USD Mixed</div>
            </div>
          </div>

          {/* System Health Status */}
          <div className="p-5 rounded-2xl bg-[#101629] border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white">System Architecture & Backend Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-[#080B14] border border-white/5 space-y-1">
                <span className="text-slate-400 block font-medium">AI Service Layer</span>
                <p className="font-semibold text-white">@google/genai TypeScript SDK</p>
                <p className="text-[11px] text-emerald-400">Server-Side Proxy · Key Secured</p>
              </div>
              <div className="p-3 rounded-xl bg-[#080B14] border border-white/5 space-y-1">
                <span className="text-slate-400 block font-medium">Active Model</span>
                <p className="font-semibold text-white">{stats.config?.activeModel || 'gemini-3.8-flash'}</p>
                <p className="text-[11px] text-[#287BFF]">Configurable in Admin Panel</p>
              </div>
              <div className="p-3 rounded-xl bg-[#080B14] border border-white/5 space-y-1">
                <span className="text-slate-400 block font-medium">Local Wallets Clearance</span>
                <p className="font-semibold text-white">Easypaisa & JazzCash Active</p>
                <p className="text-[11px] text-emerald-400">Manual / Admin Verification Ready</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeAdminSubTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users by name or email..."
                className="w-full pl-9 pr-3 py-2 text-xs text-white bg-[#101629] border border-white/10 rounded-xl focus:outline-none focus:border-[#287BFF]"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">{filteredUsers.length} users</span>
          </div>

          <div className="rounded-2xl bg-[#101629] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A0E1A] text-slate-400 border-b border-white/5">
                  <tr>
                    <th className="p-3.5 font-semibold">User</th>
                    <th className="p-3.5 font-semibold">Email</th>
                    <th className="p-3.5 font-semibold">Plan</th>
                    <th className="p-3.5 font-semibold">Queries</th>
                    <th className="p-3.5 font-semibold">Status</th>
                    <th className="p-3.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 font-semibold text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#080B14] flex items-center justify-center font-bold text-[10px] text-[#287BFF]">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-400">{u.email}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/5 border border-white/10">
                          {u.plan}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono tabular-nums">{u.queriesCount || 0}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {u.email !== 'farukharain962@gmail.com' && (
                          <button
                            onClick={() => handleToggleUser(u.id)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                              u.status === 'active'
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Reactivate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AI Management & Quotas Tab */}
      {activeAdminSubTab === 'ai' && (
        <form onSubmit={handleSaveConfig} className="p-6 rounded-2xl bg-[#101629] border border-white/10 space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#287BFF]" />
              <span>Gemini Model Selection & Quota Limits</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust model version, free tier message caps, and subscription allowances dynamically.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Active Gemini Model</label>
              <select
                value={activeModel}
                onChange={(e) => setActiveModel(e.target.value)}
                className="w-full p-2.5 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl focus:outline-none focus:border-[#287BFF] cursor-pointer"
              >
                <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended Default - High Speed & Reasoning)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Fast / Low Cost)</option>
                <option value="gemini-flash-latest">gemini-flash-latest</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Free Daily Quota</label>
                <input
                  type="number"
                  value={freeQuota}
                  onChange={(e) => setFreeQuota(Number(e.target.value))}
                  className="w-full p-2.5 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Plus Daily Quota</label>
                <input
                  type="number"
                  value={plusQuota}
                  onChange={(e) => setPlusQuota(Number(e.target.value))}
                  className="w-full p-2.5 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pro Daily Quota</label>
                <input
                  type="number"
                  value={proQuota}
                  onChange={(e) => setProQuota(Number(e.target.value))}
                  className="w-full p-2.5 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Plus Plan Price (PKR)</label>
                <input
                  type="number"
                  value={pkrPlusPrice}
                  onChange={(e) => setPkrPlusPrice(Number(e.target.value))}
                  className="w-full p-2.5 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pro Plan Price (PKR)</label>
                <input
                  type="number"
                  value={pkrProPrice}
                  onChange={(e) => setPkrProPrice(Number(e.target.value))}
                  className="w-full p-2.5 text-xs text-white bg-[#080B14] border border-white/10 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#287BFF] hover:bg-[#2066d9] rounded-xl transition-colors cursor-pointer flex items-center gap-2"
          >
            {configSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            <span>{configSaved ? 'Configuration Updated!' : 'Save System Configuration'}</span>
          </button>
        </form>
      )}

      {/* Billing & Verifications Tab */}
      {activeAdminSubTab === 'billing' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">
              Payment Verification Queue (Easypaisa / JazzCash / Bank)
            </span>
            <span className="text-xs text-slate-400 font-mono">{subscriptions.length} records</span>
          </div>

          <div className="rounded-2xl bg-[#101629] border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0A0E1A] text-slate-400 border-b border-white/5">
                  <tr>
                    <th className="p-3.5 font-semibold">User</th>
                    <th className="p-3.5 font-semibold">Plan</th>
                    <th className="p-3.5 font-semibold">Amount</th>
                    <th className="p-3.5 font-semibold">Gateway</th>
                    <th className="p-3.5 font-semibold">Transaction ID (TID)</th>
                    <th className="p-3.5 font-semibold">Status</th>
                    <th className="p-3.5 font-semibold text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {subscriptions.map((s) => (
                    <tr key={s.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 font-medium text-white">
                        <div>{s.userName}</div>
                        <div className="text-[10px] text-slate-400">{s.userEmail}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-white/5">
                          {s.plan}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono tabular-nums">{s.amount}</td>
                      <td className="p-3.5">{s.gateway}</td>
                      <td className="p-3.5 font-mono text-cyan-400">{s.transactionRef}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : s.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {s.status === 'pending' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleVerifySub(s.id, 'approve')}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleVerifySub(s.id, 'reject')}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 rounded-lg cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {s.status === 'approved' && (
                          <span className="text-emerald-400 text-[11px] flex items-center justify-end gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
