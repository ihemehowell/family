import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Page() {
const supabase = createClient()


  // Fetch some sample data (optional)
  const { data: todos } = await supabase.from('todos').select()

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-300 to-gray-900 flex flex-col">
      {/* Welcome Section */}
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4 md:px-0">
        <h1 className="text-6xl md:text-6xl font-bold text-gray-900 mb-4 animate-fadeIn">
          Welcome to Okorocha Family Dashboard
        </h1>
        <p className="text-gray-900 text-lg md:text-xl mb-8 animate-fadeIn delay-100">
          Keep track of all family members, tasks, and updates in one place.
        </p>
        <div className="flex gap-4 justify-center">
        <Link
          href="/login"
          className="bg-blue-400 text-white px-6 py-3 rounded-xl hover:bg-blue-500 transition font-semibold animate-fadeIn delay-200"
        >
           Login
        </Link>
        <p className="text-gray-900 text-lg md:text-xl mb-8 animate-fadeIn delay-100">or</p>
        <Link
          href="/register"
          className="bg-blue-400 text-white px-6 py-3 rounded-xl hover:bg-blue-500 transition font-semibold animate-fadeIn delay-200"
        >
          Register
        </Link>
        </div>
      </div>

      {/* Optional Section: Quick Todos / Highlights */}
      {todos && todos.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md max-w-4xl mx-auto mt-12 p-6 w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Tasks Overview</h2>
          <ul className="space-y-2">
            {todos.map((todo: any) => (
              <li
                key={todo.id}
                className="p-3 border rounded-lg flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="text-gray-700">{todo.title || todo.task || 'Untitled Task'}</span>
                <span className="text-sm text-gray-400">{todo.status || 'Pending'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
