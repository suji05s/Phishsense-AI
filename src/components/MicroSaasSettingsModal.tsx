import React, { useState } from 'react';
import { FileCode, X, Copy, Check, Terminal, Key, ShieldCheck, Webhook } from 'lucide-react';

export const MicroSaasSettingsModal: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedYara, setCopiedYara] = useState(false);

  const sampleYara = `rule PhishSense_HighUrgency_Harvest {
    meta:
        description = "Detects high-threat discontinuous urgency & credential harvesting patterns"
        author = "PhishSense AI Neural Engine"
        reference = "PhishSense Threat Intelligence Network (Rule ID: TR-2026-GNN)"
        accuracy = "99.4%"
    strings:
        $urgency1 = "unauthorized login" nocase
        $urgency2 = "account suspended" nocase
        $urgency3 = "within 24 hours" nocase
        $action1  = "verify your password" nocase
        $action2  = "click here to restore" nocase
        $domain   = /(accounts-.*\\.cc|paypal-.*\\.xyz|.*-invoice.*\\.net)/
    condition:
        2 of ($urgency*) and 1 of ($action*) and $domain
}`;

  const copyToClipboard = (text: string, isKey: boolean) => {
    navigator.clipboard.writeText(text);
    if (isKey) {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedYara(true);
      setTimeout(() => setCopiedYara(false), 2000);
    }
  };

  return (
    <div className="flex-1 bg-[#0F0F12] p-6 md:p-8 overflow-y-auto space-y-6 max-w-5xl mx-auto w-full">
      {/* Title */}
      <div className="bg-[#121217] border border-slate-800 rounded-xl p-6 space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <FileCode className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">MicroSaaS Integration & YARA Rules</h1>
            <p className="text-xs text-slate-400">Connect Gmail Webhooks, RFC-822 Gateway Proxies, and Custom Threat Filters</p>
          </div>
        </div>
      </div>

      {/* API Endpoint & Key */}
      <div className="bg-[#121217] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>PhishSense AI REST API</span>
          </h2>
          <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
            HTTP POST /api/detect
          </span>
        </div>

        <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center justify-between font-mono text-xs">
          <div className="truncate text-slate-300">
            <span className="text-slate-400">API Key: </span>
            <span className="text-emerald-400 font-bold">ps_live_gnn_8f9a2b7c4d1e6e0f</span>
          </div>
          <button
            onClick={() => copyToClipboard('ps_live_gnn_8f9a2b7c4d1e6e0f', true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors ml-2"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
          </button>
        </div>

        <div className="bg-[#0A0A0D] border border-slate-800 rounded-lg p-4 font-mono text-[11px] text-slate-300 overflow-x-auto">
          <div className="text-slate-400 mb-1"># Curl Example:</div>
          <div className="text-emerald-400">
            curl -X POST https://your-domain.com/api/detect \<br />
            &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
            &nbsp;&nbsp;-H "Authorization: Bearer ps_live_gnn_8f9a2b7c4d1e6e0f" \<br />
            &nbsp;&nbsp;-d '{`{"sender":"alert@paypal-verify.xyz","subject":"Account Limited","body":"Click here"}`}'
          </div>
        </div>
      </div>

      {/* YARA Threat Rules */}
      <div className="bg-[#121217] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Generated YARA / Google Workspace Compliance Rule</span>
          </h2>
          <button
            onClick={() => copyToClipboard(sampleYara, false)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
          >
            {copiedYara ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedYara ? 'Copied Rule' : 'Copy YARA'}</span>
          </button>
        </div>

        <pre className="p-4 bg-[#0A0A0D] border border-slate-800 rounded-lg text-[11px] font-mono text-emerald-300 leading-relaxed overflow-x-auto">
          {sampleYara}
        </pre>
      </div>
    </div>
  );
};
