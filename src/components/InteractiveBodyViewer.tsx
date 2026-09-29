import React, { useState } from 'react';
import { ThreatFactor } from '../types';
import { AlertTriangle, Info, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface InteractiveBodyViewerProps {
  body: string;
  threatFactors: ThreatFactor[];
  isPhishing: boolean;
  selectedTokenToHighlight?: string | null;
}

export const InteractiveBodyViewer: React.FC<InteractiveBodyViewerProps> = ({
  body,
  threatFactors,
  isPhishing,
  selectedTokenToHighlight,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<{
    text: string;
    factor?: ThreatFactor;
    position: { x: number; y: number };
  } | null>(null);

  // Collect all unique flagged tokens
  const tokenMap = new Map<string, ThreatFactor>();
  threatFactors.forEach(factor => {
    factor.matchedTokens.forEach(token => {
      if (token && token.trim().length > 2) {
        tokenMap.set(token.toLowerCase(), factor);
      }
    });
  });

  // If no threat factors or safe email, render clean text
  if (!isPhishing || tokenMap.size === 0) {
    return (
      <div className="relative">
        <div className="bg-[#0A0A0D] p-5 rounded-xl border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
          {body}
        </div>
        <div className="mt-2.5 flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>No deceptive phishing patterns or high-risk trap tokens detected in message body.</span>
        </div>
      </div>
    );
  }

  // Build a regex for token matching
  const escapedTokens = Array.from(tokenMap.keys())
    .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length);

  const regex = new RegExp(`(${escapedTokens.join('|')})`, 'gi');
  const parts = body.split(regex);

  const handleSpanClick = (partText: string, factor: ThreatFactor, e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setActiveTooltip({
      text: partText,
      factor,
      position: { x: rect.left, y: rect.bottom + window.scrollY },
    });
  };

  return (
    <div className="relative" onClick={() => setActiveTooltip(null)}>
      {/* Interactive Helper Banner */}
      <div className="mb-3 px-3.5 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between text-xs text-amber-300">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span><strong>Interactive Clue Viewer:</strong> Click highlighted red/orange words below to see why scammers use them.</span>
        </div>
        <span className="text-[11px] text-amber-400/80 font-mono hidden sm:inline">Interactive Mode Active</span>
      </div>

      {/* Body with Highlights */}
      <div className="bg-[#0A0A0D] p-5 rounded-xl border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans select-text">
        {parts.map((part, index) => {
          const lowerPart = part.toLowerCase();
          const matchedFactor = tokenMap.get(lowerPart);
          const isExplicitlyFocused = selectedTokenToHighlight && lowerPart.includes(selectedTokenToHighlight.toLowerCase());

          if (matchedFactor) {
            return (
              <button
                key={index}
                type="button"
                onClick={(e) => handleSpanClick(part, matchedFactor, e)}
                className={`inline-block px-1.5 py-0.5 mx-0.5 rounded text-xs font-semibold cursor-pointer transition-all ${
                  isExplicitlyFocused
                    ? 'bg-rose-500 text-white ring-2 ring-rose-400 scale-105 shadow-md shadow-rose-500/50 font-bold'
                    : matchedFactor.severity === 'high'
                    ? 'bg-rose-500/20 text-rose-300 border-b-2 border-rose-500 hover:bg-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-500 hover:bg-amber-500/30'
                }`}
                title={`Click to inspect clue: ${matchedFactor.title}`}
              >
                {part}
              </button>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>

      {/* Popover Tooltip for Clicked Clue */}
      {activeTooltip && activeTooltip.factor && (
        <div 
          className="mt-3 p-4 bg-slate-900 border border-rose-500/40 rounded-xl shadow-2xl space-y-2 text-xs z-30 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Red Flag Clue: "{activeTooltip.text}"</span>
            </div>
            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 font-mono text-[10px] rounded uppercase font-bold">
              {activeTooltip.factor.severity} Risk
            </span>
          </div>

          <div className="font-semibold text-white">
            Tactic: {activeTooltip.factor.title}
          </div>

          <p className="text-slate-300 text-xs leading-relaxed">
            {activeTooltip.factor.description}
          </p>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>💡 <strong>Why scammers do this:</strong> Triggers fear or urgency to bypass your normal critical thinking.</span>
            <button
              onClick={() => setActiveTooltip(null)}
              className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 text-[11px]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
