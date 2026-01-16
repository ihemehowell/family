'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
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

  return (
    <>
      {/* Avatar */}
      <img
        src={src}
        alt={alt}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(true)
        }}
        className={clsx(
          'rounded-full object-cover border cursor-pointer hover:opacity-80 transition',
          className
        )}
      />

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

          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  )
}
