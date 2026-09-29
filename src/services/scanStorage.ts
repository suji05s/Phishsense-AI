import { PhishingAnalysisResult } from '../types';

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

const STORAGE_KEY = 'phishsense_recent_scans_v1';
const MAX_SCANS = 20;

/**
 * Safely check if localStorage is accessible
 */
function isStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Load all recent scans from localStorage (sorted newest first)
 */
export function getRecentScans(): LocalScanRecord[] {
  if (!isStorageAvailable()) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.warn('PhishSense: Could not read recent scans from localStorage:', err);
    return [];
  }
}

/**
 * Save a new scan to localStorage (prepends and limits to latest MAX_SCANS)
 */
export function saveRecentScan(scan: Omit<LocalScanRecord, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): LocalScanRecord {
  const newRecord: LocalScanRecord = {
    id: scan.id || `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: scan.createdAt || new Date().toISOString(),
    subject: scan.subject || '(Untitled Email)',
    sender: scan.sender || 'unknown@sender.com',
    receiver: scan.receiver || 'franklin2021@gmail.com',
    riskScore: typeof scan.riskScore === 'number' ? scan.riskScore : 0,
    riskLevel: scan.riskLevel || (scan.riskScore >= 75 ? 'Critical' : scan.riskScore >= 50 ? 'High' : scan.riskScore >= 25 ? 'Medium' : 'Low'),
    summary: scan.summary || scan.analysis || 'Analysis completed.',
    analysis: scan.analysis || scan.summary || '',
    detectedThreats: Array.isArray(scan.detectedThreats) ? scan.detectedThreats : [],
    indicators: Array.isArray(scan.indicators) ? scan.indicators : [],
    recommendations: Array.isArray(scan.recommendations) ? scan.recommendations : (typeof scan.recommendations === 'string' ? (scan.recommendations as string).split('; ') : []),
    fullEmailBody: scan.fullEmailBody || '',
    resultData: scan.resultData,
  };

  if (!isStorageAvailable()) {
    return newRecord;
  }

  try {
    const existing = getRecentScans();
    // Prevent duplicate entries by id
    const filtered = existing.filter((item) => item.id !== newRecord.id);
    const updated = [newRecord, ...filtered].slice(0, MAX_SCANS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('PhishSense: Failed to save scan to localStorage (quota or disabled):', err);
  }

  return newRecord;
}

/**
 * Delete an individual scan by id
 */
export function deleteRecentScan(id: string): boolean {
  if (!isStorageAvailable()) return true;
  try {
    const existing = getRecentScans();
    const updated = existing.filter((item) => item.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.warn('PhishSense: Failed to delete scan from localStorage:', err);
    return false;
  }
}

/**
 * Clear all scan history from localStorage
 */
export function clearAllRecentScans(): boolean {
  if (!isStorageAvailable()) return true;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (err) {
    console.warn('PhishSense: Failed to clear scans from localStorage:', err);
    return false;
  }
}
