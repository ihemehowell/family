import Link from 'next/link'
import { Lock, Home } from 'lucide-react'

export default function NotAuthorized() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 text-center">
      <div className="app-card app-fade-in max-w-md rounded-[2rem] p-8 space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <Lock size={28} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Access denied</h1>
          <p className="text-slate-600 leading-7">This signup page is private and requires a valid invite token.</p>
        </div>
        <Link href="/login" className="app-button-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold">
          <Home size={16} /> Back to login
        </Link>
      </div>
    </div>
  );
}
