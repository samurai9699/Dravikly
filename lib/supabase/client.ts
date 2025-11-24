// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // This will throw a clear error in build logs if missing — no silent crashes
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase credentials missing! Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your Vercel Environment Variables.'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}