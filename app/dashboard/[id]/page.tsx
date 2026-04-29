import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/app/components/Navbar'
import { ChevronLeft, ChevronRight, UserCircle2 } from 'lucide-react'
import MemberActions from '@/app/components/MemberActions'

type MemberRecord = {
  photo_url?: string | null
  full_name?: string | null
  email?: string | null
  age?: string | number | null
  family_branch?: string | null
  employment_status?: string | null
  marital_status?: string | null
  graduate_status?: string | null
  location?: string | null
  phone_number?: string | null
  address?: string | null
}

function isUUID(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
}

export default async function MemberViewPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = await params
  const id = resolvedParams.id

  if (!isUUID(id)) return notFound()

  const supabase = createClient()

  const { data: member, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('id', id)
    .maybeSingle() as { data: MemberRecord | null; error: unknown }

  if (error || !member) return notFound()

  return (
    <main className="min-h-screen px-4 pb-8 pt-4 md:px-6">
      <Navbar />

      <div className="app-page-shell mt-6 space-y-6 px-0">
        <div className="app-breadcrumb text-sm mt-4">
          <Link href="/table" className="font-semibold text-teal-700">Family members</Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span>Member profile</span>
        </div>

        <div className="app-card app-fade-in rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href="/table" className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
              <ChevronLeft size={18} /> Back to table
            </Link>
            <MemberActions id={id} email={member.email} />
          </div>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center">
            <div className="relative h-28 w-28 overflow-hidden rounded-[1.75rem] bg-slate-100 ring-1 ring-slate-200">
              {member.photo_url ? (
                <Image src={member.photo_url} alt={member.full_name || 'Member'} fill sizes="112px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <UserCircle2 size={48} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{member.full_name || 'Unknown'}</h1>
              <p className="text-slate-500">{member.email || '-'}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Info label="Age" value={member.age} />
            <Info label="Family Branch" value={member.family_branch} />
            <Info label="Employment Status" value={member.employment_status} />
            <Info label="Marital Status" value={member.marital_status} />
            <Info label="Graduate Status" value={member.graduate_status} />
            <Info label="Location" value={member.location} />
            <Info label="Phone" value={member.phone_number} />
            <Info label="Address" value={member.address} />
          </div>
        </div>
      </div>
    </main>
  )
}

function Info({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-950">{value || '-'}</p>
    </div>
  )
}