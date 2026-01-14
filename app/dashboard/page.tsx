import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import Navbar from '../components/Navbar'
import Link from 'next/link'

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

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
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl mt-10 shadow p-10 space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        {profile?.photo_url ? (
                            <img
                                src={profile.photo_url}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border"
                            />
                        ) : (
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                No Photo
                            </div>
                        )}

                        <div>
                            <h1 className="text-2xl font-bold">{profile?.full_name || 'Unnamed User'}</h1>
                            <p className="text-gray-500">{profile?.email}</p>
                        </div>
                    </div>

                    <Link
                        href="/profile"
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Edit Profile
                    </Link>
                </div>

                {/* Info Section */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
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

                {/* Actions */}
                <div className="flex justify-end">
                    <form action="/auth/logout" method="post">
                        <button className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition">
                            Logout
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

function Info({ label, value }: { label: string; value: any }) {
    return (
        <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-gray-500 text-xs mb-1">{label}</p>
            <p className="font-medium text-gray-900">{value || '-'}</p>
        </div>
    )
}
