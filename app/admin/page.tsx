import Navbar from '@/app/components/Navbar'

import MemberTable from '@/app/components/MemberTable'
import ProtectedRoute from '../components/ProtecteRoute'

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <Navbar />
      <div className="p-8">
        <h1 className="text-xl font-semibold mb-4">Family Members</h1>
        <MemberTable />
      </div>
    </ProtectedRoute>
  )
}
