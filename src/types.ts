export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ScanRecord {
  id: string;
  user_id?: string;
  email_content?: string;
  subject: string;
  sender: string;
  receiver?: string;
  risk_score: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  analysis?: string;
  summary?: string;
  detected_threats?: any[];
  indicators?: any[];
  recommendations?: any;
  created_at: string;
}

export interface LocalScanRecord {
  id: string;
  createdAt: string;
  subject: string;
  sender: string;
  receiver?: string;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  analysis?: string;
  detectedThreats: any[];
  indicators: any[];
  recommendations: string[];
  fullEmailBody?: string;
  resultData?: PhishingAnalysisResult;
}

export interface NormalizedAnalysisResponse {
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  analysis: string;
  detectedThreats: any[];
  indicators: any[];
  recommendations: string;
  confidenceScore?: number;
  isPhishing?: boolean;
  gatAttentionSummary?: string;
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  headerAnalysis?: HeaderAnalysis;
  detectedUrls?: any[];
  modelLatencyMs?: number;
}

export interface EmailItem {
  id: string;
  sender: string;
  senderName?: string;
  receiver: string;
  date: string;
  subject: string;
  body: string;
  urls: string[];
  unread?: boolean;
  sourceDataset?: 'CEAS_08' | 'Nazario' | 'Gmail_Live' | 'Custom';
  status: 'pending' | 'scanning' | 'analyzed' | 'quarantined' | 'whitelisted';
  result?: PhishingAnalysisResult;
}

export interface GraphNode {
  id: string;
  label: string;
  index: number;
  tokenVectorDim: number;
  attentionScore: number; // 0.0 to 1.0 (from GAT layer)
  threatWeight: number; // 0.0 to 1.0
  category: 'keyword' | 'url' | 'urgency' | 'salutation' | 'entity' | 'normal' | 'call_to_action';
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number; // GAT attention coefficient α_ij
  type: 'sequential' | 'discontinuous_semantic' | 'header_to_body';
}

export interface ThreatFactor {
  title: string;
  type: 'urgency' | 'spoofing' | 'url_anomaly' | 'authority_mimicry' | 'discontinuous_pattern' | 'credential_harvesting';
  severity: 'high' | 'medium' | 'low' | 'info';
  description: string;
  matchedTokens: string[];
}

export interface HeaderAnalysis {
  spf: 'PASS' | 'FAIL' | 'SOFTFAIL' | 'NONE';
  dkim: 'PASS' | 'FAIL' | 'NONE';
  dmarc: 'PASS' | 'FAIL' | 'QUARANTINE' | 'NONE';
  senderDomainMatch: boolean;
  returnPathAnomaly: boolean;
  origIpGeo?: string;
}

export interface PhishingAnalysisResult {
  isPhishing: boolean;
  confidenceScore: number; // 0.0 to 1.0 (Phishing probability)
  gatAttentionSummary: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  threatFactors: ThreatFactor[];
  headerAnalysis: HeaderAnalysis;
  detectedUrls: {
    url: string;
    riskScore: number;
    flagged: boolean;
    domain: string;
    reason: string;
  }[];
  explanation: string;
  remediationAdvice: string[];
  modelLatencyMs: number;
  distilBertEmbeddingNorm: number;
  gatLayer1Channels: number;
  gatLayer2Output: [number, number]; // [legit_prob, phishing_prob]
}

export interface BenchmarkMetrics {
  dataset: string;
  totalSamples: number;
  nonPhishingCount: number;
  phishingCount: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  trainingTimeSec: number;
  textToGraphTimeSec: number;
  confusionMatrix: {
    trueNegative: number;
    falsePositive: number;
    falseNegative: number;
    truePositive: number;
  };
}

export interface ModelComparisonItem {
  model: string;
  loadTimeSec: number;
  inferenceTimeMs: number;
  parameters: string;
  efficiencyRating: string;
}
