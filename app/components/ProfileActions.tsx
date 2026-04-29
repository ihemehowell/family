'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { Copy, Edit3, MessageSquare, Share2 } from 'lucide-react'

type ProfileActionsProps = {
  email?: string | null
  memberId: string
}

export default function ProfileActions({ email, memberId }: ProfileActionsProps) {
  const profileUrl = typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : '/dashboard'

  const shareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Family profile',
          text: 'View my family dashboard profile',
          url: profileUrl,
        })
        return
      }

      await navigator.clipboard.writeText(profileUrl)
      toast.success('Profile link copied')
    } catch {
      toast.error('Unable to share profile right now')
    }
  }

  const messageMember = () => {
    if (!email) {
      toast.error('No email available for this profile')
      return
    }

    window.location.href = `mailto:${email}?subject=Family%20profile%20update&body=Hello%20${encodeURIComponent(memberId.slice(0, 8))}%2C`
  }

  const copyMemberId = async () => {
    await navigator.clipboard.writeText(memberId)
    toast.success('Member ID copied')
  }

  return (
    <div className="flex flex-row flex-wrap items-center gap-2">
      <button type="button" onClick={shareProfile} className="app-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-2 py-2 text-sm font-semibold transition hover:-translate-y-0.5 duration-500">
        <Share2 size={16} />
      </button>
      <button type="button" onClick={messageMember} className="app-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-2 py-2 text-sm font-semibold transition hover:-translate-y-0.5 duration-500">
        <MessageSquare size={16} />
      </button>
      <button type="button" onClick={copyMemberId} className="app-button-secondary inline-flex items-center justify-center gap-2 rounded-full px-2 py-2 text-sm font-semibold transition hover:-translate-y-0.5 duration-500">
        <Copy size={16} />
      </button>
      <Link href="/profile" className="app-button-primary inline-flex items-center justify-center gap-2 rounded-full px-2 py-2 text-sm font-semibold transition hover:-translate-y-0.5 duration-500">
        <Edit3 size={16} /> Edit
      </Link>
    </div>
  )
}