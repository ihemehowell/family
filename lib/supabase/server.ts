import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

type CookieStore = Awaited<ReturnType<typeof cookies>>
type CookieOptions = Parameters<CookieStore['set']>[0] extends { name: string; value: string }
  ? Omit<Parameters<CookieStore['set']>[0], 'name' | 'value'>
  : never

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
        async set(name: string, value: string, options: CookieOptions) {
          const store = await cookies()
          try {
            store.set({ name, value, ...options })
          } catch {
            // Server components cannot set cookies
          }
        },
        async remove(name: string, options: CookieOptions) {
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
