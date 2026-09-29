import { EmailItem, PhishingAnalysisResult, BenchmarkMetrics } from '../types';
import { saveRecentScan, getRecentScans, deleteRecentScan, clearAllRecentScans, LocalScanRecord } from './scanStorage';

/**
 * Executes phishing analysis via POST /api/analyze and automatically records to Recent Scans (localStorage)
 */
export async function analyzeEmail(email: Partial<EmailItem>): Promise<PhishingAnalysisResult & { id?: string; summary?: string; success?: boolean }> {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: email.sender,
        receiver: email.receiver,
        date: email.date,
        subject: email.subject,
        body: email.body,
        urls: email.urls,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const data = await res.json();

    // Automatically save to local scan history
    try {
      saveRecentScan({
        id: data.id,
        createdAt: data.createdAt,
        subject: email.subject || '(Untitled Email)',
        sender: email.sender || 'unknown@sender.com',
        receiver: email.receiver || 'franklin2021@gmail.com',
        riskScore: data.riskScore,
        riskLevel: data.riskLevel,
        summary: data.summary || data.analysis || 'Analysis completed.',
        analysis: data.analysis || data.summary || '',
        detectedThreats: data.detectedThreats || [],
        indicators: data.indicators || [],
        recommendations: data.recommendations || [],
        fullEmailBody: email.body,
        resultData: data,
      });
    } catch (saveErr) {
      console.warn('PhishSense: Could not save scan to localStorage:', saveErr);
    }

    return data;
  } catch (error: any) {
    console.error('Error analyzing email:', error);
    throw error;
  }
}

/**
 * Detect Email Phishing (backward compatible alias that routes to analyzeEmail)
 */
export async function detectEmailPhishing(email: Partial<EmailItem>): Promise<PhishingAnalysisResult> {
  return analyzeEmail(email);
}

export async function getBenchmarkStats(): Promise<{ ceas08: BenchmarkMetrics; nazario: BenchmarkMetrics; modelComplexity: any[] }> {
  const res = await fetch('/api/benchmark-stats');
  if (!res.ok) {
    throw new Error('Failed to fetch benchmark stats');
  }
  return res.json();
}

export async function runBatchScan(emails: EmailItem[]): Promise<{
  totalScanned: number;
  phishingCount: number;
  legitimateCount: number;
  avgInferenceTimeMs: number;
  results: Array<{ id: string; isPhishing: boolean; confidenceScore: number; inferenceTimeMs: number }>;
}> {
  const res = await fetch('/api/batch-scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emails }),
  });
  if (!res.ok) {
    throw new Error('Batch scan failed');
  }
  return res.json();
}

export async function analyzeSandboxUrl(url: string): Promise<{
  url: string;
  domain: string;
  isHttps: boolean;
  riskScore: number;
  isFlagged: boolean;
  tlsStatus: string;
  dnsRecords: { aRecord: string; asn: string; country: string };
  sandboxSafetyVerdict: string;
}> {
  const res = await fetch('/api/sandbox-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) {
    throw new Error('Sandbox analysis failed');
  }
  return res.json();
}
