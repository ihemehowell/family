'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Home, Loader2, LogIn, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error, data } = await supabase.auth.signInWithPassword({ email, password, options: { remember: rememberMe } })
    setLoading(false)

    if (error) {
      toast.error(error.message)
      return
    }

    if (!data.user?.email_confirmed_at) {
      toast.warning('Please verify your email before logging in')
      router.push('/verify-email')
      return
    }

    toast.success('Login successful')
    router.push('/dashboard')
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <section className="app-surface relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-[2rem]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-12 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-amber-400/15 blur-3xl" />
        </div>

        <div className="relative grid w-full lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="flex flex-col justify-between bg-slate-950 px-8 py-8 text-white md:px-10 md:py-10">
            <div className="space-y-8">
              <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/75 hover:text-white">
                <Home size={18} /> Back home
              </Link>

              <div className="space-y-4 max-w-md">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/85">
                  <ShieldCheck size={16} className="text-teal-300" /> Protected family space
                </div>
                <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                  Sign in with a calmer, cleaner interface.
                </h1>
                <p className="text-base leading-7 text-white/70 md:text-lg">
                  Access dashboards, profile editing, and the family table from one polished entry point.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-white/55">Security</p>
                <p className="mt-2 text-xl font-semibold">Invite-only access</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-white/55">Actions</p>
                <p className="mt-2 text-xl font-semibold">Password reset ready</p>
              </div>
            </div>
          </aside>

          <div className="flex items-center justify-center px-6 py-10 md:px-10">
            <div className="app-card w-full max-w-xl rounded-[2rem] p-6 md:p-10">
              <div className="mb-8 space-y-2 text-center">
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <LogIn size={24} />
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Welcome back</h2>
                <p className="app-muted">Log in to continue managing the family dashboard.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="app-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                      className="app-input pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 hover:bg-slate-100"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
                  <label className="inline-flex items-center gap-2 text-slate-600">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-500" />
                    Remember me
                  </label>
                  <span className="text-slate-500">Secure access for members only.</span>
                  <Link href="/forgot-password" className="font-medium text-teal-700 hover:text-teal-800">
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="app-button-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm text-slate-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-semibold text-teal-700 hover:text-teal-800">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}