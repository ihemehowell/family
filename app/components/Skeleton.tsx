'use client';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`app-shimmer rounded-md bg-slate-200/80 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="app-card app-fade-in rounded-[1.75rem] p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-100">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-24" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-16" /></td>
      <td className="py-4 px-4"><Skeleton className="h-4 w-20" /></td>
    </tr>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="app-card app-fade-in rounded-[1.75rem] p-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Skeleton className="w-32 h-32 rounded-full" />
        <div className="flex-1 space-y-4 w-full">
          <Skeleton className="h-1 w-2" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <aside className=" mt-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 md:p-8">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full mt-2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </aside>
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 space-y-6">
      <Skeleton className="h-8 w-48 rounded-full" />
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}