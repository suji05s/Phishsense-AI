import React, { useState } from 'react';
import { ShieldCheck, Mail, Zap, RefreshCw, PlusCircle, BarChart3, HelpCircle, BookOpen, Target, Sparkles, LayoutDashboard, Menu, X, History, User } from 'lucide-react';
import { GlossaryModal } from './GlossaryModal';
import { HowAiThinksModal } from './HowAiThinksModal';
import { PhishSenseLogo } from './PhishSenseLogo';
import { UserProfile } from '../types';

interface HeaderProps {
  onOpenDashboard: () => void;
  onOpenCustomModal: () => void;
  onOpenBenchmark: () => void;
  onOpenTrainer: () => void;
  onOpenHistory?: () => void;
  onRefreshGmail: () => void;
  isRefreshing: boolean;
  activeView: string;
  threatCount: number;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
  user?: UserProfile | null;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDashboard,
  onOpenCustomModal,
  onOpenBenchmark,
  onOpenTrainer,
  onOpenHistory,
  onRefreshGmail,
  isRefreshing,
  activeView,
  threatCount,
  isMobileMenuOpen = false,
  onToggleMobileMenu,
  user,
  onOpenProfile,
}) => {
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isHowAiOpen, setIsHowAiOpen] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800/60 flex items-center justify-between px-3 md:px-6 bg-[#0E0E11] select-none z-20 shrink-0">
      {/* Left: Mobile Menu Toggle + Brand Identity */}
      <div className="flex items-center gap-2 md:gap-3.5">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        <div 
          onClick={onOpenDashboard}
          className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer hover:opacity-90 transition-opacity"
          title="Go to Dashboard"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10 glow-emerald p-1 shrink-0">
            <PhishSenseLogo size={28} withGlow />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-white font-bold text-base sm:text-lg tracking-tight font-sans">
                PhishSense <span className="text-emerald-400">AI</span>
              </span>
              <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full hidden sm:inline">
                AI Shield
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal hidden lg:inline">
              Graph Attention Networks + DistilBERT (Plain English Explanations)
            </span>
          </div>
        </div>
      </div>

      {/* Center Helpful Quick Navigation & Status */}
      <div className="hidden lg:flex items-center gap-3">
        <button
          onClick={onOpenDashboard}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeView === 'dashboard'
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold'
              : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setIsHowAiOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-full text-xs text-amber-300 font-medium transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>How AI Works</span>
        </button>

        <button
          onClick={() => setIsGlossaryOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-full text-xs text-slate-300 font-medium transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>Plain English Glossary</span>
        </button>

        <button
          onClick={onOpenTrainer}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs text-emerald-400 font-semibold transition-colors"
        >
          <Target className="w-3.5 h-3.5" />
          <span>Practice Quiz Lab</span>
        </button>

        {threatCount > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-full text-xs text-rose-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            {threatCount} Threat{threatCount === 1 ? '' : 's'} Blocked
          </div>
        )}
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {onOpenHistory && (
          <button
            onClick={onOpenHistory}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeView === 'history'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold'
                : 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300'
            }`}
            title="View Persistent Scan History"
          >
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Recent Scans</span>
          </button>
        )}

        <button
          onClick={onOpenCustomModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-lg text-xs font-medium text-slate-200 transition-colors shadow-sm"
          title="Inspect custom raw email text"
        >
          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Inspect Email</span>
        </button>

        <button
          onClick={onOpenBenchmark}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 rounded-lg text-xs font-medium transition-colors"
          title="View Threat Analytics & Security Insights"
        >
          <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Analytics</span>
        </button>

        <button
          onClick={onRefreshGmail}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{isRefreshing ? 'Scanning...' : 'Sync Gmail'}</span>
          <span className="sm:hidden">{isRefreshing ? '...' : 'Sync'}</span>
        </button>

        {/* User Profile Avatar / Trigger */}
        {user && onOpenProfile && (
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-colors cursor-pointer"
            title={`Logged in as ${user.email}`}
          >
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Profile"
                className="w-7 h-7 rounded-lg object-cover border border-emerald-500/40"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                {(user.full_name || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <span className="text-xs text-slate-300 font-medium max-w-[90px] truncate hidden xl:inline">
              {user.full_name || user.email.split('@')[0]}
            </span>
          </button>
        )}
      </div>

      {/* Modals */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      <HowAiThinksModal
        isOpen={isHowAiOpen}
        onClose={() => setIsHowAiOpen(false)}
      />
    </header>
  );
};
