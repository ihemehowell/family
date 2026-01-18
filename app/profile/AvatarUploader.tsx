'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AvatarUploader({
  userId,
  onUploaded,
}: {
  userId: string
  onUploaded: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (file: File) => {
    try {
      setUploading(true)

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
     const { data: profile, error: updateError } = await supabase
  .from('family_members')
  .update({ photo_url: publicUrl })
  .eq('id', userId)
  .select()
  .single()

if (updateError) throw updateError

      // 4️⃣ Sync UI
      onUploaded(publicUrl)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <input
      type="file"
      accept="image/*"
      disabled={uploading}
      onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
      className="border rounded-xl font-semibold p-3 w-75 hover:border-blue-500 cursor-pointer"
    />
  )
}
