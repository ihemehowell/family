import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/app/components/Navbar'
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Heart,
  GraduationCap,
  GitBranch,
  Home,
  Calendar,
} from 'lucide-react'
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

export default async function MemberViewPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const id = resolvedParams.id

  if (!isUUID(id)) return notFound()

  const supabase = createClient()

  const { data: member, error } = (await supabase
    .from('family_members')
    .select('*')
    .eq('id', id)
    .maybeSingle()) as { data: MemberRecord | null; error: unknown }

  if (error || !member) return notFound()

  const initials = member.full_name
    ? member.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?'

  return (
    <main className="min-h-screen px-4 pb-16 pt-4 md:px-6">
      <Navbar />

      <div className="app-page-shell mt-6 px-0 lg:px-4">

        {/* Breadcrumb */}
        <div className="app-breadcrumb text-sm my-4">
          <Link href="/table" className="font-semibold" style={{ color: 'var(--brand)' }}>
            Family members
          </Link>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-slate-500">Member profile</span>
        </div>

        {/* Back + Actions row */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/table"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-soft)',
              color: 'var(--foreground)',
            }}
          >
            <ChevronLeft size={16} />
            Back
          </Link>
          <MemberActions id={id} email={member.email} />
        </div>

        {/* ── Profile Layout ── */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">

          {/* LEFT — Identity column */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:w-72 flex-shrink-0 app-card app-fade-in rounded-4xl p-6" style={{ background: 'var(--surface)' }} >

            {/* Avatar */}
            <div
              className="relative h-36 w-36 overflow-hidden rounded-[2rem] mb-5 mx-auto"
              style={{
                border: '3px solid white',
                boxShadow: '0 12px 40px rgba(15,118,110,0.16)',
              }}
            >
              {member.photo_url ? (
                <Image
                  src={member.photo_url}
                  alt={member.full_name || 'Member'}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-2xl font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, var(--brand), var(--brand-strong))',
                  }}
                >
                  {initials}
                </div>
              )}
            </div>

            {/* Branch label */}
            {member.family_branch && (
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-3 mx-auto"
                style={{
                  background: 'var(--brand-soft)',
                  color: 'var(--brand-strong)',
                }}
              >
                {member.family_branch} Branch
              </span>
            )}

            {/* Name */}
            <h1
              className="text-2xl font-bold tracking-tight mb-1"
              style={{ color: 'var(--foreground)' }}
            >
              {member.full_name || 'Unknown Member'}
            </h1>

            {/* Contact pills */}
            <div className="flex flex-col gap-2 mt-4 w-full">
              {member.email && (
                <ContactRow icon={<Mail size={14} />} text={member.email} />
              )}
              {member.phone_number && (
                <ContactRow icon={<Phone size={14} />} text={member.phone_number} />
              )}
              {member.location && (
                <ContactRow icon={<MapPin size={14} />} text={member.location} />
              )}
              {member.address && (
                <ContactRow icon={<Home size={14} />} text={member.address} />
              )}
            </div>
          </div>

          {/* Vertical divider (desktop only) */}
          <div
            className="hidden lg:block w-px self-stretch"
            style={{ background: 'var(--border-soft)' }}
          />

          {/* RIGHT — Details */}
          <div className="flex-1 min-w-0 app-card app-fade-in rounded-4xl p-6" style={{ background: 'var(--surface)' }} >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-5"
              style={{ color: 'var(--brand)' }}
            >
              Member details
            </p>

            <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-4">
              <DetailRow icon={<Calendar size={15} />}    label="Age"               value={member.age} />
              <DetailRow icon={<GitBranch size={15} />}   label="Family Branch"     value={member.family_branch} />
              <DetailRow icon={<Briefcase size={15} />}   label="Employment"        value={member.employment_status} />
              <DetailRow icon={<Heart size={15} />}       label="Marital Status"    value={member.marital_status} />
              <DetailRow icon={<GraduationCap size={15} />} label="Education"       value={member.graduate_status} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

// ─── Sub-components ───────────────────────────────────────────────

function ContactRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-soft)',
        color: 'var(--foreground)',
      }}
    >
      <span style={{ color: 'var(--brand)' }}>{icon}</span>
      <span className="truncate">{text}</span>
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value?: string | number | null
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-2xl px-4 py-4 max-w-50 text-sm"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-soft)',
      }}
    >
      <span
        className="mt-0.5 flex-shrink-0"
        style={{ color: 'var(--brand)' }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-0.5"
          style={{ color: 'var(--brand)' }}
        >
          {label}
        </p>
        <p
          className="text-sm font-semibold truncate"
          style={{ color: value ? 'var(--foreground)' : 'rgba(23,33,43,0.3)' }}
        >
          {value ?? 'Not provided'}
        </p>
      </div>
    </div>
  )
}