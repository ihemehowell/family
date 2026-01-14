'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { LogOut, Users, Home, Settings, Menu, X } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Left: Logo / Links */}
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="hidden md:flex items-center gap-2 text-gray-800 font-semibold hover:text-blue-600 transition">
          <Home size={20} /> Dashboard
        </Link>

        <Link href="/admin" className="hidden md:flex items-center gap-2 text-gray-800 hover:text-blue-600 transition">
          <Users size={20} /> Family Members
        </Link>

        <Link href="/settings" className="hidden md:flex items-center gap-2 text-gray-800 hover:text-blue-600 transition">
          <Settings size={20} /> Settings
        </Link>
      </div>

      {/* Right: Profile & Hamburger */}
      <div className="flex items-center gap-4">
        {/* Profile avatar */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:ring-2 hover:ring-blue-500 transition"
          >
            {/* You can replace initials with user photo if available */}
            U
          </button>

          {/* Profile dropdown */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border border-gray-200 py-2 flex flex-col">
              <Link
                href="/settings"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                onClick={() => setProfileMenuOpen(false)}
              >
                <Settings size={16} /> Settings
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center gap-2"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md border-t border-gray-200 flex flex-col md:hidden">
          <Link href="/dashboard" className="px-6 py-3 border-b border-gray-100 flex items-center gap-2 hover:bg-gray-50">
            <Home size={18} /> Dashboard
          </Link>
          <Link href="/admin" className="px-6 py-3 border-b border-gray-100 flex items-center gap-2 hover:bg-gray-50">
            <Users size={18} /> Family Members
          </Link>
          <Link href="/settings" className="px-6 py-3 border-b border-gray-100 flex items-center gap-2 hover:bg-gray-50">
            <Settings size={18} /> Settings
          </Link>
          <button
            onClick={logout}
            className="px-6 py-3 text-red-600 flex items-center gap-2 hover:bg-gray-50"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      )}
    </nav>
  )
}
