export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

export default async function Page() {
  const supabase = createClient()
  const { data: todos } = await supabase.from('todos').select().limit(5)

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 via-blue-500 to-slate-900 flex flex-col">

      {/* HERO */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-3xl w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl p-10 text-center border border-white/20">

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Okorocha Family Dashboard
          </h1>

          <p className="text-white/70 text-lg md:text-xl mb-8 capitalize">
            A private space to manage family members, tasks, and important updates — all in one secure place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full flex gap-2 items-center sm:w-auto px-10 py-3 rounded-xl text-black/60 bg-white text-slate-900 font-semibold hover:bg-white/70 transition shadow"
            >
              <LogIn  size={20}/>
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* PREVIEW SECTION */}
      {todos && todos.length > 0 && (
        <div className="px-6 pb-12">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Recent Tasks
              </h2>
              <Link href="/login" className="text-sm text-indigo-600 hover:underline">
                View all →
              </Link>
            </div>

            <ul className="space-y-3">
              {todos.map((todo: any) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {todo.title || todo.task || 'Untitled Task'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {todo.description || 'No description'}
                    </p>
                  </div>

                  <span className={`text-xs font-semibold px-3 py-1 rounded-full
                    ${todo.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                  `}>
                    {todo.status || 'Pending'}
                  </span>
                </li>
              ))}
            </ul>

          </div>
        </div>
      )}
    </div>
  )
}
