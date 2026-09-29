import React from 'react';
import { UserProfile } from '../types';
import { X, LogOut, ShieldCheck, Mail, Calendar, User, Key, Lock, CheckCircle2 } from 'lucide-react';
import { PhishSenseLogo } from './PhishSenseLogo';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121217] border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0E0E11]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Authenticated Security Profile</h2>
              <p className="text-[11px] text-slate-400">Google OAuth & Supabase Session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4 p-4 bg-[#16161D] border border-slate-800 rounded-2xl">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name || 'User avatar'}
                className="w-14 h-14 rounded-full border-2 border-emerald-500/40 object-cover shrink-0 shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 text-lg font-bold shrink-0">
                {(user.full_name || user.email || 'U')[0].toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-white truncate">
                {user.full_name || 'Security Analyst'}
              </h3>
              <p className="text-xs font-mono text-emerald-400 truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Google Verified Account</span>
              </div>
            </div>
          </div>

          {/* Account Metadata */}
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                <span>Auth Provider</span>
              </span>
              <span className="font-mono text-slate-200">Google OAuth (Supabase)</span>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Data Isolation</span>
              </span>
              <span className="font-mono text-emerald-400 text-[11px]">Row-Level Security (RLS)</span>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Session Status</span>
              </span>
              <span className="font-mono text-slate-200">Active • 256-bit AES</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-[#0E0E11] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Dismiss
          </button>

          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
