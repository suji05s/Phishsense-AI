import React, { useState } from 'react';
import { EmailItem } from '../types';
import { detectEmailPhishing } from '../services/api';
import { PlusCircle, X, Sparkles, Wand2, FileText } from 'lucide-react';

interface CustomEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailAnalyzed: (email: EmailItem) => void;
  userEmail?: string;
}

const TEMPLATES = [
  {
    name: '🔴 PayPal Credential Harvester',
    sender: 'service-security@paypal-auth-verify.xyz',
    subject: 'URGENT: Your PayPal account has been limited due to suspicious transactions',
    body: `Dear Customer,\n\nWe detected unauthorized transactions on your account totaling $892.40 USD. For your protection, your access is currently frozen.\n\nYou must click the link below within 12 hours to verify your identity and restore full access:\nhttps://paypal-auth-verify.xyz/login/checkpoint?id=99281\n\nFailure to verify will lead to permanent account termination.\n\nPayPal Fraud Prevention Team`,
  },
  {
    name: '🔴 Executive Wire Fraud (CEO Whaling)',
    sender: 'ceo-confidential@acme-hq-wire.top',
    subject: 'URGENT: Strict confidential wire transfer required before 4 PM',
    body: `Are you available at your desk right now?\n\nI am in an executive board meeting and cannot talk on the phone. We need to complete a critical confidential acquisition payment of $65,000 to our external audit escrow today.\n\nProcess the payment immediately to the account in the link:\nhttp://wire-escrow-docket.top/pay/65000\n\nDo not discuss this with anyone until the acquisition is finalized.\n\nRegards,\nChief Executive Officer`,
  },
  {
    name: '🟢 Legitimate Slack Invitation',
    sender: 'notifications@slack.com',
    subject: 'Alex Rivera invited you to join the Acme Engineering Slack workspace',
    body: `Hi Sujatha,\n\nAlex Rivera (alex.r@acme.io) has invited you to join the Acme Engineering workspace on Slack.\n\nJoin your teammates to collaborate, share project updates, and review deployment logs in real-time.\n\nAccept your invitation at: https://acme-engineering.slack.com/signup\n\nCheers,\nThe Slack Team`,
  },
];

export const CustomEmailModal: React.FC<CustomEmailModalProps> = ({
  isOpen,
  onClose,
  onEmailAnalyzed,
  userEmail = 'franklin2021@gmail.com',
}) => {
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const loadTemplate = (tmpl: typeof TEMPLATES[0]) => {
    setSender(tmpl.sender);
    setSubject(tmpl.subject);
    setBody(tmpl.body);
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    if (!body.trim() && !subject.trim()) {
      setErrorMessage('Please enter email content or a subject line before analyzing.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const emailPayload: Partial<EmailItem> = {
        id: `custom-${Date.now()}`,
        sender: sender || 'user@example.com',
        senderName: sender.split('@')[0] || 'Unknown',
        receiver: userEmail,
        date: 'Just Now',
        subject: subject || 'Untitled Custom Email',
        body,
        urls: body.match(/(https?:\/\/[^\s]+)/g) || [],
        unread: true,
        sourceDataset: 'Custom',
        status: 'analyzed',
      };

      const result = await detectEmailPhishing(emailPayload);
      const completeItem: EmailItem = {
        ...(emailPayload as EmailItem),
        result,
      };

      onEmailAnalyzed(completeItem);
      onClose();
    } catch (err: any) {
      console.error('Failed to analyze email:', err);
      setErrorMessage(err.message || 'Unable to connect to analysis server. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121217] border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0E0E11]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Inspect Custom Email with PhishSense AI</h2>
              <p className="text-[11px] text-slate-400">Test any email text against the Graph Attention Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template Quick Loader */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">Load Preset:</span>
          {TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              onClick={() => loadTemplate(tmpl)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors border border-slate-700"
            >
              {tmpl.name}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-950/30 border border-rose-800/60 rounded-xl text-xs text-rose-300 flex items-center justify-between gap-2">
              <span>{errorMessage}</span>
              <button 
                onClick={() => setErrorMessage(null)} 
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">From / Sender Address</label>
            <input
              type="text"
              placeholder="e.g. security@paypal-verify.xyz"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="w-full bg-[#16161D] border border-slate-700/80 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Subject Line</label>
            <input
              type="text"
              placeholder="e.g. Critical Security Alert: Account Suspended"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-[#16161D] border border-slate-700/80 rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Body & URLs</label>
            <textarea
              rows={6}
              placeholder="Paste raw email content here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-[#16161D] border border-slate-700/80 rounded-lg p-3.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-800 bg-[#0E0E11] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAnalyze}
            disabled={isProcessing || (!body && !subject)}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Extracting Relational Graph...' : 'Analyze with PhishSense AI'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
