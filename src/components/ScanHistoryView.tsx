import React, { useState } from 'react';
import { LocalScanRecord } from '../types';
import { 
  History, 
  Search, 
  Trash2, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  ChevronRight, 
  X, 
  AlertCircle,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  Download,
  Check,
  FileJson
} from 'lucide-react';

interface ScanHistoryViewProps {
  scans: LocalScanRecord[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onDeleteScan: (id: string) => void;
  onClearAll?: () => void;
  onInspectScan: (scan: LocalScanRecord) => void;
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  scans,
  isLoading = false,
  onRefresh,
  onDeleteScan,
  onClearAll,
  onInspectScan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [selectedScanDetail, setSelectedScanDetail] = useState<LocalScanRecord | null>(null);
  const [exportedState, setExportedState] = useState(false);

  // Filtered scans
  const filteredScans = scans.filter((s) => {
    const matchesSearch =
      (s.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.sender || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.summary || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (riskFilter === 'high') {
      return s.riskLevel === 'High' || s.riskLevel === 'Critical';
    }
    if (riskFilter === 'medium') {
      return s.riskLevel === 'Medium';
    }
    if (riskFilter === 'low') {
      return s.riskLevel === 'Low';
    }
    return true;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this scan from your recent local history?')) {
      onDeleteScan(id);
      if (selectedScanDetail?.id === id) {
        setSelectedScanDetail(null);
      }
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all recent scans from browser storage?')) {
      if (onClearAll) onClearAll();
      setSelectedScanDetail(null);
    }
  };

  // Export entire recent scan history as a JSON file for record-keeping
  const handleExportJSON = () => {
    if (scans.length === 0) return;

    const highCount = scans.filter((s) => s.riskLevel === 'High' || s.riskLevel === 'Critical').length;
    const mediumCount = scans.filter((s) => s.riskLevel === 'Medium').length;
    const lowCount = scans.filter((s) => s.riskLevel === 'Low').length;

    const exportPayload = {
      meta: {
        system: 'PhishSense AI - Phishing Detection & Forensic Analysis System',
        exportType: 'Recent Scan History Audit Trail',
        exportedAt: new Date().toISOString(),
        totalScans: scans.length,
        summary: {
          criticalOrHighRiskScans: highCount,
          mediumRiskScans: mediumCount,
          lowRiskScans: lowCount,
        },
        storageSource: 'Browser LocalStorage',
      },
      scans: scans.map((s) => ({
        id: s.id,
        createdAt: s.createdAt,
        subject: s.subject || '(Untitled Email)',
        sender: s.sender,
        receiver: s.receiver || undefined,
        riskScore: s.riskScore,
        riskLevel: s.riskLevel,
        summary: s.summary || s.analysis || '',
        analysis: s.analysis || s.summary || '',
        detectedThreats: s.detectedThreats || [],
        indicators: s.indicators || [],
        recommendations: s.recommendations || [],
        fullEmailBody: s.fullEmailBody || undefined,
      })),
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const now = new Date();
    const dateFormatted = now.toISOString().slice(0, 10);
    const timeFormatted = now.toTimeString().slice(0, 8).replace(/:/g, '');
    link.href = url;
    link.download = `phishsense-scan-history-${dateFormatted}-${timeFormatted}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportedState(true);
    setTimeout(() => {
      setExportedState(false);
    }, 2500);
  };

  // Export single scan record as JSON
  const handleExportSingleScan = (scan: LocalScanRecord) => {
    const singlePayload = {
      meta: {
        system: 'PhishSense AI - Forensic Email Audit',
        exportType: 'Single Scan Record',
        exportedAt: new Date().toISOString(),
        scanId: scan.id,
      },
      scan: {
        id: scan.id,
        createdAt: scan.createdAt,
        subject: scan.subject || '(Untitled Email)',
        sender: scan.sender,
        receiver: scan.receiver || undefined,
        riskScore: scan.riskScore,
        riskLevel: scan.riskLevel,
        summary: scan.summary || scan.analysis || '',
        analysis: scan.analysis || scan.summary || '',
        detectedThreats: scan.detectedThreats || [],
        indicators: scan.indicators || [],
        recommendations: scan.recommendations || [],
        fullEmailBody: scan.fullEmailBody || undefined,
      },
    };

    const blob = new Blob([JSON.stringify(singlePayload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeSubject = (scan.subject || 'scan')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 24);
    link.href = url;
    link.download = `phishsense-scan-${safeSubject}-${scan.id.slice(0, 8)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatScanDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      if (isToday) {
        return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  const getRiskBadge = (level: string, score: number) => {
    switch (level) {
      case 'Critical':
      case 'High':
        return (
          <span className="px-2.5 py-1 bg-rose-500/15 border border-rose-500/40 text-rose-400 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>🔴 {level.toUpperCase()} RISK ({score}/100)</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/40 text-amber-400 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>🟡 MEDIUM RISK ({score}/100)</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>🟢 LOW RISK ({score}/100)</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 bg-[#0A0A0D] p-5 md:p-8 overflow-y-auto space-y-6 max-w-6xl mx-auto w-full">
      {/* 1. Header Overview */}
      <div className="bg-[#111116] border border-slate-800/80 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <History className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Recent Scans
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-900 border border-slate-800 text-slate-300">
              Browser LocalStorage
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Local audit trail of your latest email analyses (saved automatically in browser storage, limited to latest 20 scans).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportJSON}
            disabled={scans.length === 0}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              exportedState
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 hover:text-emerald-300 border-emerald-500/30 hover:border-emerald-500/50 shadow-sm shadow-emerald-950/20'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            title={scans.length === 0 ? 'No scan history to export yet' : 'Export recent scan history as a JSON file'}
          >
            {exportedState ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
                {scans.length > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded-md font-mono">
                    {scans.length}
                  </span>
                )}
              </>
            )}
          </button>

          {scans.length > 0 && onClearAll && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 text-xs font-medium rounded-xl border border-slate-800 hover:border-rose-800/40 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Search & Risk Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111116] border border-slate-800/80 rounded-xl p-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search recent scans by subject or sender..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setRiskFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              riskFilter === 'all'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({scans.length})
          </button>

          <button
            onClick={() => setRiskFilter('high')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              riskFilter === 'high'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            High & Critical ({scans.filter(s => s.riskLevel === 'High' || s.riskLevel === 'Critical').length})
          </button>

          <button
            onClick={() => setRiskFilter('medium')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              riskFilter === 'medium'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            Medium ({scans.filter(s => s.riskLevel === 'Medium').length})
          </button>

          <button
            onClick={() => setRiskFilter('low')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              riskFilter === 'low'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            Low / Safe ({scans.filter(s => s.riskLevel === 'Low').length})
          </button>
        </div>
      </div>

      {/* 3. Scan List */}
      {scans.length === 0 ? (
        <div className="p-16 bg-[#111116] border border-slate-800 rounded-2xl text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No Recent Scans Stored</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Your recent scans will automatically appear here once you analyze an email. Test an email using "Inspect Email" or click "Scan" on any inbox item.
          </p>
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="p-12 bg-[#111116] border border-slate-800 rounded-2xl text-center space-y-2">
          <p className="text-xs text-slate-400">No scans match "{searchQuery}".</p>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-emerald-400 hover:underline"
          >
            Clear search filter
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredScans.map((scan) => {
            const isHigh = scan.riskLevel === 'High' || scan.riskLevel === 'Critical';

            return (
              <div
                key={scan.id}
                onClick={() => setSelectedScanDetail(scan)}
                className={`p-4 bg-[#111116] hover:bg-[#15151C] border rounded-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group ${
                  isHigh ? 'border-rose-900/30 hover:border-rose-700/50' : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Left: Info */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white truncate max-w-md group-hover:text-emerald-400 transition-colors">
                      {scan.subject || '(Untitled Email)'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatScanDate(scan.createdAt)}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 truncate">
                    <span className="font-semibold text-slate-300">From: </span>
                    <span className="font-mono text-slate-400">{scan.sender}</span>
                  </div>

                  <div className="text-xs text-slate-400 line-clamp-1 max-w-2xl">
                    {scan.summary || scan.analysis}
                  </div>
                </div>

                {/* Right: Badge & Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {getRiskBadge(scan.riskLevel, scan.riskScore)}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onInspectScan(scan);
                    }}
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Open in Email Inspector"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </button>

                  <button
                    onClick={(e) => handleDelete(scan.id, e)}
                    className="p-1.5 bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                    title="Delete Scan from Local History"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Complete Analysis Modal */}
      {selectedScanDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0E0E11]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">Scan Analysis Record</h2>
                  <p className="text-[11px] text-slate-400 font-mono">ID: {selectedScanDetail.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedScanDetail(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              {/* Top Summary Banner */}
              <div className="bg-[#16161D] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-white">{selectedScanDetail.subject}</div>
                  <div className="text-slate-400 text-[11px]">
                    From: <span className="font-mono text-slate-300">{selectedScanDetail.sender}</span> • {formatScanDate(selectedScanDetail.createdAt)}
                  </div>
                </div>
                <div>{getRiskBadge(selectedScanDetail.riskLevel, selectedScanDetail.riskScore)}</div>
              </div>

              {/* Executive Summary Analysis */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-emerald-400">
                  Phishing Analysis Summary
                </h4>
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-300 leading-relaxed font-sans">
                  {selectedScanDetail.summary || selectedScanDetail.analysis}
                </div>
              </div>

              {/* Detected Threats */}
              {selectedScanDetail.detectedThreats && selectedScanDetail.detectedThreats.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-rose-400">
                    Detected Threat Factors ({selectedScanDetail.detectedThreats.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedScanDetail.detectedThreats.map((tf: any, i: number) => (
                      <div key={i} className="p-3 bg-rose-950/20 border border-rose-800/40 rounded-xl">
                        <div className="font-bold text-rose-300 text-xs">{tf.title || tf.type}</div>
                        <div className="text-slate-300 text-[11px] mt-0.5">{tf.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {selectedScanDetail.recommendations && selectedScanDetail.recommendations.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-teal-400">
                    Recommendations & Actions
                  </h4>
                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-300 leading-relaxed space-y-1">
                    {selectedScanDetail.recommendations.map((rec: string, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Original Content Snippet */}
              {selectedScanDetail.fullEmailBody && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px] text-slate-400">
                    Email Content
                  </h4>
                  <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 font-mono text-[11px] whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {selectedScanDetail.fullEmailBody}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#0E0E11] flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    onInspectScan(selectedScanDetail);
                    setSelectedScanDetail(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open in Email Inspector</span>
                </button>

                <button
                  onClick={() => handleExportSingleScan(selectedScanDetail)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  title="Export this individual scan record as a JSON file"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Export JSON</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedScanDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
