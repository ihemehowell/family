'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import ClickableAvatar from './ClickableAvatar'
import { TableRowSkeleton } from './Skeleton'

type SortKey = 'full_name' | 'age' | 'family_branch'
type SortDirection = 'asc' | 'desc'

type MemberRecord = {
  id: string
  full_name?: string | null
  email?: string | null
  age?: number | string | null
  family_branch?: string | null
  employment_status?: string | null
  marital_status?: string | null
  graduate_status?: string | null
  location?: string | null
  photo_url?: string | null
  [key: string]: string | number | null | undefined
}

type FilterKey = 'family_branch' | 'location' | 'marital_status'

const normalize = (value?: string | null) => value?.trim().toLowerCase() ?? ''

export default function MemberTable() {
  const router = useRouter()

  const [members, setMembers] = useState<MemberRecord[]>([])
  const [search, setSearch] = useState('')
  const [branch, setBranch] = useState('')
  const [location, setLocation] = useState('')
  const [marital, setMarital] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('full_name')
  const [sortDir, setSortDir] = useState<SortDirection>('asc')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const pageSize = 8

  useEffect(() => {
    supabase.from('family_members').select('*').then(({ data }) => {
      if (data) setMembers(data as MemberRecord[])
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    return members
      .filter((member) => `${member.full_name ?? ''} ${member.email ?? ''}`.toLowerCase().includes(search.toLowerCase()))
      .filter((member) => (branch ? normalize(member.family_branch) === normalize(branch) : true))
      .filter((member) => (location ? normalize(member.location) === normalize(location) : true))
      .filter((member) => (marital ? normalize(member.marital_status) === normalize(marital) : true))
      .sort((a, b) => {
        const valA = String(a[sortKey] ?? '')
        const valB = String(b[sortKey] ?? '')

        return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA)
      })
  }, [members, search, branch, location, marital, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  const updateFilter = (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
    setter(value)
    setPage(1)
  }

  function exportCSV() {
    if (!visible.length) return

    const csv = [
      Object.keys(visible[0]).join(','),
      ...visible.map((row) => Object.values(row).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'family-members.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-card overflow-hidden rounded-[2rem]">
      <div className="border-b border-slate-200/80 bg-white/80 p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Family directory</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">Browse every member</h2>
          </div>
          <button
            onClick={exportCSV}
            className="app-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
          >
            Export CSV
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <p>
            Showing <span className="font-semibold text-slate-950">{visible.length}</span> of{' '}
            <span className="font-semibold text-slate-950">{filtered.length}</span> members
          </p>
          <p>Page {totalPages ? page : 0} of {totalPages || 1}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            placeholder="Search name or email..."
            className="app-input min-w-[220px] max-w-md flex-1 text-sm"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
          />
          <div className="flex flex-1 items-center gap-3 md:justify-end">
          <Select
            value={branch}
            set={updateFilter(setBranch)}
            label="Branch"
            values={uniqueNormalized(members, 'family_branch')}
          />

          <Select
            value={location}
            set={updateFilter(setLocation)}
            label="Location"
            values={uniqueNormalized(members, 'location')}
          />

          <Select
            value={marital}
            set={updateFilter(setMarital)}
            label="Marital"
            values={uniqueNormalized(members, 'marital_status')}
          />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white/70">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
            <tr>
              <Th sort="full_name" {...{ sortKey, sortDir, setSortKey, setSortDir }}>Member</Th>
              <Th sort="family_branch" {...{ sortKey, sortDir, setSortKey, setSortDir }}>Branch</Th>
              <Th sort="age" {...{ sortKey, sortDir, setSortKey, setSortDir }}>Age</Th>
              <Th>Employment</Th>
              <Th>Marital</Th>
              <Th>Graduate</Th>
              <Th>Location</Th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <>
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
                <TableRowSkeleton />
              </>
            ) : visible.length ? (
              visible.map((member) => (
                <tr
                  key={member.id}
                  onClick={() => router.push(`/dashboard/${member.id}`)}
                  className="cursor-pointer border-b border-slate-100 transition hover:bg-teal-50/60"
                >
                  <Td>
                    <div className="flex items-center gap-3">
                      <ClickableAvatar
                        src={member.photo_url || '/placeholder.png'}
                        alt={member.full_name || 'Member'}
                        className="h-10 w-10"
                      />
                      <div>
                        <p className="font-medium text-slate-950">{member.full_name}</p>
                        <p className="text-slate-500">{member.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>{member.family_branch}</Td>
                  <Td>{member.age}</Td>
                  <Td><Badge type={member.employment_status} /></Td>
                  <Td><Badge type={member.marital_status} /></Td>
                  <Td><Badge type={member.graduate_status} /></Td>
                  <Td>{member.location}</Td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="mx-auto max-w-md space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <Search size={22} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-950">No members found</h3>
                    <p className="text-sm leading-7 text-slate-500">
                      Try clearing the filters or searching with a different name or branch.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-200/80 px-4 py-4 text-sm md:flex-row md:items-center md:justify-between md:px-5">
        <span className="text-slate-500">Use the arrows to page through the directory.</span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((value) => value - 1)}
            className="app-button-secondary rounded-full px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((value) => value + 1)}
            className="app-button-secondary rounded-full px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

function uniqueNormalized(data: MemberRecord[], key: FilterKey) {
  const map = new Map<string, string>()

  data.forEach((member) => {
    const raw = member[key]
    if (typeof raw !== 'string' || !raw) return

    const normalized = normalize(raw)
    if (!map.has(normalized)) map.set(normalized, raw.trim())
  })

  return Array.from(map.values())
}

type SelectProps = {
  value: string
  set: (value: string) => void
  label: string
  values: string[]
}

function Select({ value, set, label, values }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => set(event.target.value)}
      className="app-input min-w-[170px] text-sm"
    >
      <option value="">{label}</option>
      {values.map((entry) => (
        <option key={entry} value={entry}>
          {entry}
        </option>
      ))}
    </select>
  )
}

type ThProps = {
  children: React.ReactNode
  sort?: SortKey
  sortKey: SortKey
  sortDir: SortDirection
  setSortKey: (key: SortKey) => void
  setSortDir: React.Dispatch<React.SetStateAction<SortDirection>>
}

function Th({ children, sort, sortKey, sortDir, setSortKey, setSortDir }: ThProps) {
  const active = sort === sortKey

  const handleClick = () => {
    if (!sort) return

    if (active) {
      setSortDir((direction) => (direction === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(sort)
    setSortDir('asc')
  }

  return (
    <th
      onClick={handleClick}
      aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
      className="cursor-pointer px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500"
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {active && (sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
      </span>
    </th>
  )
}

type TdProps = {
  children: React.ReactNode
}

function Td({ children }: TdProps) {
  return <td className="whitespace-nowrap px-4 py-4 text-slate-700">{children}</td>
}

type BadgeProps = {
  type?: string | null
}

function Badge({ type }: BadgeProps) {
  const map: Record<string, string> = {
    Employed: 'bg-green-100 text-green-700',
    Unemployed: 'bg-red-100 text-red-700',
    Married: 'bg-blue-100 text-blue-700',
    Single: 'bg-gray-100 text-gray-700',
    Graduate: 'bg-purple-100 text-purple-700',
    'Not Graduate': 'bg-yellow-100 text-yellow-700',
    Skilled: 'bg-cyan-100 text-cyan-700',
  }

  return <span className={`rounded-full px-2 py-1 text-xs font-medium ${map[type ?? ''] || 'bg-gray-100 text-gray-700'}`}>{type || '—'}</span>
}