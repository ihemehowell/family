export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ArrowRight, LogIn, ShieldCheck, Sparkles, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

type TodoItem = {
  id: string | number
  title?: string
  task?: string
  description?: string
  status?: string
}

const highlights = [
  { label: 'Private access', value: 'Invite only' },
  { label: 'Profiles', value: 'Family-wide' },
  { label: 'Updates', value: 'Always current' },
]

export default async function Page() {
  const supabase = createClient()
  const { data: todos } = await supabase.from('todos').select().limit(5)

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <section className="app-surface relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col overflow-hidden rounded-[2rem] px-6 py-8 md:px-10 md:py-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-16 top-8 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl" />
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-slate-400/10 blur-3xl" />
        </div>

        <div className="relative grid flex-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
              <Sparkles className="h-4 w-4 text-teal-700" />
              Okorocha Family Dynasty
            </div>

            <div className="space-y-5 max-w-2xl">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                A private family hub that feels calm, clear, and current.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
                Manage family members, profiles, and updates in one secure place with a softer, more modern interface.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/login"
                className="app-button-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              >
                <LogIn size={18} />
                Enter dashboard
                <ArrowRight size={18} />
              </Link>
              <div className="app-button-secondary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
                <ShieldCheck size={18} className="text-teal-700" />
                Invite protected
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.label} className="app-card rounded-2xl px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="app-card overflow-hidden rounded-[2rem] bg-white/90 p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-500">Overview</p>
                  <h2 className="mt-1 text-2xl font-semibold text-slate-950">Family activity</h2>
                </div>
                <div className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
                  Live
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-950 px-5 py-5 text-white">
                  <Users className="h-6 w-6 text-teal-300" />
                  <p className="mt-4 text-sm text-white/65">Members onboarded</p>
                  <p className="mt-2 text-3xl font-semibold">Secure profiles</p>
                </div>

                <div className="rounded-2xl bg-teal-50 px-5 py-5 text-slate-950">
                  <p className="text-sm font-medium text-teal-700">Fast access</p>
                  <p className="mt-4 text-lg leading-7 text-slate-700">
                    Jump into login, profile editing, or the table view with the same visual language.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50/80 p-4 md:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Recent tasks
                  </h3>
                  <Link href="/login" className="text-sm font-medium text-teal-700 hover:text-teal-800">
                    View all
                  </Link>
                </div>

                <div className="space-y-3">
                  {(todos?.length ? todos : [{ id: 1, title: 'No recent tasks', description: 'Add tasks to see them here.', status: 'pending' }]).map((todo: TodoItem) => (
                    <div key={todo.id} className="flex items-center justify-between rounded-2xl border border-white bg-white px-4 py-4 shadow-sm">
                      <div>
                        <p className="font-semibold text-slate-950">{todo.title || todo.task || 'Untitled task'}</p>
                        <p className="text-sm text-slate-500">{todo.description || 'No description available'}</p>
                      </div>
                      <span className="app-badge px-3 py-1 text-xs font-semibold text-slate-700">
                        {todo.status || 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}