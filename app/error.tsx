'use client'

import Link from 'next/link'
import { AlertTriangle, Home, RotateCw } from 'lucide-react'

export default function GlobalError({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="app-card app-fade-in w-full max-w-lg rounded-[2rem] p-8 text-center space-y-6 md:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle size={28} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900">Something went wrong</h1>
          <p className="leading-7 text-slate-600">{error.message || 'Please try again or return to the dashboard.'}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button onClick={() => window.location.reload()} className="app-button-primary inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold">
            <RotateCw size={16} /> Reload
          </button>
          <Link href="/dashboard" className="app-button-secondary inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold">
            <Home size={16} /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
