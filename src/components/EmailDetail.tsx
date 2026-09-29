import React, { useState } from 'react';
import { EmailItem } from '../types';
import { GraphVisualizer } from './GraphVisualizer';
import { PlainEnglishExplainer } from './PlainEnglishExplainer';
import { InteractiveBodyViewer } from './InteractiveBodyViewer';
import { HowAiThinksModal } from './HowAiThinksModal';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  Download, 
  Flame, 
  FlaskConical, 
  FileCode, 
  Check, 
  Eye, 
  SlidersHorizontal, 
  HelpCircle,
  ArrowLeft
} from 'lucide-react';

interface EmailDetailProps {
  email: EmailItem;
  onQuarantine: (email: EmailItem) => void;
  onWhitelist: (email: EmailItem) => void;
  onOpenSandbox: (url: string) => void;
  onScanEmail: (email: EmailItem) => void;
  isScanning: boolean;
  onBackToList?: () => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({
  email,
  onQuarantine,
  onWhitelist,
  onOpenSandbox,
  onScanEmail,
  isScanning,
  onBackToList,
}) => {
  const [copiedStix, setCopiedStix] = useState(false);
  const [viewMode, setViewMode] = useState<'plain' | 'tech'>('plain');
  const [highlightedToken, setHighlightedToken] = useState<string | null>(null);
  const [isHowAiThinksOpen, setIsHowAiThinksOpen] = useState(false);

  const result = email.result;
  const isPhishing = result?.isPhishing;

  const exportStixJson = () => {
    const stixBundle = {
      type: 'bundle',
      id: `bundle--${email.id}`,
      spec_version: '2.1',
      objects: [
        {
          type: 'indicator',
          id: `indicator--${email.id}`,
          created: new Date().toISOString(),
          name: `Phishing Detection: ${email.subject}`,
          description: result?.explanation || 'Phishing email detected by PhishSense AI model.',
          pattern: `[email-message:from_ref.value = '${email.sender}']`,
          confidence: result ? Math.round(result.confidenceScore * 100) : 95,
          labels: ['phishing', 'threat-report'],
        },
        ...(result?.detectedUrls.map((u, i) => ({
          type: 'url',
          id: `url--${email.id}-${i}`,
          value: u.url,
          threat_score: u.riskScore,
        })) || [])
      ]
    };

    const blob = new Blob([JSON.stringify(stixBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishsense-stix-${email.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopiedStix(true);
    setTimeout(() => setCopiedStix(false), 2000);
  };

  return (
    <section className="flex-1 bg-[#0F0F12] flex flex-col overflow-y-auto overflow-x-hidden">
      {/* Top Banner with Action Controls & View Mode Toggle */}
      <div className="border-b border-slate-800/60 p-3 md:p-5 bg-[#0E0E11]/95 sticky top-0 z-10 backdrop-blur-md">
        {/* Mobile Back Button */}
        {onBackToList && (
          <div className="md:hidden pb-3">
            <button
              onClick={onBackToList}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Back to Inbox List</span>
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
          {/* Left Status Badge */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {result ? (
              isPhishing ? (
                <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-rose-500/15 border border-rose-500/30 rounded-lg text-rose-400 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
                  <span>PHISHING THREAT</span>
                  <span className="font-mono bg-rose-950/80 px-1.5 py-0.5 rounded text-[11px] text-rose-300 border border-rose-800/60 hidden sm:inline">
                    {(result.confidenceScore * 100).toFixed(1)}% Confidence
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-lg text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>VERIFIED SAFE</span>
                  <span className="font-mono bg-emerald-950/80 px-1.5 py-0.5 rounded text-[11px] text-emerald-300 border border-emerald-800/60 hidden sm:inline">
                    {((1 - result.confidenceScore) * 100).toFixed(1)}% Legitimacy
                  </span>
                </div>
              )
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 font-medium text-xs">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Pending PhishSense Scan</span>
              </div>
            )}

            {/* Mode Switcher: Plain English vs Deep Tech */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('plain')}
                className={`px-2.5 sm:px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
                  viewMode === 'plain'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🟢 Plain English</span>
              </button>
              <button
                onClick={() => setViewMode('tech')}
                className={`px-2.5 sm:px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
                  viewMode === 'tech'
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🔬 Deep Tech</span>
              </button>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {!result && (
              <button
                onClick={() => onScanEmail(email)}
                disabled={isScanning}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-md shadow-emerald-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run PhishSense Scan</span>
              </button>
            )}

            {result && (
              <>
                <button
                  onClick={() => setIsHowAiThinksOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>How AI Works</span>
                </button>

                {viewMode === 'tech' && (
                  <button
                    onClick={exportStixJson}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
                    title="Export STIX 2.1 Threat Indicator JSON"
                  >
                    {copiedStix ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedStix ? 'Exported!' : 'Export STIX'}</span>
                  </button>
                )}

                {isPhishing && email.status !== 'quarantined' && (
                  <button
                    onClick={() => onQuarantine(email)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors shadow-lg shadow-rose-900/40"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Quarantine Threat</span>
                  </button>
                )}

                {email.status === 'quarantined' && (
                  <button
                    onClick={() => onWhitelist(email)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
                  >
                    <span>Restore from Quarantine</span>
                  </button>
                )}

                {!isPhishing && (
                  <button
                    onClick={() => onWhitelist(email)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-medium transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Whitelist Sender</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Detail Content Area */}
      <div className="p-6 md:p-8 flex-1 space-y-6 max-w-5xl mx-auto w-full">
        {/* Email Header Card */}
        <div className="bg-[#121217] border border-slate-800/80 rounded-2xl p-6 space-y-3">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
              {email.subject}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">From:</span>
                <span className="font-semibold text-slate-200">{email.senderName || email.sender}</span>
                <span className="text-slate-400 font-mono">({email.sender})</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Date:</span>
                <span className="text-slate-300 font-mono">{email.date}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Stream:</span>
                <span className="text-emerald-400 font-mono">{email.sourceDataset === 'CEAS_08' ? 'Google Workspace' : (email.sourceDataset === 'Nazario' ? 'Corporate Inbound' : (email.sourceDataset || 'Gmail Protected'))}</span>
              </div>
            </div>
          </div>

          {/* Authentication & Security Headers (SPF / DKIM / DMARC) */}
          {result?.headerAnalysis && viewMode === 'tech' && (
            <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Auth Validation:</span>
                
                {/* SPF */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">SPF:</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold ${
                    result.headerAnalysis.spf === 'PASS' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {result.headerAnalysis.spf}
                  </span>
                </div>

                {/* DKIM */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">DKIM:</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold ${
                    result.headerAnalysis.dkim === 'PASS' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {result.headerAnalysis.dkim}
                  </span>
                </div>

                {/* DMARC */}
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">DMARC:</span>
                  <span className={`px-1.5 py-0.5 rounded font-bold ${
                    result.headerAnalysis.dmarc === 'PASS' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {result.headerAnalysis.dmarc}
                  </span>
                </div>
              </div>

              {result.headerAnalysis.origIpGeo && (
                <div className="text-slate-400">
                  Origin: <span className="text-slate-300">{result.headerAnalysis.origIpGeo}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🟢 VIEW MODE 1: PLAIN ENGLISH / SIMPLE EXPLAINABILITY MODE */}
        {viewMode === 'plain' && result && (
          <PlainEnglishExplainer
            email={email}
            onOpenSandbox={onOpenSandbox}
            onHighlightToken={(tok) => setHighlightedToken(tok)}
            onOpenHowAiThinks={() => setIsHowAiThinksOpen(true)}
          />
        )}

        {/* Email Body with Interactive Clue Inspection */}
        <div className="bg-[#121217] border border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span>Email Message Text</span>
              {isPhishing && (
                <span className="text-[11px] font-normal text-rose-400 lowercase font-mono">
                  (interactive clues enabled)
                </span>
              )}
            </div>
          </div>

          <InteractiveBodyViewer
            body={email.body}
            threatFactors={result?.threatFactors || []}
            isPhishing={!!isPhishing}
            selectedTokenToHighlight={highlightedToken}
          />
        </div>

        {/* 🔬 VIEW MODE 2: DEEP TECH & GRAPH ATTENTION EXPLORER */}
        {viewMode === 'tech' && result && (
          <div className="space-y-6">
            {/* GAT Graph Visualizer */}
            {result.nodes && result.nodes.length > 0 && (
              <GraphVisualizer
                nodes={result.nodes}
                edges={result.edges}
                isPhishing={result.isPhishing}
                confidenceScore={result.confidenceScore}
                gatAttentionSummary={result.gatAttentionSummary}
              />
            )}

            {/* Threat Factors */}
            {result.threatFactors && result.threatFactors.length > 0 && (
              <div className="bg-[#121217] border border-rose-500/30 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>Adversarial & Psychological Triggers Identified</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.threatFactors.map((factor, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{factor.title}</span>
                        <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                          factor.severity === 'high' ? 'bg-rose-500/20 text-rose-400 font-bold' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {factor.severity} Risk
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {factor.description}
                      </p>
                      {factor.matchedTokens.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {factor.matchedTokens.map((tok, tIdx) => (
                            <span key={tIdx} className="px-1.5 py-0.5 bg-slate-800 text-rose-300 font-mono text-[10px] rounded border border-slate-700">
                              {tok}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hyperlink Verification */}
            {result.detectedUrls && result.detectedUrls.length > 0 && (
              <div className="bg-[#121217] border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                    <span>Extracted Hyperlinks & Destination Verification</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {result.detectedUrls.length} Link(s) Analyzed
                  </span>
                </div>

                <div className="space-y-2">
                  {result.detectedUrls.map((link, idx) => (
                    <div key={idx} className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-200 truncate">{link.url}</span>
                          {link.flagged ? (
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono text-[10px] font-bold shrink-0">
                              MALICIOUS
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold shrink-0">
                              VERIFIED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{link.reason}</p>
                      </div>

                      <button
                        onClick={() => onOpenSandbox(link.url)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-medium transition-colors shrink-0"
                      >
                        <FlaskConical className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Safe Detonation Preview</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Metrics & Norms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Explainable AI (XAI) Summary</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.explanation}
                </p>
              </div>

              <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Recommended Remediation</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.remediationAdvice.map((advice, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How AI Thinks Modal */}
      <HowAiThinksModal
        isOpen={isHowAiThinksOpen}
        onClose={() => setIsHowAiThinksOpen(false)}
      />
    </section>
  );
};
