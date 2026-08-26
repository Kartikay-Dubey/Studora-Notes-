import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Browser-side Supabase client.
 * Use this in Client Components ('use client').
 * Creates a new client instance — call once per component or memoize.
 */
export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const url =
    rawUrl && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
      ? rawUrl
      : 'https://placeholder.supabase.co'
  const key = rawKey || 'placeholder-anon-key'

  return createBrowserClient<Database>(url, key)
}
