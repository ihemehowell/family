import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const store = await cookies()
          return store.getAll().map(({ name, value }) => ({ name, value }))
        },

        async setAll(cookiesToSet) {
          const store = await cookies()
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              store.set({ name, value, ...options })
            })
          } catch {
            // Server components cannot set cookies
          }
        },
      },
    }
  )
}
