'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, RotateCcw, Save, UserCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import AvatarUploader from './AvatarUploader'
import ClickableAvatar from '../components/ClickableAvatar'

type ProfileRecord = {
  id: string
  full_name?: string | null
  age?: number | null
  family_branch?: string | null
  employment_status?: string | null
  marital_status?: string | null
  graduate_status?: string | null
  location?: string | null
  address?: string | null
  phone_number?: string | null
  email?: string | null
  photo_url?: string | null
  [key: string]: string | number | null | undefined
}

const editableFields = [
  'full_name',
  'age',
  'family_branch',
  'employment_status',
  'marital_status',
  'graduate_status',
  'location',
  'address',
  'phone_number',
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileRecord | null>(null)
  const [initialProfile, setInitialProfile] = useState<ProfileRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const loadProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) return

      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single()

      if (error) setError(error.message)
      setProfile(data)
      setInitialProfile(data)
      setLoading(false)
    }

    loadProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setProfile((prev) => {
      if (!prev) return prev

      return {
        ...prev,
        [name]: name === 'age' ? (value === '' ? null : Number(value)) : value,
      } as ProfileRecord
    })

    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const validateProfile = (current: ProfileRecord) => {
    const nextErrors: Record<string, string> = {}

    if (!current.full_name?.trim()) nextErrors.full_name = 'Full name is required'
    if (!current.age || Number(current.age) < 1 || Number(current.age) > 120) nextErrors.age = 'Enter a valid age'
    if (!current.family_branch?.trim()) nextErrors.family_branch = 'Family branch is required'
    if (!current.location?.trim()) nextErrors.location = 'Location is required'
    if (!current.phone_number?.trim()) nextErrors.phone_number = 'Phone number is required'
    if (!current.address?.trim()) nextErrors.address = 'Address is required'

    return nextErrors
  }

  const handleSave = async () => {
    if (!profile) return

    const nextErrors = validateProfile(profile)
    setFieldErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSaving(true)
    setError(null)

    const updates = editableFields.reduce<Record<string, string | number | null | undefined>>((acc, key) => {
      acc[key] = profile[key]
      return acc
    }, {})

    const { error } = await supabase
      .from('family_members')
      .update(updates)
      .eq('id', profile.id)
      .select()
      .single()

    if (error) {
      setError(error.message)
    } else {
      setInitialProfile(profile)
    }

    setSaving(false)
  }

  const handlePhotoUpdated = (url: string) => {
    setProfile((prev) => (prev ? { ...prev, photo_url: url } : prev))
  }

  const hasChanges = useMemo(() => {
    if (!profile || !initialProfile) return false

    return JSON.stringify(editableFields.reduce<Record<string, string | number | null | undefined>>((acc, key) => {
      acc[key] = profile[key]
      return acc
    }, {})) !== JSON.stringify(editableFields.reduce((acc: Record<string, unknown>, key) => {
      acc[key] = initialProfile[key]
      return acc
    }, {}))
  }, [profile, initialProfile])

  if (loading) {
    return <div className="min-h-screen px-4 py-10 text-center text-slate-500">Loading profile...</div>
  }

  if (!profile) {
    return <div className="min-h-screen px-4 py-10 text-center text-rose-600">Profile not found</div>
  }

  const resetProfile = () => {
    if (initialProfile) {
      setProfile(initialProfile)
      setFieldErrors({})
      setError(null)
    }
  }

  return (
    <main className="min-h-screen px-4 pb-8 pt-4 md:px-6">
      <div className="app-page-shell">
        <div className="mb-6 space-y-4">
          <Link href="/dashboard" className="app-breadcrumb text-sm">
            <ChevronLeft size={16} /> Back to dashboard
          </Link>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Your profile</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Keep your family information up to date with a cleaner profile editor and easier-to-scan fields.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.12fr]">
          <section className=" app-fade-in rounded-[2rem] p-6 md:p-8">
            <div className="relative overflow-hidden rounded-[1.75rem] bg-slate-950 px-6 py-6 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.24),transparent_32%)]" />
              <div className="relative space-y-4">
                <div className="flex items-center gap-4">
                  {profile.photo_url ? (
                    <ClickableAvatar src={profile.photo_url} alt={profile.full_name || 'Profile'} className="h-24 w-24" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-white/70">
                      <UserCircle2 size={42} />
                    </div>
                  )}

                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-white/60">Current member</p>
                    <h2 className="mt-2 text-2xl font-semibold">{profile.full_name || 'Unnamed User'}</h2>
                    <p className="mt-1 text-white/70">{profile.email || 'No email available'}</p>
                  </div>
                </div>
                <AvatarUploader userId={profile.id} onUploaded={handlePhotoUpdated} />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 app-card app-fade-in rounded-4xl p-4" style={{ background: 'var(--surface)' }}>
              <MiniStat label="Profile status" value={hasChanges ? 'Unsaved changes' : 'All synced'} />
              <MiniStat label="Editing" value={saving ? 'Saving now' : 'Ready'} />
            </div>
          </section>

          <section className="app-card app-fade-in rounded-4xl p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Details</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">Edit personal information</h2>
              </div>
              <div className="flex items-center gap-2">
                {hasChanges && (
                  <button
                    onClick={resetProfile}
                    className="app-button-secondary inline-flex items-center gap-2 rounded-full px-3 py-3 text-sm font-semibold transition hover:-translate-y-0.5"
                  >
                    <RotateCcw size={16} /> Reset
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  className="app-button-primary inline-flex items-center gap-2 rounded-full px-3 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={16} /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Full name" name="full_name" value={profile.full_name || ''} onChange={handleChange} error={fieldErrors.full_name} placeholder="Your full name" />
              <Input label="Age" type="number" name="age" value={profile.age || ''} onChange={handleChange} error={fieldErrors.age} placeholder="Age" />
              <Input label="Family branch" name="family_branch" value={profile.family_branch || ''} onChange={handleChange} error={fieldErrors.family_branch} placeholder="Branch name" />
              <Input label="Employment status" name="employment_status" value={profile.employment_status || ''} onChange={handleChange} placeholder="Employment status" />
              <Input label="Marital status" name="marital_status" value={profile.marital_status || ''} onChange={handleChange} placeholder="Marital status" />
              <Input label="Graduate status" name="graduate_status" value={profile.graduate_status || ''} onChange={handleChange} placeholder="Graduate status" />
              <Input label="Location" name="location" value={profile.location || ''} onChange={handleChange} error={fieldErrors.location} placeholder="City or town" />
              <Input label="Phone number" name="phone_number" value={profile.phone_number || ''} onChange={handleChange} error={fieldErrors.phone_number} placeholder="Phone number" />
            </div>

            <div className="mt-4 md:col-span-2">
              <Input label="Address" name="address" value={profile.address || ''} onChange={handleChange} error={fieldErrors.address} placeholder="Home address" />
            </div>

            {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
          </section>
        </div>
      </div>
    </main>
  )
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

function Input({ label, error, ...props }: InputProps) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      <input {...props} className={`app-input ${error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-100' : ''}`} />
      {error && <span className="block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/85 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-slate-950">{value}</p>
    </div>
  )
}