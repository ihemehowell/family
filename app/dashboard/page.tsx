import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import { Edit, LogOut } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()


  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('family_members')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto mt-10 space-y-10 px-4 md:px-0">
        {/* Profile Header */}
        <div className="bg-white shadow-md rounded-2xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          {profile?.photo_url ? (
            <img
              src={profile.photo_url}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-lg font-medium border-2 border-gray-200">
              No Photo
            </div>
          )}

          <div className="flex-1 flex flex-col justify-center md:justify-start">
            <h1 className="text-3xl font-bold text-gray-900">{profile?.full_name || 'Unnamed User'}</h1>
            <p className="text-gray-500 mt-1">{profile?.email}</p>

            <div className="mt-4 flex gap-4">
              <Link
                href="/profile"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Edit className="w-5 h-5 mr-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Info label="Age" value={profile?.age} />
            <Info label="Branch" value={profile?.family_branch} />
            <Info label="Employment" value={profile?.employment_status} />
            <Info label="Marital Status" value={profile?.marital_status} />
            <Info label="Graduate Status" value={profile?.graduate_status} />
            <Info label="Location" value={profile?.location} />
            <Info label="Phone" value={profile?.phone_number} />
            <Info label="Address" value={profile?.address} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-lg transition">
      <p className="text-gray-800 text-xs font-medium mb-1">{label}</p>
      <p className="font-semibold text-gray-800">{value || '-'}</p>
    </div>
  )
}
