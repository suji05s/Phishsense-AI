import React from 'react';
import { PhishSenseLogo } from './PhishSenseLogo';
import { 
  LayoutDashboard,
  Inbox, 
  Network, 
  Layers, 
  ShieldAlert, 
  FileCode, 
  FlaskConical, 
  Cpu,
  Lock,
  Archive,
  BarChart4,
  Target,
  BookOpen,
  Sparkles,
  HelpCircle,
  History,
  LogOut,
  User
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  emailCounts: {
    total: number;
    phishing: number;
    clean: number;
    quarantined: number;
  };
  scanHistoryCount?: number;
  user?: UserProfile | null;
  onLogout?: () => void;
  onOpenProfile?: () => void;
  onCloseMobileNav?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  emailCounts,
  scanHistoryCount = 0,
  user,
  onLogout,
  onOpenProfile,
  onCloseMobileNav,
}) => {
  const handleNav = (view: string) => {
    setActiveView(view);
    if (onCloseMobileNav) {
      onCloseMobileNav();
    }
  };

  return (
    <aside className="w-64 border-r border-slate-800/60 bg-[#0E0E11] p-4 flex flex-col gap-5 select-none shrink-0 overflow-y-auto h-full">
      {/* Group: Command Center */}
      <nav className="flex flex-col gap-1">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 ml-2">
          Overview & Hub
        </div>

        <button
          onClick={() => handleNav('dashboard')}
          className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left ${
            activeView === 'dashboard'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm">Dashboard</span>
          </div>
          <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Live
          </span>
        </button>

        <button
          onClick={() => handleNav('history')}
          className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left ${
            activeView === 'history'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <History className="w-4 h-4 text-emerald-400" />
            <span className="text-sm">Recent Scans</span>
          </div>
          {scanHistoryCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
              {scanHistoryCount}
            </span>
          )}
        </button>
      </nav>

      {/* Group: Core Inbox & Detection */}
      <nav className="flex flex-col gap-1">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 ml-2">
          Inbox & Protection
        </div>

        <button
          onClick={() => handleNav('inbox')}
          className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left ${
            activeView === 'inbox'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Inbox className="w-4 h-4" />
            <span className="text-sm">Smart Inbox</span>
          </div>
          <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300">
            {emailCounts.total}
          </span>
        </button>

        <button
          onClick={() => handleNav('quarantine')}
          className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left ${
            activeView === 'quarantine'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span className="text-sm">Quarantine Vault</span>
          </div>
          {emailCounts.quarantined > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-rose-950/80 text-rose-300 border border-rose-800/50">
              {emailCounts.quarantined}
            </span>
          )}
        </button>

        <button
          onClick={() => handleNav('sandbox')}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left ${
            activeView === 'sandbox'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span className="text-sm">Link Sandbox Safe Room</span>
        </button>
      </nav>

      {/* Group: Learn & Practice */}
      <nav className="flex flex-col gap-1">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 ml-2">
          Learn & Practice
        </div>

        <button
          onClick={() => handleNav('trainer')}
          className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left ${
            activeView === 'trainer'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="text-sm">Scam Quiz & Trainer</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            5 Scenarios
          </span>
        </button>

        <button
          onClick={() => handleNav('graph')}
          className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left ${
            activeView === 'graph'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Network className="w-4 h-4" />
            <span className="text-sm">GAT Graph Explorer</span>
          </div>
          <span className="text-[9px] font-mono text-slate-400 px-1 bg-slate-800 rounded">
            Interactive
          </span>
        </button>
      </nav>

      {/* Group: Security Analytics & Tools */}
      <nav className="flex flex-col gap-1">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 ml-2">
          Security Analytics & Tools
        </div>

        <button
          onClick={() => handleNav('batch')}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left ${
            activeView === 'batch'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-sm">Batch Threat Scanner</span>
        </button>

        <button
          onClick={() => handleNav('research')}
          className={`flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left ${
            activeView === 'research'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <BarChart4 className="w-4 h-4" />
            <span className="text-sm">Threat Analytics</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-400 px-1 bg-emerald-500/10 rounded">
            99.4%
          </span>
        </button>

        <button
          onClick={() => handleNav('rules')}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left ${
            activeView === 'rules'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shadow-sm'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span className="text-sm">Custom Rules & API</span>
        </button>
      </nav>

      {/* Model Engine Hardware Status Badge */}
      <div className="mt-auto p-3.5 bg-slate-900/60 border border-slate-800/70 rounded-2xl flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <PhishSenseLogo size={20} />
            <span>PhishSense AI Engine</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            ONLINE
          </span>
        </div>

        <div className="space-y-1 text-[11px] text-slate-400">
          <div className="flex justify-between">
            <span className="text-slate-400">Catch Rate:</span>
            <span className="text-emerald-400 font-bold font-mono">99.4% (Live Defense)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Scan Latency:</span>
            <span className="text-slate-300 font-mono">3.3 ms / email</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400" />
            256-bit Safe Sandbox
          </span>
          <span>v1.0.0</span>
        </div>
      </div>

      {/* Authenticated User Profile & Logout */}
      {user && (
        <div className="p-3 bg-[#111116] border border-slate-800/90 rounded-2xl flex items-center justify-between gap-2.5">
          <div 
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer hover:opacity-80 transition-opacity"
            title="Open Security Profile"
          >
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name || 'User'}
                className="w-8 h-8 rounded-xl object-cover border border-emerald-500/40 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
                {(user.full_name || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">
                {user.full_name || 'Security Analyst'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                {user.email}
              </div>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-800/50 text-slate-400 hover:text-rose-400 transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
