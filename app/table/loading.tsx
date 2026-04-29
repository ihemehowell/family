import { CardSkeleton, TableRowSkeleton } from '../components/Skeleton'

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 space-y-6">
      <CardSkeleton />
      <div className="app-card overflow-hidden rounded-[2rem]">
        <table className="min-w-full text-sm">
          <tbody>
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </tbody>
        </table>
      </div>
    </div>
  )
}