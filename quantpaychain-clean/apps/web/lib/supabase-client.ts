import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

let supabaseInstance: SupabaseClient | null = null;

/**
 * Get Supabase client instance (singleton)
 * Only initializes in browser to avoid indexedDB errors during build
 */
export function getSupabaseClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    // During SSR/build, return a mock client that doesn't use indexedDB
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storage: undefined,
      },
    });
  }
  
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  
  return supabaseInstance;
}

// Export as default for backward compatibility
export const supabase = getSupabaseClient();
