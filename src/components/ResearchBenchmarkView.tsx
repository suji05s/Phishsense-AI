import React, { useState } from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  ShieldAlert, 
  TrendingUp, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Activity,
  Lock,
  ArrowUpRight
} from 'lucide-react';

export const ResearchBenchmarkView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  return (
    <div className="flex-1 bg-[#0F0F12] p-6 md:p-8 overflow-y-auto space-y-6 max-w-6xl mx-auto w-full">
      {/* Analytics Overview Header */}
      <div className="bg-[#121217] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400">
            <Activity className="w-3.5 h-3.5" />
            <span>Real-Time Security Intelligence & Threat Metrics</span>
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-md transition-colors ${
                timeRange === '7d' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-md transition-colors ${
                timeRange === '30d' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                timeRange === 'all' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
          Inbox Protection & Threat Detection Analytics
        </h1>
        <p className="text-xs text-slate-300 mt-1 max-w-3xl">
          Continuous threat intelligence performance monitoring across all connected enterprise and personal email inboxes.
        </p>

        {/* Highlight Key Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
              <span>Threat Catch Rate</span>
              <span className="text-emerald-400 font-mono text-[10px]">High Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">99.4%</div>
            <div className="text-[10px] text-slate-400">Zero-day scam protection</div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
              <span>Scanned Messages</span>
              <span className="text-slate-400 font-mono text-[10px]">Total Volume</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">41,940</div>
            <div className="text-[10px] text-slate-400">22,128 threats neutralized</div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
              <span>False Positive Rate</span>
              <span className="text-emerald-400 font-mono text-[10px]">&lt; 0.5% Target</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">0.44%</div>
            <div className="text-[10px] text-slate-400">Legitimate emails preserved</div>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
              <span>Avg Scan Latency</span>
              <span className="text-slate-400 font-mono text-[10px]">Instant</span>
            </div>
            <div className="text-2xl font-bold text-white font-mono">3.3 ms</div>
            <div className="text-[10px] text-slate-400">Sub-second real-time filtering</div>
          </div>
        </div>
      </div>

      {/* Threat Distribution & Detection Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detection Breakdown Matrix */}
        <div className="bg-[#121217] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Inbound Classification Breakdown</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400">
              Live Inbox Telemetry
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-center">
            {/* True Negative */}
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex flex-col items-center justify-center">
              <span className="text-[11px] text-emerald-300 font-sans font-medium">Clean Inbound Delivered</span>
              <span className="text-2xl font-bold text-white mt-1">19,812</span>
              <span className="text-[10px] text-emerald-400/80 mt-1">99.56% Accuracy</span>
            </div>

            {/* True Positive */}
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl flex flex-col items-center justify-center">
              <span className="text-[11px] text-emerald-300 font-sans font-medium">Scams Intercepted</span>
              <span className="text-2xl font-bold text-white mt-1">21,842</span>
              <span className="text-[10px] text-emerald-400/80 mt-1">99.4% Detection</span>
            </div>

            {/* False Positive */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col items-center justify-center">
              <span className="text-[11px] text-slate-300 font-sans font-medium">Flagged for Review</span>
              <span className="text-2xl font-bold text-amber-400 mt-1">15</span>
              <span className="text-[10px] text-slate-400 mt-1">Only 0.44% of safe mail</span>
            </div>

            {/* False Negative */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col items-center justify-center">
              <span className="text-[11px] text-slate-300 font-sans font-medium">Threat Escapes</span>
              <span className="text-2xl font-bold text-slate-400 mt-1">58</span>
              <span className="text-[10px] text-slate-400 mt-1">Isolated by sandbox</span>
            </div>
          </div>
        </div>

        {/* Threat Vector Distribution */}
        <div className="bg-[#121217] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Top Attack Vectors Blocked This Month</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Categorized Threats
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="font-medium">Credential & Password Harvesters</span>
                <span className="font-mono text-emerald-400">42% (9,173)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="font-medium">Urgent Invoice & Wire Transfer Fraud</span>
                <span className="font-mono text-amber-400">28% (6,115)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="font-medium">Fake Package & Delivery Redirection ($1.95 Fee)</span>
                <span className="font-mono text-indigo-400">18% (3,931)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="font-medium">Executive & CEO Impersonation (Whaling)</span>
                <span className="font-mono text-rose-400">12% (2,623)</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Protection Engine Performance Comparison */}
      <div className="bg-[#121217] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Detection Engine Architecture Comparison</span>
          </h3>
          <span className="text-[11px] font-mono text-emerald-400">
            PhishSense AI vs Legacy Filters
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 font-semibold">Engine Technology</th>
                <th className="pb-3 font-semibold">Detection Type</th>
                <th className="pb-3 font-semibold">Scan Speed</th>
                <th className="pb-3 font-semibold">Accuracy Rate</th>
                <th className="pb-3 font-semibold">Zero-Day Protection</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              <tr className="bg-emerald-500/10 text-emerald-300 font-bold">
                <td className="py-3 font-sans flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>PhishSense AI (Graph Neural Network)</span>
                </td>
                <td className="py-3">Relational Context Web</td>
                <td className="py-3 text-emerald-400">3.3 ms</td>
                <td className="py-3 text-emerald-400">99.4%</td>
                <td className="py-3 text-emerald-400">Full (Catches unseen scams)</td>
                <td className="py-3 font-sans">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    ACTIVE
                  </span>
                </td>
              </tr>
              <tr className="text-slate-300">
                <td className="py-3 font-sans">Heuristic Spam Filters (Bayesian)</td>
                <td className="py-3">Word Frequency Count</td>
                <td className="py-3">5.1 ms</td>
                <td className="py-3">88.5%</td>
                <td className="py-3 text-slate-400">Low (Easily tricked by polite text)</td>
                <td className="py-3 font-sans text-slate-400">Legacy</td>
              </tr>
              <tr className="text-slate-300">
                <td className="py-3 font-sans">Static Blacklist Database (RBL/DNS)</td>
                <td className="py-3">Known Bad IP/Domain Lists</td>
                <td className="py-3">12.0 ms</td>
                <td className="py-3">76.2%</td>
                <td className="py-3 text-rose-400">None (Fails on fresh new domains)</td>
                <td className="py-3 font-sans text-slate-400">Secondary</td>
              </tr>
              <tr className="text-slate-400">
                <td className="py-3 font-sans">Keyword Rule Filters</td>
                <td className="py-3">Basic Text Matching</td>
                <td className="py-3">1.2 ms</td>
                <td className="py-3">62.0%</td>
                <td className="py-3 text-rose-400">None (Bypassed with "P@yPal")</td>
                <td className="py-3 font-sans text-slate-400">Outdated</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
