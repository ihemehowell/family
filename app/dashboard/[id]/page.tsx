import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import { ChevronLeft} from 'lucide-react'
import ClickableAvatar from '@/app/components/ClickableAvatar'


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
    .maybeSingle()

  if (error) {
    console.error('Supabase error:', error)
    return notFound()
  }

  if (!member) {
    console.warn('Member not found for ID:', id)
    return notFound()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white rounded-xl mt-10 shadow p-8 space-y-6">
        {/* Back Button */}
        <div className='flex  flex-col  gap-3'>
          <Link
          href="/admin"
          className=''
        >
        <ChevronLeft  className='w-8 h-8 text-gray-600 hover:text-blue-500'/>
        </Link>
             <h1 className="text-3xl font-bold mt-4">Member Profile</h1>
        

       
        </div>

        <div className="flex items-center gap-6 mt-4">
          <ClickableAvatar
            src={member.photo_url || '/placeholder.png'}
            alt={member.full_name || 'Member'}
            className='w-28 h-28'
          />
          <div>
            <h1 className="text-3xl font-bold">{member.full_name || 'Unknown'}</h1>
            <p className="text-gray-500">{member.email || '-'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-6">
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
  )
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium">{value || '-'}</p>
    </div>
  )
}
