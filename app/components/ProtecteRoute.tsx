'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { CardSkeleton } from './Skeleton'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const { push } = useRouter()

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) push('/login')
      else setLoading(false)
    }

    check()
  }, [push])

  if (loading) return <div className="mx-auto max-w-7xl px-4 py-8 md:px-6"><CardSkeleton /></div>

  return <>{children}</>
}
