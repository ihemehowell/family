import Navbar from '@/app/components/Navbar'
import MemberTable from '@/app/components/MemberTable'
import ProtectedRoute from '../components/ProtecteRoute'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function TablePage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen px-4 pb-8 pt-4 md:px-6">
        <Navbar />
        <div className="app-page-shell mt-6">
          <div className="mb-6 space-y-3 px-1">
            <div className="app-breadcrumb text-sm mt-4">
              <Link href="/dashboard" className="font-semibold text-teal-700">Profile</Link>
              <ChevronRight size={14} className="text-slate-400" />
              <span>Family members</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Family members</h1>
            <p className="max-w-2xl text-slate-600">
              Search, sort, and browse the full family directory from a cleaner, easier-to-scan layout.
            </p>
          </div>
          <MemberTable />
        </div>
      </main>
    </ProtectedRoute>
  )
}