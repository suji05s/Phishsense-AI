import React, { useState } from 'react';
import { PhishSenseLogo } from './PhishSenseLogo';
import { ShieldCheck, Lock, Sparkles, ArrowRight, AlertCircle, CheckCircle2, HelpCircle, ExternalLink } from 'lucide-react';
import { signInWithGoogle, isSupabaseConfigured, FALLBACK_USER } from '../services/supabase';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile, token?: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showConfigGuide, setShowConfigGuide] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      if (!isSupabaseConfigured) {
        // If Supabase is not configured yet, notify user and provide test bypass
        setAuthError(
          'Supabase project credentials (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) are not set. You can use the Quick Demo access below to test the entire full-stack application.'
        );
        setIsLoading(false);
        return;
      }

      const { error } = await signInWithGoogle();
      if (error) {
        setAuthError(error.message || 'Google OAuth failed. Please check your Supabase configuration.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setAuthError(err.message || 'An unexpected error occurred during Google authentication.');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess(FALLBACK_USER, 'demo-test-token');
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-screen bg-[#0B0B0D] text-slate-300 font-sans flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <header className="flex items-center justify-between max-w-6xl mx-auto w-full relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/10 p-1">
            <PhishSenseLogo size={28} withGlow />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg tracking-tight">
                PhishSense <span className="text-emerald-400">AI</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Enterprise
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowConfigGuide(!showConfigGuide)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-300 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Supabase Setup Guide</span>
        </button>
      </header>

      {/* Center Login Card */}
      <main className="max-w-md mx-auto w-full my-auto py-8 relative z-10">
        <div className="bg-[#121217] border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          {/* Logo & Headline */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl items-center justify-center p-2 mb-2 shadow-xl shadow-emerald-500/10 glow-emerald">
              <PhishSenseLogo size={48} withGlow />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              PhishSense Security Hub
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Sign in with your Google account to access your protected inbox, persistent threat scan history, and neural GAT analytics.
            </p>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="p-3.5 bg-rose-950/30 border border-rose-800/50 rounded-xl text-xs text-rose-300 flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-rose-200">Authentication Notice:</span>
                <p>{authError}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Primary Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm rounded-xl transition-all shadow-lg shadow-white/5 flex items-center justify-center gap-3 active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {/* Google G SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.27 21.37 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.26C.46 8.19 0 9.99 0 12s.46 3.81 1.26 5.41l4.02-3.13z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.63 1.26 6.59l4.02 3.13c.95-2.83 3.6-4.97 6.72-4.97z"
                />
              </svg>
              <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* Quick Demo Access Button */}
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-emerald-500/40 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Continue as franklin2021@gmail.com</span>
            </button>
          </div>

          {/* Privacy & Compliance Assurance */}
          <div className="pt-4 border-t border-slate-800/70 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Row-Level Security & Encrypted Credential Vault</span>
            </div>
            <p className="text-[10px] text-slate-400">
              PhishSense AI does not store Google passwords. All scan records are tied to your personal authenticated user ID.
            </p>
          </div>
        </div>

        {/* Supabase Configuration Guide Modal / Accordion */}
        {showConfigGuide && (
          <div className="mt-4 bg-[#111116] border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Configuring Google Login in Supabase:</span>
              <button
                onClick={() => setShowConfigGuide(false)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
              <li>Open your Supabase Project Dashboard.</li>
              <li>Go to <strong>Authentication &rarr; Providers &rarr; Google</strong>.</li>
              <li>Enable Google and paste your Google Cloud Client ID & Client Secret.</li>
              <li>Add the Redirect URL provided by Supabase: <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded font-mono">https://&lt;your-project&gt;.supabase.co/auth/v1/callback</code> into Google Cloud OAuth Authorized Redirect URIs.</li>
              <li>Run the provided schema in <strong>SQL Editor</strong> to create the <code className="text-white">profiles</code> and <code className="text-white">scans</code> tables with RLS!</li>
            </ol>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-[11px] text-slate-400 font-mono relative z-10">
        PhishSense AI Enterprise &copy; 2026 • DistilBERT + Graph Attention Networks • Zero-Trust Protection
      </footer>
    </div>
  );
};
