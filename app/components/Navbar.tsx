'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { LogOut } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-white px-6 py-4 flex justify-between items-center">
      <div className="flex gap-6">
        <Link href="/dashboard" className="font-semibold">Dashboard</Link>
        <Link href="/admin">Family Members</Link>
      </div>

      <button
        onClick={logout}
        className="text-red-600 hover:underline text-sm"
      >
        < LogOut/>
      </button>
    </nav>
  )
}