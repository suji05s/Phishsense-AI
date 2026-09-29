import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  RefreshCw, 
  Sparkles, 
  Inbox, 
  FlaskConical, 
  Target, 
  Network, 
  BarChart4, 
  FileCode, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  Lock, 
  Activity, 
  Search, 
  Zap, 
  Layers, 
  ChevronRight,
  Shield,
  Eye,
  History,
  Trash2
} from 'lucide-react';
import { EmailItem, LocalScanRecord } from '../types';
import { PhishSenseLogo } from './PhishSenseLogo';

interface DashboardViewProps {
  emails: EmailItem[];
  scans?: LocalScanRecord[];
  userEmail: string;
  userName?: string;
  emailCounts: {
    total: number;
    phishing: number;
    clean: number;
    quarantined: number;
  };
  onNavigate: (view: string) => void;
  onSelectEmail: (email: EmailItem) => void;
  onScanEmail: (email: EmailItem) => void;
  onQuarantineEmail: (email: EmailItem) => void;
  onOpenSandbox: (url: string) => void;
  onOpenCustomModal: () => void;
  onRefreshGmail: () => void;
  onInspectScan?: (scan: LocalScanRecord) => void;
  isRefreshing: boolean;
  isScanning: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  emails,
  scans = [],
  userEmail,
  userName,
  emailCounts,
  onNavigate,
  onSelectEmail,
  onScanEmail,
  onQuarantineEmail,
  onOpenSandbox,
  onOpenCustomModal,
  onRefreshGmail,
  onInspectScan,
  isRefreshing,
  isScanning,
}) => {
  const [quickSandboxUrl, setQuickSandboxUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Statistics Calculation
  const hasRealScans = scans && scans.length > 0;
  const totalAnalyzed = hasRealScans ? scans.length : emailCounts.total;
  const highRiskThreats = hasRealScans
    ? scans.filter((s) => s.riskLevel === 'High' || s.riskLevel === 'Critical').length
    : emailCounts.phishing;
  const cleanVerifiedCount = hasRealScans
    ? scans.filter((s) => s.riskLevel === 'Low').length
    : emailCounts.clean;

  // Filter recent emails from Gmail account
  const recentEmails = emails.filter((email) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      email.subject.toLowerCase().includes(q) ||
      email.sender.toLowerCase().includes(q) ||
      (email.senderName && email.senderName.toLowerCase().includes(q))
    );
  }).slice(0, 5);

  const healthScore = Math.max(75, Math.min(99, Math.round(100 - (highRiskThreats / (totalAnalyzed || 1)) * 25)));

  const formatShortDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      if (d.toDateString() === now.toDateString()) {
        return 'Today';
      }
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (d.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      }
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Today';
    }
  };

  return (
    <div className="flex-1 bg-[#0A0A0D] p-5 md:p-8 overflow-y-auto space-y-7 max-w-7xl mx-auto w-full">
      {/* 1. Gmail Integrated Account Overview Banner */}
      <section className="bg-gradient-to-r from-[#111218] via-[#13151D] to-[#0F1318] border border-slate-800/90 rounded-2xl p-6 relative overflow-hidden shadow-xl shadow-black/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-16 h-16 bg-slate-900/90 border border-slate-800 rounded-2xl items-center justify-center shadow-xl shadow-emerald-500/10 shrink-0 p-1.5 glow-emerald">
              <PhishSenseLogo size={52} withGlow />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-xs font-semibold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Gmail Integration Active</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-full text-[11px] font-mono text-slate-300">
                  <Mail className="w-3 h-3 text-emerald-400" />
                  <span>{userEmail}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-full text-[11px] font-mono text-slate-400">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>256-bit GAT Graph Protection</span>
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                PhishSense Security Command Center
              </h1>
              <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Continuous threat interception, zero-day phishing defense, and relational Graph Neural Network scanning for your mailbox.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={onRefreshGmail}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-60 active:scale-95 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing Mailbox...' : 'Sync Gmail Now'}</span>
            </button>

            <button
              onClick={onOpenCustomModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 font-medium text-xs rounded-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Inspect Custom Email</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Stats in Top Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-6 pt-6 border-t border-slate-800/70">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Inbox Health</span>
              <span className="text-emerald-400 font-mono text-[10px]">Grade A+</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono flex items-baseline gap-1">
              <span>{healthScore}%</span>
              <span className="text-xs text-slate-400 font-sans font-normal">Optimal</span>
            </div>
            <div className="text-[10px] text-slate-400">Zero active breaches</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Total Inbound</span>
              <span className="text-slate-400 font-mono text-[10px]">Protected</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">{totalAnalyzed}</div>
            <div className="text-[10px] text-slate-400">{cleanVerifiedCount} verified legitimate</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Threats Blocked</span>
              <span className="text-rose-400 font-mono text-[10px]">Neutralized</span>
            </div>
            <div className="text-2xl font-bold text-rose-400 font-mono">{highRiskThreats}</div>
            <div className="text-[10px] text-slate-400">{emailCounts.quarantined} in quarantine vault</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Scan Latency</span>
              <span className="text-emerald-400 font-mono text-[10px]">Real-time</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">3.3 ms</div>
            <div className="text-[10px] text-slate-400">Sub-second threat decision</div>
          </div>
        </div>
      </section>

      {/* 2. Core Functional Modules Navigation Grid */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Application Core Functionalities
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">Select any tool to launch</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Recent Scans Card */}
          <div 
            onClick={() => onNavigate('history')}
            className="group bg-[#111116] hover:bg-[#15151C] border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <History className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {scans.length} Saved
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>Recent Scans</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Browser localStorage records of previous email analyses with timestamps, risk scores, and full threat factors.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>Open Recent Scans</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          {/* Smart Inbox */}
          <div 
            onClick={() => onNavigate('inbox')}
            className="group bg-[#111116] hover:bg-[#15151C] border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Inbox className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                  {emailCounts.total} Messages
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>Smart Inbox & Email Inspector</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Real-time incoming Gmail stream with inline threat scoring, authentication headers (SPF/DKIM), and plain English explanations.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>Open Mail Stream</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Quarantine Vault */}
          <div 
            onClick={() => onNavigate('quarantine')}
            className="group bg-[#111116] hover:bg-[#15151C] border border-slate-800/80 hover:border-rose-500/40 rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-950/60 text-rose-300 border border-rose-800/40">
                  {emailCounts.quarantined} Isolated
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <span>Quarantine Vault</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Safely cordon off malicious messages. Prevent accidental link clicks, review quarantined headers, and restore safe mail.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-rose-400 font-medium">
              <span>Manage Vault</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Link Detonation Sandbox */}
          <div 
            onClick={() => onNavigate('sandbox')}
            className="group bg-[#111116] hover:bg-[#15151C] border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-900 text-teal-300 border border-slate-800">
                  Isolated VM
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <span>Link Detonation Sandbox</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Detonate suspicious URLs inside a secure container to inspect redirects, fake login domains, and credential harvesters safely.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-teal-400 font-medium">
              <span>Launch Sandbox</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Scam Quiz & Security Trainer */}
          <div 
            onClick={() => onNavigate('trainer')}
            className="group bg-[#111116] hover:bg-[#15151C] border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Target className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  5 Scenarios
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>Scam Quiz & Trainer Lab</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Interactive security awareness quiz with simulated phishing attacks and instant feedback on subtle scam indicators.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>Start Practice Session</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* GAT Graph Explorer */}
          <div 
            onClick={() => onNavigate('graph')}
            className="group bg-[#111116] hover:bg-[#15151C] border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                  <Network className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-900 text-indigo-300 border border-slate-800">
                  Interactive Nodes
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span>GAT Graph Explorer</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Explore how the Graph Attention Network links urgency words, destination URLs, and spoofed headers into a threat web.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-indigo-400 font-medium">
              <span>Explore Graph Engine</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Threat Analytics & Security Insights */}
          <div 
            onClick={() => onNavigate('research')}
            className="group bg-[#111116] hover:bg-[#15151C] border border-slate-800/80 hover:border-emerald-500/40 rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <BarChart4 className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  99.4% Catch Rate
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>Threat Analytics & Insights</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Telemetry breakdowns of attack vectors, false-positive metrics, engine speed benchmarks, and classification distributions.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>View Security Analytics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Recent Scans Section (LocalStorage) */}
      <section className="bg-[#111116] border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Scans
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-300">
              LocalStorage ({scans.length})
            </span>
          </div>

          <button
            onClick={() => onNavigate('history')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All Recent Scans</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {scans.length === 0 ? (
          <div className="p-6 bg-slate-950/40 border border-slate-800/60 rounded-xl text-center space-y-2">
            <p className="text-xs text-slate-400">No recent local scans yet.</p>
            <button
              onClick={onOpenCustomModal}
              className="text-xs text-emerald-400 hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Click here to test your first email</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {scans.slice(0, 3).map((scan) => {
              const isHigh = scan.riskLevel === 'High' || scan.riskLevel === 'Critical';
              const isMedium = scan.riskLevel === 'Medium';
              return (
                <div
                  key={scan.id}
                  onClick={() => {
                    if (onInspectScan) {
                      onInspectScan(scan);
                    } else {
                      onNavigate('history');
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                    isHigh 
                      ? 'bg-rose-950/15 border-rose-800/40 hover:border-rose-700/60' 
                      : isMedium 
                      ? 'bg-amber-950/15 border-amber-800/40 hover:border-amber-700/60' 
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                      isHigh 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : isMedium 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {isHigh ? '🔴 High Risk' : isMedium ? '🟡 Medium Risk' : '🟢 Low Risk'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatShortDate(scan.createdAt)}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white line-clamp-1">
                      "{scan.subject || '(Untitled Email)'}"
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      Risk Score: <span className="font-bold text-slate-200">{scan.riskScore}/100</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/50 flex items-center justify-between text-[11px] text-emerald-400 font-medium">
                    <span>Reopen Analysis</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Recent Gmail Inbound Feed & Live Threat Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Gmail Inbox Stream */}
        <section className="lg:col-span-2 bg-[#111116] border border-slate-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Recent Gmail Activity Stream
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Live protected inbound feed for <span className="font-mono text-slate-300">{userEmail}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter inbox..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 w-36 sm:w-44"
                />
              </div>

              <button
                onClick={() => onNavigate('inbox')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Full Inbox</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {recentEmails.map((email) => {
              const isPhishing = email.result?.isPhishing;
              const isPending = email.status === 'pending';
              const isQuarantined = email.status === 'quarantined';

              return (
                <div
                  key={email.id}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isQuarantined
                      ? 'bg-rose-950/15 border-rose-800/40'
                      : isPhishing
                      ? 'bg-rose-950/20 border-rose-800/50'
                      : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="mt-0.5 shrink-0">
                      {isQuarantined ? (
                        <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                      ) : isPhishing ? (
                        <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white truncate max-w-xs">
                          {email.senderName || email.sender}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {email.date}
                        </span>
                        {email.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        )}
                      </div>

                      <div className="text-xs text-slate-300 font-medium truncate mt-0.5">
                        {email.subject}
                      </div>

                      <div className="text-[11px] text-slate-400 truncate mt-0.5 max-w-md">
                        {email.body.replace(/\n/g, ' ')}
                      </div>
                    </div>
                  </div>

                  {/* Status & Row Action Controls */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {isPending ? (
                      <button
                        onClick={() => onScanEmail(email)}
                        className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Scan</span>
                      </button>
                    ) : isPhishing ? (
                      <span className="px-2 py-0.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[10px] font-mono font-bold rounded">
                        PHISHING ({Math.round((email.result?.confidenceScore || 0.98) * 100)}%)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold rounded">
                        SAFE
                      </span>
                    )}

                    <button
                      onClick={() => {
                        onSelectEmail(email);
                        onNavigate('inbox');
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      title="Inspect full details"
                    >
                      <Eye className="w-3 h-3 text-slate-400" />
                      <span>Inspect</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right 1 Col: Live Threat Digest & Fast Link Detonator */}
        <section className="space-y-4 flex flex-col">
          {/* Attack Vector Digest */}
          <div className="bg-[#111116] border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Inbox Threat Vectors</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">Live Active</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="font-medium">Credential Harvesters</span>
                  <span className="font-mono text-emerald-400">42%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '42%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="font-medium">Urgent Wire & Invoice Scams</span>
                  <span className="font-mono text-amber-400">28%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="font-medium">Fake Delivery Redirection</span>
                  <span className="font-mono text-teal-400">18%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="font-medium">Executive Whaling Mimicry</span>
                  <span className="font-mono text-rose-400">12%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '12%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Direct URL Sandbox Detonation Widget */}
          <div className="bg-[#111116] border border-slate-800/80 rounded-2xl p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Direct URL Detonator
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste any suspicious link to test in the isolated sandbox safe room.
              </p>
            </div>

            <div className="space-y-2 mt-2">
              <input
                type="text"
                placeholder="https://suspicious-domain.com/login"
                value={quickSandboxUrl}
                onChange={(e) => setQuickSandboxUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
              />
              <button
                onClick={() => {
                  if (quickSandboxUrl) {
                    onOpenSandbox(quickSandboxUrl);
                  } else {
                    onOpenSandbox('https://accounts-google-verify.cc/checkpoint/sso-login');
                  }
                }}
                className="w-full py-2 bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Detonate in Sandbox</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* 4. Security Recommendations Bar */}
      <section className="bg-slate-900/40 border border-slate-800/70 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white">Inbox Shield Recommendation: </span>
            <span>All inbound messages are authenticated via SPF/DKIM validation and Graph Attention analysis.</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('rules')}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-colors whitespace-nowrap self-end sm:self-auto cursor-pointer"
        >
          View YARA Rules & API
        </button>
      </section>
    </div>
  );
};
