import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

/**
 * Server-side Supabase client for use in:
 * - React Server Components
 * - Route Handlers
 * - Server Actions
 *
 * Reads and writes auth cookies via next/headers.
 */
export async function createClient() {
  const cookieStore = await cookies()
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const url =
    rawUrl && (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
      ? rawUrl
      : 'https://placeholder.supabase.co'
  const key = rawKey || 'placeholder-anon-key'

  return createServerClient<Database>(url, key, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — cookies can't be set.
            // This is fine if you have a middleware refreshing user sessions.
          }
        },
      },
    }
  )
}
