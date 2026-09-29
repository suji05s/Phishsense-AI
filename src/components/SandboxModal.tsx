import React, { useState, useEffect } from 'react';
import { analyzeSandboxUrl } from '../services/api';
import { FlaskConical, X, ShieldAlert, ShieldCheck, Globe, Lock, Unlock, Server, AlertTriangle } from 'lucide-react';

interface SandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl: string;
}

export const SandboxModal: React.FC<SandboxModalProps> = ({
  isOpen,
  onClose,
  targetUrl,
}) => {
  const [urlInput, setUrlInput] = useState(targetUrl);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (targetUrl) {
      setUrlInput(targetUrl);
      runDetonation(targetUrl);
    }
  }, [targetUrl]);

  const runDetonation = async (url: string) => {
    if (!url) return;
    setLoading(true);
    try {
      const data = await analyzeSandboxUrl(url);
      setAnalysis(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121217] border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0E0E11]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Safe Link Sandbox Detonation</h2>
              <p className="text-[11px] text-slate-400">Isolated headless runtime inspection for suspicious URLs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* URL Input Bar */}
        <div className="p-5 border-b border-slate-800/80 bg-[#0F0F12] flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://..."
            className="flex-1 bg-[#16161D] border border-slate-700/80 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => runDetonation(urlInput)}
            disabled={loading}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Detonating...' : 'Detonate in Sandbox'}
          </button>
        </div>

        {/* Inspection Results */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {analysis ? (
            <>
              {/* Verdict Card */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                analysis.isFlagged
                  ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                  : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              }`}>
                <div className="flex items-center gap-3">
                  {analysis.isFlagged ? (
                    <ShieldAlert className="w-6 h-6 text-rose-400" />
                  ) : (
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  )}
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider font-sans">
                      Verdict: {analysis.sandboxSafetyVerdict}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      Risk Index: {(analysis.riskScore * 100).toFixed(0)} / 100
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded font-mono text-xs font-bold ${
                  analysis.isFlagged ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
                }`}>
                  {analysis.isFlagged ? 'BLOCKED' : 'CLEAN'}
                </span>
              </div>

              {/* Technical Indicators Grid */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-400 font-sans block">Domain Authority</span>
                  <span className="text-white font-bold block truncate">{analysis.domain}</span>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-400 font-sans block">TLS Protocol</span>
                  <div className="flex items-center gap-1">
                    {analysis.isHttps ? (
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Unlock className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    <span className={analysis.isHttps ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {analysis.tlsStatus}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-400 font-sans block">Hosting ASN Network</span>
                  <span className="text-slate-300 block truncate">{analysis.dnsRecords.asn}</span>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-400 font-sans block">IP Resolution & Geo</span>
                  <span className="text-slate-300 block">{analysis.dnsRecords.aRecord} ({analysis.dnsRecords.country})</span>
                </div>
              </div>

              {/* Simulated Headless Browser Screenshot Preview */}
              <div className="bg-[#0A0A0D] border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2">Isolated Sandbox Container (Port 8443)</span>
                  </div>
                  <span>Headless Chromium</span>
                </div>

                <div className="h-44 bg-[#0F0F14] border border-slate-800 rounded-lg flex flex-col items-center justify-center p-6 text-center text-slate-400 relative overflow-hidden">
                  {analysis.isFlagged ? (
                    <div className="space-y-2 z-10">
                      <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
                      <div className="text-xs font-bold text-rose-300">
                        Phishing Checkpoint Deception Intercepted
                      </div>
                      <p className="text-[11px] text-slate-400 max-w-md">
                        The destination page renders a fake authentication form designed to harvest OAuth tokens and passwords. User navigation was neutralized safely.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 z-10">
                      <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                      <div className="text-xs font-bold text-emerald-300">
                        Safe Verified Destination
                      </div>
                      <p className="text-[11px] text-slate-400 max-w-md">
                        Rendered clean DOM tree without malicious javascript payloads or credential interceptors.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-400">
              Enter a URL above to inspect destination infrastructure in the sandbox.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
