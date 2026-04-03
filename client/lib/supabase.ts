import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  // @ts-ignore - Prevent multiple instances during Vite HMR causing storage locks
  if (typeof window !== "undefined" && window.__GUIDELY_SUPABASE__) {
    // @ts-ignore
    return window.__GUIDELY_SUPABASE__;
  }
  if (client) return client;

  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    console.warn("Supabase env not set. Connect Supabase MCP and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    return null;
  }

  client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { 
      persistSession: true, 
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  if (typeof window !== "undefined") {
    // @ts-ignore
    window.__GUIDELY_SUPABASE__ = client;
  }

  return client;
}
