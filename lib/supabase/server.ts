import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const store = await cookies()
          return store.get(name)?.value
        },
        async set(name: string, value: string, options: any) {
          const store = await cookies()
          try {
            store.set({ name, value, ...options })
          } catch {
            // Server components cannot set cookies
          }
        },
        async remove(name: string, options: any) {
          const store = await cookies()
          try {
            store.set({ name, value: '', ...options, maxAge: 0 })
          } catch {
            // ignore
          }
        },
      },
    }
  )
}
