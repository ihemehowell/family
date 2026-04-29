import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="app-card app-fade-in max-w-lg rounded-[2rem] p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <Search size={28} />
        </div>
        <div className="mt-6 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Page not found</h1>
          <p className="text-slate-600 leading-7">
            The page or member you were looking for no longer exists or cannot be opened.
          </p>
        </div>
        <Link href="/dashboard" className="app-button-primary mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold">
          <Home size={16} /> Back to dashboard
        </Link>
      </div>
    </main>
  )
}