'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AvatarUploader({ userId, onUploaded }: { userId: string, onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (file: File) => {
    setUploading(true)

    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`

    const { error } = await supabase.storage
      .from('profile-photos')
      .upload(path, file, { upsert: true })

    if (error) {
      alert(error.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(path)

    onUploaded(data.publicUrl)
    setUploading(false)
  }

  return (
    <input
      type="file"
      accept="image/*"
      disabled={uploading}
      onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
    />
  )
}
