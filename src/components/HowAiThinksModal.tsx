import React, { useState } from 'react';
import { Sparkles, X, Brain, Network, Zap, ShieldCheck, ArrowRight, Eye, Layers } from 'lucide-react';

interface HowAiThinksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowAiThinksModal: React.FC<HowAiThinksModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "1. The AI Reads the Words (DistilBERT)",
      badge: "Language Understanding",
      icon: Brain,
      color: "from-blue-500/20 to-indigo-500/20 text-indigo-400 border-indigo-500/30",
      description: "Just like a human reads an email, our lightweight Transformer model (DistilBERT) reads every word, header, and link. Instead of just searching for 'bad keywords', it understands the subtle emotional tone, tone of urgency, and context of each sentence.",
      analogy: "Think of this as the AI reading the whole story rather than just matching a list of banned words.",
      stat: "768 contextual features per token",
    },
    {
      title: "2. The Detective's Corkboard (Graph Network)",
      badge: "Relational Structure",
      icon: Network,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
      description: "Phishing emails work because words trick you when put together: 'Account' + 'Suspended' + 'Click Here' + 'Fake Domain'. Standard spam filters look at words separately; PhishSense AI connects them into a web of red strings on a corkboard (a mathematical Graph).",
      analogy: "A single word like 'urgent' isn't dangerous by itself. But 'urgent' connected directly to 'send password' creates a glaring red flag.",
      stat: "Connects nearby words & distant intent",
    },
    {
      title: "3. The Spotlight (Graph Attention Layer)",
      badge: "Multi-Head Attention",
      icon: Eye,
      color: "from-amber-500/20 to-rose-500/20 text-amber-400 border-amber-500/30",
      description: "The Graph Attention Network (GAT) shines a mathematical spotlight on the most suspicious connections between words. It learns to ignore polite filler text like 'Dear Customer' and zooms in with high attention on deceptive tricks like fake domains and artificial deadlines.",
      analogy: "Like a magnifying glass that automatically highlights the hidden trap doors in the email.",
      stat: "256 multi-head attention channels",
    },
    {
      title: "4. The Verdict (99.4% Accuracy)",
      badge: "Instant Decision",
      icon: ShieldCheck,
      color: "from-emerald-500/20 to-emerald-700/20 text-emerald-400 border-emerald-500/30",
      description: "In just 3.3 milliseconds, the AI calculates a final probability score. If the combination of word graphs and attention coefficients points to a scam, it instantly warns you and neutralizes the threat before you can click.",
      analogy: "Faster than the blink of an eye, you get an easy-to-understand verdict with zero confusing jargon.",
      stat: "3.3ms per email • 0% hassle",
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121217] border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0E0E11]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">How PhishSense AI Thinks</h2>
              <p className="text-[11px] text-slate-400">Demystifying Graph Neural Networks in Plain English</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Navigation Pills */}
        <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeStep === idx
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Step {idx + 1}</span>
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
          {(() => {
            const current = steps[activeStep];
            const Icon = current.icon;
            return (
              <div className="space-y-6">
                {/* Step Banner */}
                <div className={`p-6 rounded-2xl border bg-gradient-to-br ${current.color} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-black/40 border border-white/10">
                      {current.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-300">
                      {current.stat}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{current.title}</h3>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {current.description}
                  </p>
                </div>

                {/* Everyday Analogy Card */}
                <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <span>💡 Simple Everyday Analogy</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {current.analogy}
                  </p>
                </div>

                {/* Interactive Visual Comparison: Old Way vs PhishSense AI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-rose-400">
                      ❌ Old Standard Filters
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Look at isolated words. Scammers easily bypass them by using polite words, changing letters ("P@yPal"), or hiding links behind innocuous buttons.
                    </p>
                  </div>

                  <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-emerald-400">
                      ✅ PhishSense AI (Graph Neural Network)
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Draws relational links between the whole email body, sender authenticity, and links, catching even the newest zero-day scams with 99.4% accuracy.
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Footer Navigation */}
        <div className="p-5 border-t border-slate-800 bg-[#0E0E11] flex items-center justify-between">
          <button
            onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeStep === i ? 'w-5 bg-emerald-400' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {activeStep < steps.length - 1 ? (
            <button
              onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
            >
              Got it!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
