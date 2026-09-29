import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import { UserProfile, ScanRecord } from '../types';

// Environment variables for Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseUrl.includes('xyzcompany')
);

// Fallback dummy profile for development when Supabase project is not yet linked
export const FALLBACK_USER: UserProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'franklin2021@gmail.com',
  full_name: 'Franklin CyberOps',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Supabase client instance
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Initiates Google OAuth sign-in flow via Supabase Auth
 */
export async function signInWithGoogle(): Promise<{ error: Error | null; url?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return {
      error: new Error(
        'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables.'
      ),
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { error };
    }

    if (data?.url) {
      window.location.href = data.url;
    }

    return { error: null, url: data?.url };
  } catch (err: any) {
    return { error: err };
  }
}

/**
 * Signs out the active user session
 */
export async function signOut(): Promise<{ error: Error | null }> {
  if (!supabase) {
    return { error: null };
  }
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (err: any) {
    return { error: err };
  }
}

/**
 * Retrieves the current Supabase session
 */
export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (err) {
    console.warn('Error fetching Supabase session:', err);
    return null;
  }
}

/**
 * Retrieves the current Supabase access token for API requests
 */
export async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session?.access_token || null;
}

/**
 * Fetches user profile from Supabase profiles table
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) return FALLBACK_USER;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Error fetching profile from Supabase:', error);
      return null;
    }
    return data as UserProfile;
  } catch (err) {
    console.warn('fetchUserProfile error:', err);
    return null;
  }
}

/**
 * Fetches all scans for the authenticated user from Supabase
 */
export async function fetchUserScans(userId: string, limit = 50): Promise<ScanRecord[]> {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.warn('Error fetching scans from Supabase:', error);
      return [];
    }
    return (data || []) as ScanRecord[];
  } catch (err) {
    console.warn('fetchUserScans error:', err);
    return [];
  }
}

/**
 * Deletes a scan record from Supabase
 */
export async function deleteUserScan(scanId: string): Promise<boolean> {
  if (!supabase) return true;
  try {
    const { error } = await supabase
      .from('scans')
      .delete()
      .eq('id', scanId);

    if (error) {
      console.error('Error deleting scan:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('deleteUserScan error:', err);
    return false;
  }
}
