// app/share/[token]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Eye, EyeOff, Loader2, LogIn, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

export default function ShareableLinkLoginPage() {
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [linkValid, setLinkValid] = useState(false)

  useEffect(() => {
    validateLink()
  }, [token])

  const validateLink = async () => {
    try {
      const response = await fetch(`/api/shareable-links?token=${token}`)
      
      if (response.ok) {
        const data = await response.json()
        setEmail(data.email)
        setLinkValid(true)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Invalid or expired link')
        setLinkValid(false)
        setTimeout(() => router.push('/login'), 2000)
      }
    } catch (err) {
      console.error('Error validating link:', err)
      toast.error('Failed to validate link')
      setLinkValid(false)
    } finally {
      setValidating(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error, data } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    })
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

    // Mark link as used
    await supabase
      .from('shareable_links')
      .update({ used: true })
      .eq('token', token)

    toast.success('Login successful')
    router.push('/dashboard')
  }

  if (validating) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <p className="text-slate-600">Validating link...</p>
        </div>
      </main>
    )
  }

  if (!linkValid) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Redirecting to login...</p>
        </div>
      </main>
    )
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
                <ShieldCheck className="h-5 w-5" />
                Family
              </Link>
              <div className="space-y-6">
                <h1 className="text-4xl font-bold leading-tight text-white">
                  Secure Access Link
                </h1>
                <p className="text-base font-medium text-white/60">
                  You've been invited to join via a shareable link. Enter your password to continue.
                </p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-white/50">
              <p>© 2026 Family. All rights reserved.</p>
            </div>
          </aside>

          <div className="flex flex-col items-center justify-center bg-white px-8 py-8 md:px-10 md:py-10">
            <div className="w-full max-w-sm space-y-8">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-slate-900">Complete Sign In</h2>
                <p className="text-sm text-slate-600">
                  Account: <span className="font-medium">{email}</span>
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm placeholder-slate-400 outline-none transition-colors hover:border-slate-300 focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500/20 disabled:opacity-50"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full rounded-lg bg-teal-500 py-2.5 text-sm font-medium text-white outline-none transition-colors hover:bg-teal-600 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 inline-block h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 inline-block h-4 w-4" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-slate-500">Need help?</span>
                </div>
              </div>

              <div className="space-y-2 text-center text-sm">
                <Link href="/login" className="block text-teal-600 hover:text-teal-700 font-medium">
                  Sign in with email instead
                </Link>
                <Link href="/forgot-password" className="block text-slate-600 hover:text-slate-700">
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
