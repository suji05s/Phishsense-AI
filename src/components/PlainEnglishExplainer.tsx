import React, { useState } from 'react';
import { EmailItem, ThreatFactor } from '../types';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  UserX, 
  Link2, 
  Lock, 
  Flame, 
  Lightbulb, 
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';

interface PlainEnglishExplainerProps {
  email: EmailItem;
  onOpenSandbox: (url: string) => void;
  onHighlightToken?: (token: string) => void;
  onOpenHowAiThinks: () => void;
}

export const PlainEnglishExplainer: React.FC<PlainEnglishExplainerProps> = ({
  email,
  onOpenSandbox,
  onHighlightToken,
  onOpenHowAiThinks,
}) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const result = email.result;

  if (!result) return null;

  const isPhishing = result.isPhishing;
  const scorePercent = Math.round(result.confidenceScore * 100);

  // Determine Letter Grade and Summary
  let grade = 'A+';
  let gradeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  let verdictTitle = 'Authentic & Safe';
  let verdictSubtitle = 'This message passed authentication and shows no signs of malicious tricks.';

  if (isPhishing) {
    if (scorePercent >= 90) {
      grade = 'F (Dangerous)';
      gradeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      verdictTitle = 'Critical Phishing Trap';
      verdictSubtitle = 'Multiple deceptive red flags found. Do not click any links or reply to this sender.';
    } else if (scorePercent >= 70) {
      grade = 'D (Suspicious)';
      gradeColor = 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      verdictTitle = 'High Risk Deception';
      verdictSubtitle = 'This email uses artificial urgency or suspicious domains typical of credential theft.';
    } else {
      grade = 'C- (Questionable)';
      gradeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      verdictTitle = 'Unverified Communication';
      verdictSubtitle = 'Some elements do not match official corporate email standards.';
    }
  }

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Quick Verdict Card in Plain English */}
      <div className={`p-6 rounded-2xl border ${gradeColor} relative overflow-hidden`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              isPhishing ? 'bg-rose-500 text-slate-950 shadow-lg shadow-rose-500/20' : 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
            }`}>
              {isPhishing ? (
                <ShieldAlert className="w-8 h-8 stroke-[2.5]" />
              ) : (
                <ShieldCheck className="w-8 h-8 stroke-[2.5]" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold opacity-80">Safety Grade</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-black/40 border border-white/10">
                  {grade}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">{verdictTitle}</h2>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                {verdictSubtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <button
              onClick={onOpenHowAiThinks}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors border border-white/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>How AI figured this out?</span>
            </button>
            <span className="text-[11px] text-slate-400 mt-1 font-mono">
              AI Confidence: {scorePercent}%
            </span>
          </div>
        </div>

        {/* 3-Second Plain Language Rule */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-black/30 rounded-xl space-y-1 border border-white/5">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <UserX className="w-3.5 h-3.5 text-rose-400" />
              <span>1. Who sent this?</span>
            </div>
            <p className="text-slate-200 font-medium text-xs">
              {result.headerAnalysis.senderDomainMatch ? (
                <span className="text-emerald-400">Authentic sender domain match</span>
              ) : (
                <span className="text-rose-300">Lookalike domain ({email.sender.split('@')[1] || 'unverified'})</span>
              )}
            </p>
          </div>

          <div className="p-3 bg-black/30 rounded-xl space-y-1 border border-white/5">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Urgency Level</span>
            </div>
            <p className="text-slate-200 font-medium text-xs">
              {isPhishing ? (
                <span className="text-rose-300">Artificial pressure / Tight deadline</span>
              ) : (
                <span className="text-emerald-400">Normal business tone</span>
              )}
            </p>
          </div>

          <div className="p-3 bg-black/30 rounded-xl space-y-1 border border-white/5">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. Links Destination</span>
            </div>
            <p className="text-slate-200 font-medium text-xs">
              {result.detectedUrls.some(u => u.flagged) ? (
                <span className="text-rose-300">Deceptive credential harvest link</span>
              ) : (
                <span className="text-emerald-400">Verified official domain destination</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Plain English Red Flags Explained */}
      {isPhishing && result.threatFactors && result.threatFactors.length > 0 && (
        <div className="bg-[#121217] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>The Scam Tricks Found in This Email</span>
            </div>
            <span className="text-xs text-slate-400">
              Click any trick to highlight it in the email
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.threatFactors.map((factor, index) => {
              const matchedWord = factor.matchedTokens[0] || '';
              return (
                <div
                  key={index}
                  onClick={() => onHighlightToken && matchedWord && onHighlightToken(matchedWord)}
                  className="p-4 bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/40 rounded-xl transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300 group-hover:text-rose-200 transition-colors">
                      {index + 1}. {factor.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {factor.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {factor.description}
                  </p>

                  {factor.matchedTokens.length > 0 && (
                    <div className="pt-1 flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                      <span>Trigger words:</span>
                      <div className="flex flex-wrap gap-1">
                        {factor.matchedTokens.map((tok, tIdx) => (
                          <span key={tIdx} className="px-1.5 py-0.2 bg-rose-950/60 text-rose-300 border border-rose-800/60 rounded">
                            "{tok}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Plain English Links Breakdown */}
      {result.detectedUrls && result.detectedUrls.length > 0 && (
        <div className="bg-[#121217] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Link2 className="w-4 h-4 text-emerald-400" />
              <span>Link Destination Safety Check</span>
            </div>
            <span className="text-xs text-slate-400">
              Where do the buttons and links actually lead?
            </span>
          </div>

          <div className="space-y-3">
            {result.detectedUrls.map((link, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white font-bold truncate">
                      {link.domain}
                    </span>
                    {link.flagged ? (
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 font-mono text-[10px] font-bold rounded">
                        🚨 FAKE / DANGEROUS
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold rounded">
                        ✅ OFFICIAL & CLEAN
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="font-mono text-[11px] text-slate-500 block truncate">{link.url}</span>
                    <span className="text-slate-300 mt-1 block">{link.reason}</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenSandbox(link.url)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold transition-colors shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Link in Safe Sandbox</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Action Guide: "What Should I Do Right Now?" */}
      <div className="bg-[#121217] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Recommended Actions for You</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {isPhishing ? (
            <>
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="font-bold text-white">Do Not Click Links</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Never click buttons or enter passwords on pages linked from this email.
                </p>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="font-bold text-white">Quarantine the Email</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Move it to the Quarantine Vault to prevent accidental clicks or replies.
                </p>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="font-bold text-white">Verify Independently</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  If you have an account with the real service, visit their official app or website directly.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="font-bold text-white">Safe to Read</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  This sender has passed all cryptographic authentication (SPF/DKIM).
                </p>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="font-bold text-white">Whitelist if Needed</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Mark this sender as trusted so future messages bypass extra checks.
                </p>
              </div>

              <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="font-bold text-white">Standard Caution</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Always practice basic digital safety when sharing sensitive files.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 5. Interactive Self-Defense Checklist */}
      <div className="bg-[#121217] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Interactive 30-Second Safety Checklist</span>
          </div>
          <span className="text-xs text-slate-400">Check off as you verify</span>
        </div>

        <div className="space-y-2.5">
          {[
            { id: 'c1', label: 'Did I expect this email or transaction notification?', tip: 'Unsolicited alerts are the #1 phishing vector.' },
            { id: 'c2', label: `Does the sender address (${email.sender}) match the real company exactly?`, tip: 'Look for tiny misspellings like paypal-auth.xyz instead of paypal.com.' },
            { id: 'c3', label: 'Is the email threatening immediate loss of money, job, or account access?', tip: 'Scammers create fake urgency to make you panic and act fast.' },
            { id: 'c4', label: 'Am I being asked to enter a password, OTP, or credit card info?', tip: 'Legitimate companies rarely ask for passwords via unsolicited email links.' },
          ].map((chk) => (
            <label
              key={chk.id}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-colors cursor-pointer ${
                checkedItems[chk.id]
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900/80'
              }`}
            >
              <input
                type="checkbox"
                checked={!!checkedItems[chk.id]}
                onChange={() => toggleCheck(chk.id)}
                className="mt-0.5 h-4 w-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/40"
              />
              <div className="text-xs space-y-0.5 flex-1">
                <span className="font-medium text-slate-200 block">{chk.label}</span>
                <span className="text-[11px] text-slate-400 block">{chk.tip}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
