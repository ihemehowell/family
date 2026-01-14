import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Navbar from '@/app/components/Navbar'

export default async function MemberViewPage({ params }: { params: { id: string } }) {
  const supabase = createClient(await cookies())

  const { data: member, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!member || error) return notFound()

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto bg-white rounded-xl mt-10 shadow p-8 space-y-6">

        <div className="flex items-center gap-6">
          <img
            src={member.photo_url || '/placeholder.png'}
            className="w-28 h-28 rounded-full object-cover border"
          />

          <div>
            <h1 className="text-3xl font-bold">{member.full_name}</h1>
            <p className="text-gray-500">{member.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
