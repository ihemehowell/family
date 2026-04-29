'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, LogOut, Menu, Moon, Sun, Users, X, Edit3, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useTheme } from '@/app/context/ThemeContext'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [initials, setInitials] = useState('U')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) return

      const { data: profile } = await supabase
        .from('family_members')
        .select('full_name, photo_url')
        .eq('id', user.id)
        .single()

      if (profile?.photo_url) {
        setAvatarUrl(profile.photo_url)
      }

      if (profile?.full_name) {
        const parts = profile.full_name.trim().split(' ')
        setInitials(parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase() : parts[0][0].toUpperCase())
      }
    }

    getProfile()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const closeMenus = () => {
    setMobileMenuOpen(false)
    setProfileMenuOpen(false)
  }

  const linkClass = (href: string) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${pathname === href ? 'bg-teal-50 text-green-200 shadow-sm' : 'text-slate-700 hover:bg-white hover:text-teal-700'}`

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-6">
      <nav aria-label="Main navigation" className="app-surface relative mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3 md:px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-700/20">
            <LayoutDashboard size={18} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Family</p>
            <p className="text-sm font-semibold text-slate-950">Okorocha Dashboard</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/dashboard" aria-current={pathname === '/dashboard' ? 'page' : undefined} className={linkClass('/dashboard')}>
            Profile
          </Link>
          <Link href="/table" aria-current={pathname === '/table' ? 'page' : undefined} className={linkClass('/table')}>
            Family Members
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white text-slate-700 transition hover:bg-slate-50 md:flex"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen((value) => !value)}
              aria-label="Open profile menu"
              className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/80 bg-slate-100 text-sm font-semibold text-slate-700 transition hover:ring-4 hover:ring-teal-100"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </button>

            {profileMenuOpen && (
              <div className="app-fade-in absolute right-0 mt-3 w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <Link
                  href="/profile"
                  onClick={closeMenus}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <Edit3 size={16} /> Edit profile
                </Link>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-rose-600 transition hover:bg-rose-50"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label="Toggle mobile navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="app-fade-in absolute left-0 top-full mt-3 w-full rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-2xl md:hidden">
            <Link href="/dashboard" aria-current={pathname === '/dashboard' ? 'page' : undefined} onClick={closeMenus} className="flex items-center gap-2 rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50">
              <LayoutDashboard size={18} /> Profile
            </Link>
            <Link href="/table" aria-current={pathname === '/table' ? 'page' : undefined} onClick={closeMenus} className="flex items-center gap-2 rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50">
              <Users size={18} /> Family Members
            </Link>
            <Link href="/profile" onClick={closeMenus} className="flex items-center gap-2 rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50">
              <Edit3 size={18} /> Edit Profile <ChevronRight size={16} className="ml-auto text-slate-400" />
            </Link>
            <button
              onClick={() => {
                toggleTheme()
                closeMenus()
              }}
              className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-slate-700 transition hover:bg-slate-50"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  )
}