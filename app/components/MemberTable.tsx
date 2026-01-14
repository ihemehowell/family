'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type SortKey = 'full_name' | 'age' | 'family_branch'

export default function MemberTable() {
  const router = useRouter()

  const [members, setMembers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [branch, setBranch] = useState('')
  const [location, setLocation] = useState('')
  const [marital, setMarital] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('full_name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const pageSize = 8

  useEffect(() => {
    supabase.from('family_members').select('*').then(({ data }) => {
      if (data) setMembers(data)
    })
  }, [])

  const filtered = useMemo(() => {
    return members
      .filter(m =>
        `${m.full_name} ${m.email}`.toLowerCase().includes(search.toLowerCase())
      )
      .filter(m => (branch ? m.family_branch === branch : true))
      .filter(m => (location ? m.location === location : true))
      .filter(m => (marital ? m.marital_status === marital : true))
      .sort((a, b) => {
        const valA = a[sortKey] || ''
        const valB = b[sortKey] || ''
        return sortDir === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA)
      })
  }, [members, search, branch, location, marital, sortKey, sortDir])

  const totalPages = Math.ceil(filtered.length / pageSize)
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  function exportCSV() {
    const csv = [
      Object.keys(visible[0] || {}).join(','),
      ...visible.map(row => Object.values(row).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'family-members.csv'
    a.click()
  }

 
  return (
    <div className="bg-white rounded-2xl shadow">

      {/* Toolbar */}
      <div className="p-4 border-b flex flex-wrap gap-3 items-center">
        <input
          placeholder="Search name or email..."
          className="border px-3 py-2 rounded text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <Select value={branch} set={setBranch} label="Branch" values={unique(members, 'family_branch')} />
        <Select value={location} set={setLocation} label="Location" values={unique(members, 'location')} />
        <Select value={marital} set={setMarital} label="Marital" values={unique(members, 'marital_status')} />

        <button onClick={exportCSV} className="ml-auto bg-gray-900 text-white px-4 py-2 rounded text-sm">
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
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
           {visible.map(m => (
                <tr
                  key={m.id}
                  onClick={() => router.push(`/dashboard/${m.id}`)}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                >
               <Td>
                  <div className="flex items-center gap-3">
                    <img src={m.photo_url || '/placeholder.png'} className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <p className="font-medium">{m.full_name}</p>
                      <p className="text-xs text-gray-500">{m.email}</p>
                    </div>
                  </div>
                </Td>
                <Td>{m.family_branch}</Td>
                <Td>{m.age}</Td>
                <Td><Badge type={m.employment_status} /></Td>
                <Td><Badge type={m.marital_status} /></Td>
                <Td><Badge type={m.graduate_status} /></Td>
                <Td>{m.location}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 flex justify-between text-sm">
        <span>Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>
    </div>
  )
}

/* ---------- Helpers ---------- */

function unique(data: any[], key: string) {
  return Array.from(new Set(data.map(d => d[key]).filter(Boolean)))
}

function Select({ value, set, label, values }: any) {
  return (
    <select value={value} onChange={e => set(e.target.value)} className="border px-3 py-2 rounded text-sm">
      <option value="">{label}</option>
      {values.map((v: string) => <option key={v}>{v}</option>)}
    </select>
  )
}

function Th({ children, sort, sortKey, sortDir, setSortKey, setSortDir }: any) {
  const active = sort === sortKey
  return (
    <th
      onClick={() => {
        if (active) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
        else { setSortKey(sort); setSortDir('asc') }
      }}
      className="cursor-pointer text-left px-4 py-3 uppercase text-xs text-gray-500"
    >
      {children} {active && (sortDir === 'asc' ? '↑' : '↓')}
    </th>
  )
}

function Td({ children }: any) {
  return <td className="px-4 py-3 whitespace-nowrap">{children}</td>
}

function Badge({ type }: { type: string }) {
  const map: any = {
    Employed: 'bg-green-100 text-green-700',
    Unemployed: 'bg-red-100 text-red-700',
    Married: 'bg-blue-100 text-blue-700',
    Single: 'bg-gray-100 text-gray-700',
    Graduate: 'bg-purple-100 text-purple-700',
    'Not Graduate': 'bg-yellow-100 text-yellow-700',
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[type] || 'bg-gray-100 text-gray-700'}`}>
      {type || '—'}
    </span>
  )
}
