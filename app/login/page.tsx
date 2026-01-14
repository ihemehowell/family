'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { Home } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) setError(error.message)
    else router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition">
          <Home size={24} /> Family Dashboard
        </Link>
      </nav>

      {/* Login Content */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-tr from-blue-50 to-gray-50 p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 md:p-12 overflow-hidden">
          {/* Optional floating background effect */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-300 rounded-full opacity-20 blur-3xl pointer-events-none"></div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h1>
          <p className="text-gray-500 text-center mb-6">Login to your account</p>

          {error && <div className="text-red-600 text-sm text-center mb-4">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition flex justify-center items-center gap-2"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

            <div className="text-center text-sm text-gray-500 mt-6">
              Don’t have an account?
              <Link
                href="/register"
                className="ml-2 inline-block text-blue-600 font-semibold hover:underline"
              >
                Register
              </Link>
            </div>

          {/* <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="px-2 text-gray-400 text-sm">or</span>
            <hr className="flex-1 border-gray-300" />
          </div> */}

          {/* Optional social login buttons */}
          {/* <div className="flex gap-4 justify-center">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-100 transition">
              Login with Google
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-100 transition">
              Login with GitHub
            </button>
          </div> */}
        </div>
      </div>
    </div>
  )
}
