'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Expand, X } from 'lucide-react'
import clsx from 'clsx'

type ClickableAvatarProps = {
  src: string
  alt: string
  className?: string   
}

export default function ClickableAvatar({
  src,
  alt,
  className = 'w-10 h-10',
}: ClickableAvatarProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    if (open) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <>
      {/* Avatar */}
      <button type="button" aria-label={`Preview ${alt}`} onClick={() => setOpen(true)} className={clsx('relative rounded-full overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-100', className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover border transition hover:opacity-80"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition hover:bg-black/10 hover:opacity-100">
          <Expand className="h-4 w-4" />
        </span>
      </button>

      {/* Fullscreen Preview */}
      {open && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
            }}
            className="absolute top-6 right-6 text-white"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-[90vw] max-h-[90vh] w-[90vw] h-[90vh]">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              onClick={(e) => e.stopPropagation()}
              className="object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}
