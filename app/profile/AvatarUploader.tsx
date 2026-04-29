'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'

export default function AvatarUploader({
  userId,
  onUploaded,
}: {
  userId: string
  onUploaded: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    try {
      setUploading(true)
      setError(null)

      if (!file.type.startsWith('image/')) throw new Error('Please select an image file')
      if (file.size > 2 * 1024 * 1024) throw new Error('Image must be smaller than 2MB')

      const ext = file.name.split('.').pop()
      const filePath = `${userId}/avatar.${ext}`

      // 1️⃣ Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // 2️⃣ Get public URL
      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath)

      const publicUrl = data.publicUrl

      // 3️⃣ UPDATE existing profile row (THIS WAS MISSING)
      const { error: updateError } = await supabase
        .from('family_members')
        .update({ photo_url: publicUrl })
        .eq('id', userId)
        .select()
        .single()

      if (updateError) throw updateError

      // 4️⃣ Sync UI
      onUploaded(publicUrl)
      toast.success('Profile photo updated')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setError(message)
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-4 text-sm text-white/80 transition hover:border-teal-300 hover:bg-teal-400/10">
        <span>{uploading ? 'Uploading photo...' : 'Choose a new profile photo'}</span>
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
          className="sr-only"
        />
      </label>
      {error && <p className="text-sm text-rose-300">{error}</p>}
    </div>
  )
}
