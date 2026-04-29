export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Mail, Phone, UserCircle2, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Navbar from '../components/Navbar'
import ProfileActions from '../components/ProfileActions'

type ProfileRecord = {
  full_name?: string | null
  email?: string | null
  photo_url?: string | null
  age?: string | number | null
  family_branch?: string | null
  employment_status?: string | null
  marital_status?: string | null
  graduate_status?: string | null
  location?: string | null
  phone_number?: string | null
  address?: string | null
  created_at?: string | null
}

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('family_members')
    .select('*')
    .eq('id', user.id)
    .single() as { data: ProfileRecord | null }

  const fallbackName = profile?.full_name || 'Unnamed User'

  const stats = [
    { label: 'Profile', value: 'Personal overview' },
    { label: 'Access', value: 'Protected account' },
    { label: 'Status', value: 'Live record' },
    ...(profile?.created_at
      ? [{ label: 'Member Since', value: new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }]
      : []),
  ]

  return (
    <main className="min-h-screen px-4 pb-8 pt-4 md:px-6">
      <Navbar />

      <div className="app-page-shell  grid gap-6 px-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div className="app-breadcrumb text-sm mt-4">
            <Link href="/dashboard" className="font-semibold text-teal-700">Profile</Link>
            <ChevronRight size={14} className="text-slate-400" />
            <span>Personal overview</span>
          </div>

          <section className="app-card app-fade-in rounded-4xl p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
                <div className="relative h-28 w-28 overflow-hidden rounded-4xl bg-slate-100 ring-1 ring-slate-200">
                  {profile?.photo_url ? (
                    <Image src={profile.photo_url} alt={fallbackName} fill sizes="112px" className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <UserCircle2 size={50} />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                    Member profile
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{fallbackName}</h1>
                    <div className="mt-2 flex flex-col gap-2">
                      <p className="flex items-center gap-2 text-slate-500">
                        <Mail size={16} /> {profile?.email}
                        {user.email_confirmed_at && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                            <Check size={12} /> Verified
                          </span>
                        )}
                      </p>
                      <p className="text-xs font-medium text-slate-400">ID: {user.id.slice(0, 8)}...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-slate-200/70 pt-5 md:flex-col md:items-center md:justify-between">
                <div className="max-w-xs">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Quick actions</p>
                  <p className="mt-1 text-sm text-slate-600">Share, message, or edit this profile from one place.</p>
                </div>
                <div className="shrink-0">
                  <ProfileActions email={profile?.email} memberId={user.id} />
                </div>
              </div>
            </div>
          </section>

          <section className="app-card app-fade-in rounded-4xl p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Summary</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">Profile snapshot</h2>
              </div>
              <p className="text-sm text-slate-500">Updated in real time</p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3 md:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50/80 px-5 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                  <p className="mt-1 text-base font-semibold tracking-tight text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="app-card app-fade-in rounded-4xl p-6 md:p-8 lg:sticky lg:top-24 lg:h-fit mt-19">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Snapshot</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">Personal information</h2>
            </div>
            <ChevronRight className="text-slate-400" />
          </div>

          <div className="mt-6 grid gap-4">
            <Info label="Age" value={profile?.age} />
            <Info label="Branch" value={profile?.family_branch} />
            <Info label="Employment" value={profile?.employment_status} />
            <Info label="Marital Status" value={profile?.marital_status} />
            <Info label="Graduate Status" value={profile?.graduate_status} />
            <Info label="Location" value={profile?.location} />
            <Info label="Phone" value={profile?.phone_number} icon={<Phone size={14} />} />
            <Info label="Address" value={profile?.address} />
          </div>
        </aside>
      </div>
    </main>
  )
}

function Info({ label, value, icon }: { label: string; value: string | number | null | undefined; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-slate-950">{value || '-'}</p>
    </div>
  )
}