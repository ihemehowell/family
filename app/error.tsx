'use client'

export default function GlobalError({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
        <p className="text-gray-600 mt-2">{error.message}</p>
      </div>
    </div>
  )
}
