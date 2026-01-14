'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import AvatarUploader from './AvatarUploader'

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
  const [profile, setProfile] = useState<any>(null)
  const [initialProfile, setInitialProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleChange = (e: any) => {
    const { name, value } = e.target

    setProfile((prev: any) => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value,
    }))
  }

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)
    setError(null)

    const updates = editableFields.reduce((acc: any, key) => {
      acc[key] = profile[key]
      return acc
    }, {})

    const { error } = await supabase
      .from('family_members')
      .update(updates)
      .eq('id', profile.id)

    if (error) {
      setError(error.message)
    } else {
      setInitialProfile(profile)
    }

    setSaving(false)
  }

  const handlePhotoUpdated = (url: string) => {
    setProfile((prev: any) => ({ ...prev, photo_url: url }))
  }

  const hasChanges =
    JSON.stringify(
      editableFields.reduce((acc: any, k) => {
        acc[k] = profile?.[k]
        return acc
      }, {})
    ) !==
    JSON.stringify(
      editableFields.reduce((acc: any, k) => {
        acc[k] = initialProfile?.[k]
        return acc
      }, {})
    )

  if (loading) return <div className="p-10 text-center text-gray-500">Loading profile…</div>
  if (!profile) return <div className="p-10 text-center text-red-500">Profile not found</div>

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow p-8 space-y-6">
        <div className="flex items-center gap-6">
          <img
            src={profile.photo_url || '/placeholder.png'}
            className="w-24 h-24 rounded-full object-cover border"
          />
          <AvatarUploader userId={profile.id} onUploaded={handlePhotoUpdated} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" name="full_name" value={profile.full_name || ''} onChange={handleChange} />
          <Input label="Age" type="number" name="age" value={profile.age || ''} onChange={handleChange} />
          <Input label="Family Branch" name="family_branch" value={profile.family_branch || ''} onChange={handleChange} />
          <Input label="Employment Status" name="employment_status" value={profile.employment_status || ''} onChange={handleChange} />
          <Input label="Marital Status" name="marital_status" value={profile.marital_status || ''} onChange={handleChange} />
          <Input label="Graduate Status" name="graduate_status" value={profile.graduate_status || ''} onChange={handleChange} />
          <Input label="Location" name="location" value={profile.location || ''} onChange={handleChange} />
          <Input label="Phone Number" name="phone_number" value={profile.phone_number || ''} onChange={handleChange} />
        </div>

        <div>
          <Input label="Address" name="address" value={profile.address || ''} onChange={handleChange} />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className={`w-full py-3 rounded text-white transition ${
            saving || !hasChanges
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {saving ? 'Saving…' : hasChanges ? 'Save Changes' : 'No Changes'}
        </button>
      </div>
    </div>
  )
}

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <input
        {...props}
        className="w-full border rounded-lg p-3 mt-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
      />
    </div>
  )
}
