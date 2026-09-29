import React, { useState } from 'react';
import { HelpCircle, X, Search, BookOpen, Shield, Mail, Key, Network } from 'lucide-react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GlossaryEntry {
  term: string;
  fullName?: string;
  category: 'Security' | 'AI & Machine Learning' | 'Email Standards';
  definition: string;
  analogy: string;
  badgeColor: string;
}

const GLOSSARY_ITEMS: GlossaryEntry[] = [
  {
    term: "SPF",
    fullName: "Sender Policy Framework",
    category: "Email Standards",
    definition: "An email authentication protocol that lists the authorized mail servers permitted to send email on behalf of a specific domain.",
    analogy: "Like a company publishing an official list of delivery drivers who are allowed to wear their company uniform.",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  },
  {
    term: "DKIM",
    fullName: "DomainKeys Identified Mail",
    category: "Email Standards",
    definition: "A cryptographic signature attached to an email that proves the email was not altered or tampered with in transit.",
    analogy: "Like an unbroken wax seal stamped on an envelope that proves nobody opened or edited the letter along the way.",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
  },
  {
    term: "DMARC",
    fullName: "Domain-based Message Authentication, Reporting & Conformance",
    category: "Email Standards",
    definition: "A policy that tells receiving servers what to do (e.g. reject or quarantine) if an incoming email fails both SPF and DKIM checks.",
    analogy: "Like a rulebook given to building security: 'If someone arrives without an official badge and wax seal, turn them away immediately.'",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  },
  {
    term: "GNN (Graph Neural Network)",
    fullName: "Graph Neural Network",
    category: "AI & Machine Learning",
    definition: "An advanced type of artificial intelligence designed to analyze relationships and connections between pieces of data, rather than treating them as isolated items.",
    analogy: "Like a detective connecting clues with red string on a corkboard to see how all the pieces of a crime fit together.",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  {
    term: "GAT (Graph Attention Network)",
    fullName: "Graph Attention Network",
    category: "AI & Machine Learning",
    definition: "A special GNN layer that calculates 'attention coefficients'—meaning it learns which specific connections between words are the most dangerous and deserves maximum focus.",
    analogy: "Like a spotlight shining directly on the suspicious relationship between 'Act Now' and a weird login link.",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  {
    term: "DistilBERT",
    fullName: "Distilled Bidirectional Encoder Representations from Transformers",
    category: "AI & Machine Learning",
    definition: "A fast, lightweight language model trained on millions of sentences that understands the deep semantic meaning and human emotion behind text.",
    analogy: "Like a speed-reader who instantly understands the tone and subtle intention behind every sentence in an email.",
    badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20"
  },
  {
    term: "Sandbox Detonation",
    fullName: "Isolated Link Detonation",
    category: "Security",
    definition: "Opening a suspicious website inside an isolated, disposable browser container so that even if it carries malware or scams, it cannot touch your computer.",
    analogy: "Like opening a suspicious package inside an explosion-proof glass chamber with robot arms.",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  },
  {
    term: "Credential Harvesting",
    fullName: "Password & Login Theft",
    category: "Security",
    definition: "A phishing tactic where scammers create a copycat login screen (like a fake Microsoft or Google login) to trick you into typing your password.",
    analogy: "Like a burglar placing a fake cardboard ATM over a real one to copy your PIN code when you type it.",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  },
  {
    term: "CEO Whaling (Business Email Compromise)",
    fullName: "Executive Impersonation",
    category: "Security",
    definition: "A targeted phishing attack where a criminal pretends to be a senior company executive asking an employee for urgent wire transfers or gift cards.",
    analogy: "Like a scammer wearing a disguise pretending to be your company's CEO and whispering 'Quick, transfer money now and don't tell anyone.'",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  },
  {
    term: "Quarantine Vault",
    fullName: "Threat Isolation Vault",
    category: "Security",
    definition: "A secure holding area that isolates dangerous emails away from your active inbox so you cannot accidentally click malicious links.",
    analogy: "Like putting a hazardous material behind a locked glass barrier where it can't harm anyone.",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  }
];

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const filtered = GLOSSARY_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const q = search.toLowerCase();
    const matchesSearch = 
      item.term.toLowerCase().includes(q) ||
      (item.fullName && item.fullName.toLowerCase().includes(q)) ||
      item.definition.toLowerCase().includes(q) ||
      item.analogy.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121217] border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0E0E11]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Plain English Cybersecurity Glossary</h2>
              <p className="text-[11px] text-slate-400">Easy everyday definitions and analogies for every technical term</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-slate-800 bg-[#0F0F12] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search terms, acronyms, or analogies (e.g. SPF, GNN, Sandbox)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#16161D] border border-slate-700/80 rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['All', 'Email Standards', 'AI & Machine Learning', 'Security'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Glossary List */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-tight">{item.term}</span>
                    {item.fullName && (
                      <span className="text-xs text-slate-400 font-mono">({item.fullName})</span>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${item.badgeColor}`}>
                    {item.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.definition}
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2 text-xs text-amber-300/90">
                  <span className="font-bold text-amber-400 shrink-0">💡 Everyday Analogy:</span>
                  <span className="leading-relaxed">{item.analogy}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching terms found. Try searching for "SPF", "GNN", or "Sandbox".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0E0E11] flex items-center justify-between text-xs text-slate-400">
          <span>100% Plain English • No Cybersecurity Degree Required</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
