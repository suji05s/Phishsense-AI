import React, { useState, useEffect } from 'react';
import { EmailItem, UserProfile, LocalScanRecord } from './types';
import { INITIAL_SAMPLE_EMAILS } from './data/benchmarkData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { EmailStream } from './components/EmailStream';
import { EmailDetail } from './components/EmailDetail';
import { ResearchBenchmarkView } from './components/ResearchBenchmarkView';
import { GraphVisualizer } from './components/GraphVisualizer';
import { BatchScannerModal } from './components/BatchScannerModal';
import { SandboxModal } from './components/SandboxModal';
import { CustomEmailModal } from './components/CustomEmailModal';
import { MicroSaasSettingsModal } from './components/MicroSaasSettingsModal';
import { PhishingTrainerLab } from './components/PhishingTrainerLab';
import { ScanHistoryView } from './components/ScanHistoryView';
import { analyzeEmail } from './services/api';
import { getRecentScans, deleteRecentScan, clearAllRecentScans } from './services/scanStorage';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Mail, 
  RefreshCw, 
  Sparkles,
  LayoutDashboard,
  Inbox,
  FlaskConical,
  Target,
  BarChart4,
  X,
  History
} from 'lucide-react';

export default function App() {
  // Mini-project Local Analyst Profile (no external Supabase/Google auth required)
  const user: UserProfile = {
    id: 'analyst-1',
    email: 'franklin2021@gmail.com',
    full_name: 'Franklin CyberOps',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  };

  // Recent Scans State (backed by browser localStorage)
  const [scans, setScans] = useState<LocalScanRecord[]>(() => getRecentScans());

  // Existing In-Memory Stream State
  const [emails, setEmails] = useState<EmailItem[]>(INITIAL_SAMPLE_EMAILS);
  const [selectedEmailId, setSelectedEmailId] = useState<string>(INITIAL_SAMPLE_EMAILS[0].id);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isRefreshingGmail, setIsRefreshingGmail] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [mobileInboxMode, setMobileInboxMode] = useState<'list' | 'detail'>('list');

  // Modals
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [sandboxUrl, setSandboxUrl] = useState<string | null>(null);

  // Sync recent scans from storage on mount
  useEffect(() => {
    setScans(getRecentScans());
  }, []);

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];

  const emailCounts = {
    total: emails.length,
    phishing: emails.filter((e) => e.result?.isPhishing).length,
    clean: emails.filter((e) => e.result && !e.result.isPhishing).length,
    quarantined: emails.filter((e) => e.status === 'quarantined').length,
  };

  // Scan email via backend POST /api/analyze and update Recent Scans
  const handleScanEmail = async (email: EmailItem) => {
    setIsScanning(true);
    try {
      const result = await analyzeEmail(email);
      setEmails((prev) =>
        prev.map((item) =>
          item.id === email.id
            ? { ...item, status: 'analyzed', result }
            : item
        )
      );
      // Immediately refresh recent scans from localStorage
      setScans(getRecentScans());
    } catch (err) {
      console.error('Inference error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Quarantine Threat
  const handleQuarantine = (email: EmailItem) => {
    setEmails((prev) =>
      prev.map((item) =>
        item.id === email.id ? { ...item, status: 'quarantined' } : item
      )
    );
  };

  // Whitelist / Restore
  const handleWhitelist = (email: EmailItem) => {
    setEmails((prev) =>
      prev.map((item) =>
        item.id === email.id ? { ...item, status: 'whitelisted' } : item
      )
    );
  };

  // Add custom analyzed email
  const handleCustomEmailAnalyzed = (newEmail: EmailItem) => {
    setEmails((prev) => [newEmail, ...prev]);
    setSelectedEmailId(newEmail.id);
    setActiveView('inbox');
    setMobileInboxMode('detail');
    setScans(getRecentScans());
  };

  // Delete an individual scan from localStorage
  const handleDeleteScan = (id: string) => {
    deleteRecentScan(id);
    setScans(getRecentScans());
  };

  // Clear all recent scans from localStorage
  const handleClearAllScans = () => {
    clearAllRecentScans();
    setScans([]);
  };

  // Reopen and inspect previous scan from Recent Scans
  const handleInspectScan = (scan: LocalScanRecord) => {
    const inspectedEmail: EmailItem = {
      id: scan.id,
      sender: scan.sender || 'unknown@sender.com',
      receiver: scan.receiver || user.email,
      date: new Date(scan.createdAt).toLocaleDateString(),
      subject: scan.subject || '(Untitled Email)',
      body: scan.fullEmailBody || scan.summary || '',
      urls: scan.fullEmailBody ? (scan.fullEmailBody.match(/(https?:\/\/[^\s]+)/g) || []) : [],
      status: 'analyzed',
      result: scan.resultData || {
        isPhishing: scan.riskLevel === 'High' || scan.riskLevel === 'Critical',
        confidenceScore: Number(scan.riskScore) / 100,
        gatAttentionSummary: scan.summary || scan.analysis || 'Analyzed from recent scan history.',
        nodes: [],
        edges: [],
        threatFactors: scan.detectedThreats || [],
        headerAnalysis: {
          spf: scan.riskLevel === 'Low' ? 'PASS' : 'FAIL',
          dkim: scan.riskLevel === 'Low' ? 'PASS' : 'FAIL',
          dmarc: scan.riskLevel === 'Low' ? 'PASS' : 'FAIL',
          senderDomainMatch: scan.riskLevel === 'Low',
          returnPathAnomaly: scan.riskLevel !== 'Low',
        },
        detectedUrls: [],
        explanation: scan.summary || scan.analysis || '',
        remediationAdvice: Array.isArray(scan.recommendations) ? scan.recommendations : [],
        modelLatencyMs: 3.3,
        distilBertEmbeddingNorm: 13.5,
        gatLayer1Channels: 256,
        gatLayer2Output: [0.5, 0.5],
      },
    };

    setEmails((prev) => [inspectedEmail, ...prev.filter((e) => e.id !== inspectedEmail.id)]);
    setSelectedEmailId(inspectedEmail.id);
    setActiveView('inbox');
    setMobileInboxMode('detail');
  };

  // Sync / Refresh Gmail Simulation
  const handleRefreshGmail = () => {
    setIsRefreshingGmail(true);
    setTimeout(() => {
      const newInbound: EmailItem = {
        id: `gmail-sync-${Date.now()}`,
        sender: 'security@cloud-infra-service.xyz',
        senderName: 'Cloud Admin Notice',
        receiver: user.email,
        date: 'Just Now',
        subject: 'ACTION REQUIRED: Security certificate expiration on production cluster',
        body: `Dear Security Administrator,\n\nThe SSL/TLS certificate for your cluster endpoint will expire in 6 hours. To prevent immediate service disruption and API failure, update your private credentials immediately:\n\nhttps://cloud-infra-service.xyz/cert/renew-sso\n\nSecurity Operations Center`,
        urls: ['https://cloud-infra-service.xyz/cert/renew-sso'],
        unread: true,
        sourceDataset: 'Gmail_Live',
        status: 'pending',
      };

      setEmails((prev) => [newInbound, ...prev]);
      setSelectedEmailId(newInbound.id);
      setIsRefreshingGmail(false);
      
      // Auto trigger GAT detection for inbound
      handleScanEmail(newInbound);
    }, 900);
  };

  const handleSelectEmailMobile = (email: EmailItem) => {
    setSelectedEmailId(email.id);
    if (email.unread) {
      setEmails((prev) => prev.map((item) => (item.id === email.id ? { ...item, unread: false } : item)));
    }
    setMobileInboxMode('detail');
  };

  return (
    <div className="h-screen w-screen bg-[#0B0B0D] text-slate-300 font-sans flex flex-col overflow-hidden select-none">
      {/* Top Header */}
      <Header
        onOpenDashboard={() => setActiveView('dashboard')}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onOpenBenchmark={() => setActiveView('research')}
        onOpenTrainer={() => setActiveView('trainer')}
        onOpenHistory={() => setActiveView('history')}
        onRefreshGmail={handleRefreshGmail}
        isRefreshing={isRefreshingGmail}
        activeView={activeView}
        threatCount={emailCounts.phishing}
        isMobileMenuOpen={isMobileNavOpen}
        onToggleMobileMenu={() => setIsMobileNavOpen((prev) => !prev)}
        user={user}
      />

      {/* Main Body */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Desktop Navigation Sidebar */}
        <div className="hidden md:flex shrink-0">
          <Sidebar
            activeView={activeView}
            setActiveView={setActiveView}
            emailCounts={emailCounts}
            scanHistoryCount={scans.length}
            user={user}
          />
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsMobileNavOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] h-full bg-[#0E0E11] z-10 flex flex-col shadow-2xl">
              <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                <span className="font-bold text-white text-sm">Navigation Menu</span>
                <button 
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar
                  activeView={activeView}
                  setActiveView={setActiveView}
                  emailCounts={emailCounts}
                  scanHistoryCount={scans.length}
                  user={user}
                  onCloseMobileNav={() => setIsMobileNavOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Command Center */}
        {activeView === 'dashboard' && (
          <DashboardView
            emails={emails}
            scans={scans}
            userEmail={user.email}
            userName={user.full_name}
            emailCounts={emailCounts}
            onNavigate={(view) => setActiveView(view)}
            onSelectEmail={(email) => {
              setSelectedEmailId(email.id);
              setActiveView('inbox');
              setMobileInboxMode('detail');
            }}
            onScanEmail={handleScanEmail}
            onQuarantineEmail={handleQuarantine}
            onOpenSandbox={(url) => setSandboxUrl(url)}
            onOpenCustomModal={() => setIsCustomModalOpen(true)}
            onRefreshGmail={handleRefreshGmail}
            onInspectScan={handleInspectScan}
            isRefreshing={isRefreshingGmail}
            isScanning={isScanning}
          />
        )}

        {/* Recent Scans View (Browser LocalStorage) */}
        {activeView === 'history' && (
          <ScanHistoryView
            scans={scans}
            onRefresh={() => setScans(getRecentScans())}
            onDeleteScan={handleDeleteScan}
            onClearAll={handleClearAllScans}
            onInspectScan={handleInspectScan}
          />
        )}

        {/* View Content Area: Inbox */}
        {activeView === 'inbox' && (
          <div className="flex-1 flex overflow-hidden h-full">
            <div className={`${mobileInboxMode === 'detail' ? 'hidden md:flex' : 'flex'} w-full md:w-auto h-full shrink-0`}>
              <EmailStream
                emails={emails}
                selectedEmailId={selectedEmailId}
                onSelectEmail={handleSelectEmailMobile}
                onScanEmail={handleScanEmail}
                isScanning={isScanning}
                className="w-full md:w-80 lg:w-[380px]"
              />
            </div>

            <div className={`${mobileInboxMode === 'list' ? 'hidden md:flex' : 'flex'} flex-1 h-full overflow-hidden`}>
              {selectedEmail ? (
                <EmailDetail
                  email={selectedEmail}
                  onQuarantine={handleQuarantine}
                  onWhitelist={handleWhitelist}
                  onOpenSandbox={(url) => setSandboxUrl(url)}
                  onScanEmail={handleScanEmail}
                  isScanning={isScanning}
                  onBackToList={() => setMobileInboxMode('list')}
                />
              ) : (
                <div className="flex-1 bg-[#0F0F12] flex items-center justify-center text-slate-400 text-xs p-4 text-center">
                  Select an email from the stream to view PhishSense AI analysis.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Phishing Trainer & Scam Quiz Lab */}
        {activeView === 'trainer' && <PhishingTrainerLab />}

        {/* GAT Graph Inspector Full View */}
        {activeView === 'graph' && selectedEmail && (
          <div className="flex-1 bg-[#0F0F12] p-4 md:p-8 overflow-y-auto space-y-6 max-w-5xl mx-auto w-full">
            <div className="bg-[#121217] border border-slate-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white">Full GAT Graph Inspector</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5 break-all">Inspecting: {selectedEmail.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded font-mono text-xs font-bold ${
                  selectedEmail.result?.isPhishing ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {selectedEmail.result?.isPhishing ? 'Phishing Threat' : 'Legitimate Safe'}
                </span>
              </div>
            </div>

            {selectedEmail.result ? (
              <GraphVisualizer
                nodes={selectedEmail.result.nodes}
                edges={selectedEmail.result.edges}
                isPhishing={selectedEmail.result.isPhishing}
                confidenceScore={selectedEmail.result.confidenceScore}
                gatAttentionSummary={selectedEmail.result.gatAttentionSummary}
              />
            ) : (
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <button
                  onClick={() => handleScanEmail(selectedEmail)}
                  className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
                >
                  Run GAT Analysis to build Graph
                </button>
              </div>
            )}
          </div>
        )}

        {/* Batch Threat Scanner */}
        {activeView === 'batch' && (
          <div className="flex-1 bg-[#0F0F12] p-4 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full space-y-6">
            <div className="bg-[#121217] border border-slate-800 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white">Batch Threat Pipeline</h1>
                <p className="text-xs text-slate-400">Scan large sets of inbox emails with parallel DistilBERT batches</p>
              </div>
              <button
                onClick={() => setIsBatchModalOpen(true)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow-lg shadow-emerald-500/20 shrink-0 cursor-pointer"
              >
                Launch Batch Scanner
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400">Total In-Memory Emails</span>
                <div className="text-2xl font-bold text-white font-mono mt-1">{emails.length}</div>
              </div>
              <div className="p-4 bg-rose-950/20 border border-rose-800/40 rounded-xl">
                <span className="text-xs text-rose-300">Flagged Threats</span>
                <div className="text-2xl font-bold text-rose-400 font-mono mt-1">{emailCounts.phishing}</div>
              </div>
              <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl">
                <span className="text-xs text-emerald-300">Verified Safe</span>
                <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">{emailCounts.clean}</div>
              </div>
            </div>
          </div>
        )}

        {/* Link Sandbox View */}
        {activeView === 'sandbox' && (
          <div className="flex-1 bg-[#0F0F12] p-4 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full space-y-6">
            <div className="bg-[#121217] border border-slate-800 rounded-xl p-5 sm:p-6">
              <h1 className="text-base sm:text-lg font-bold text-white">Link Detonation Sandbox</h1>
              <p className="text-xs text-slate-400 mt-1">Directly detonate suspicious URLs from emails in a safe isolated environment.</p>
            </div>
            {selectedEmail.urls.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-300">URLs found in current email ({selectedEmail.subject}):</div>
                {selectedEmail.urls.map((u, i) => (
                  <div key={i} className="p-3.5 sm:p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs font-mono text-slate-200 break-all">{u}</span>
                    <button
                      onClick={() => setSandboxUrl(u)}
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shrink-0 cursor-pointer"
                    >
                      Detonate Sandbox
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-900/40 border border-slate-800 rounded-xl">
                No URLs detected in selected email. Select another email or enter a custom URL.
              </div>
            )}
          </div>
        )}

        {/* Research Paper Benchmark View */}
        {activeView === 'research' && <ResearchBenchmarkView />}

        {/* Quarantine Vault View */}
        {activeView === 'quarantine' && (
          <div className="flex-1 bg-[#0F0F12] p-4 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full space-y-6">
            <div className="bg-[#121217] border border-slate-800 rounded-xl p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                <h1 className="text-base sm:text-lg font-bold text-white">Quarantine Vault</h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">Threats isolated from user inbox to prevent unauthorized credential harvesting or malware execution.</p>
            </div>

            <div className="space-y-3">
              {emails.filter((e) => e.status === 'quarantined').length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-400 bg-slate-900/30 border border-slate-800 rounded-xl">
                  No emails currently quarantined. When a phishing email is detected, click "Quarantine Threat" to isolate it here.
                </div>
              ) : (
                emails.filter((e) => e.status === 'quarantined').map((item) => (
                  <div key={item.id} className="p-4 bg-slate-900/70 border border-rose-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold text-white">{item.subject}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">From: {item.sender} • {item.date}</div>
                    </div>
                    <button
                      onClick={() => handleWhitelist(item)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors shrink-0 cursor-pointer"
                    >
                      Restore to Inbox
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* MicroSaaS Settings & YARA Rules */}
        {activeView === 'rules' && <MicroSaasSettingsModal />}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden bg-[#0E0E11] border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around z-30 shrink-0 select-none">
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] transition-colors ${
            activeView === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveView('history')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] transition-colors relative ${
            activeView === 'history' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Recent</span>
          {scans.length > 0 && (
            <span className="absolute -top-1 right-2 bg-emerald-500 text-slate-950 text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
              {scans.length}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveView('inbox');
            setMobileInboxMode('list');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] transition-colors relative ${
            activeView === 'inbox' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Inbox</span>
          {emailCounts.total > 0 && (
            <span className="absolute -top-1 right-2 bg-emerald-500 text-slate-950 text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
              {emailCounts.total}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveView('quarantine')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] transition-colors relative ${
            activeView === 'quarantine' ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Vault</span>
          {emailCounts.quarantined > 0 && (
            <span className="absolute -top-1 right-2 bg-rose-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
              {emailCounts.quarantined}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveView('trainer')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] transition-colors ${
            activeView === 'trainer' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Quiz Lab</span>
        </button>
      </nav>

      {/* Desktop Footer Status Bar */}
      <footer className="hidden md:flex h-8 bg-[#0B0B0D] border-t border-slate-800/60 items-center justify-between px-6 select-none z-20 shrink-0">
        <div className="flex items-center gap-4 text-[10px] text-slate-400 uppercase tracking-tight font-mono">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Scan Engine: Active (Node.js + Gemini API)
          </span>
          <span>•</span>
          <span>Storage: Browser LocalStorage ({scans.length} records)</span>
          <span>•</span>
          <span>PhishSense AI Mini-Project Edition</span>
        </div>
        <div className="text-[10px] text-slate-400 font-mono">
          PhishSense AI &copy; 2026 • Enterprise Inbox Threat Defense
        </div>
      </footer>

      {/* Modals */}
      <CustomEmailModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onEmailAnalyzed={handleCustomEmailAnalyzed}
        userEmail={user.email}
      />

      <BatchScannerModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        emails={emails}
        onBatchComplete={(scanned) => {
          setEmails(scanned);
          setIsBatchModalOpen(false);
          setScans(getRecentScans());
        }}
      />

      {sandboxUrl && (
        <SandboxModal
          isOpen={!!sandboxUrl}
          onClose={() => setSandboxUrl(null)}
          targetUrl={sandboxUrl}
        />
      )}
    </div>
  );
}
