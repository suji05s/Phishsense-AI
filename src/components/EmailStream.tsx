import React, { useState } from 'react';
import { EmailItem } from '../types';
import { Search, ShieldAlert, ShieldCheck, Clock, Mail, AlertTriangle } from 'lucide-react';

interface EmailStreamProps {
  emails: EmailItem[];
  selectedEmailId: string | null;
  onSelectEmail: (email: EmailItem) => void;
  onScanEmail: (email: EmailItem) => void;
  isScanning: boolean;
  className?: string;
}

export const EmailStream: React.FC<EmailStreamProps> = ({
  emails,
  selectedEmailId,
  onSelectEmail,
  onScanEmail,
  isScanning,
  className = '',
}) => {
  const [filter, setFilter] = useState<'all' | 'phishing' | 'legitimate' | 'unread' | 'quarantined'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmails = emails.filter((item) => {
    // Tab filter
    if (filter === 'phishing' && !item.result?.isPhishing) return false;
    if (filter === 'legitimate' && (item.result?.isPhishing || !item.result)) return false;
    if (filter === 'unread' && !item.unread) return false;
    if (filter === 'quarantined' && item.status !== 'quarantined') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject = item.subject.toLowerCase().includes(q);
      const matchSender = item.sender.toLowerCase().includes(q) || (item.senderName && item.senderName.toLowerCase().includes(q));
      const matchBody = item.body.toLowerCase().includes(q);
      return matchSubject || matchSender || matchBody;
    }

    return true;
  });

  return (
    <section className={`border-r border-slate-800/60 bg-[#0B0B0D] flex flex-col select-none overflow-hidden h-full ${className || 'w-full md:w-80 lg:w-[380px] shrink-0'}`}>
      {/* Stream Header */}
      <div className="p-4 border-b border-slate-800/60 flex flex-col gap-3 bg-[#0B0B0D]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white tracking-tight">Email Stream</h2>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded-full">
              {filteredEmails.length}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {emails.filter(e => e.result?.isPhishing).length} Threats Blocked
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search headers, tokens, domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121217] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-slate-100 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            All ({emails.length})
          </button>
          <button
            onClick={() => setFilter('phishing')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              filter === 'phishing'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold'
                : 'text-rose-400/80 hover:bg-rose-500/10'
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            Threats ({emails.filter(e => e.result?.isPhishing).length})
          </button>
          <button
            onClick={() => setFilter('legitimate')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              filter === 'legitimate'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-emerald-400/80 hover:bg-emerald-500/10'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            Safe ({emails.filter(e => e.result && !e.result.isPhishing).length})
          </button>
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {filteredEmails.length === 0 ? (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2">
            <Mail className="w-8 h-8 text-slate-400" />
            <p className="text-xs">No emails match the current filter or search.</p>
          </div>
        ) : (
          filteredEmails.map((item) => {
            const isSelected = item.id === selectedEmailId;
            const isPhishing = item.result?.isPhishing;
            const isAnalyzed = !!item.result;

            return (
              <div
                key={item.id}
                onClick={() => onSelectEmail(item)}
                className={`p-4 transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-800/30 border-l-2 ' + (isPhishing ? 'border-rose-500 bg-rose-950/10' : 'border-emerald-500 bg-emerald-950/10')
                    : 'hover:bg-slate-800/20 border-l-2 border-transparent'
                }`}
              >
                {/* Header Row: Sender + Timestamp */}
                <div className="flex justify-between items-start mb-1 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {item.unread && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    )}
                    <span className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {item.senderName || item.sender}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {item.date}
                  </span>
                </div>

                {/* Subject */}
                <div className={`text-xs font-medium mb-1.5 line-clamp-1 ${
                  isPhishing ? 'text-rose-300/90' : isSelected ? 'text-emerald-400' : 'text-slate-300'
                }`}>
                  {item.subject}
                </div>

                {/* Body Snippet */}
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2 font-normal">
                  {item.body}
                </p>

                {/* Footer Metadata & Badges */}
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    {item.sourceDataset && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 font-mono border border-slate-700/50">
                        {item.sourceDataset}
                      </span>
                    )}
                    {item.status === 'quarantined' && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/60 font-semibold">
                        Quarantined
                      </span>
                    )}
                  </div>

                  {/* Classification Tag */}
                  {isAnalyzed ? (
                    isPhishing ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold font-mono flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {(item.result!.confidenceScore * 100).toFixed(0)}% Phish
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold font-mono flex items-center gap-1">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Safe
                      </span>
                    )
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onScanEmail(item);
                      }}
                      disabled={isScanning}
                      className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded font-medium text-[10px] transition-colors"
                    >
                      Scan GAT
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
