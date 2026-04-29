'use client'

import { useMemo } from 'react'
import { toast } from 'sonner'
import { Mail, Share2 } from 'lucide-react'

type MemberActionsProps = {
  id: string
  email?: string | null
}

export default function MemberActions({ id, email }: MemberActionsProps) {
  const memberUrl = useMemo(
    () => (typeof window !== 'undefined' ? `${window.location.origin}/dashboard/${id}` : `/dashboard/${id}`),
    [id],
  )

  const shareMember = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Family member profile',
          url: memberUrl,
        })
        return
      }

      await navigator.clipboard.writeText(memberUrl)
      toast.success('Member link copied')
    } catch {
      toast.error('Unable to share member link')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={shareMember} className="app-button-secondary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5">
        <Share2 size={16} /> Share
      </button>
      {email ? (
        <a href={`mailto:${email}`} className="app-button-primary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5">
          <Mail size={16} /> Message
        </a>
      ) : null}
    </div>
  )
}