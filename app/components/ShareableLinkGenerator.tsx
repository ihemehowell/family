// app/components/ShareableLinkGenerator.tsx
'use client'

import { useState } from 'react'
import { Copy, Loader2, Share2, Check } from 'lucide-react'
import { toast } from 'sonner'

interface ShareableLinkGeneratorProps {
  onLinkGenerated?: (link: string) => void
}

export default function ShareableLinkGenerator({ onLinkGenerated }: ShareableLinkGeneratorProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/shareable-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to generate link')
        return
      }

      setGeneratedLink(data.link)
      onLinkGenerated?.(data.link)
      toast.success('Shareable link created successfully!')
    } catch (error) {
      console.error('Error generating link:', error)
      toast.error('Failed to generate link')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (generatedLink) {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const reset = () => {
    setEmail('')
    setGeneratedLink(null)
    setCopied(false)
  }

  return (
    <div className="w-full max-w-full rounded-4xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="h-5 w-5 text-teal-500" />
        <h3 className="text-lg font-semibold text-slate-900">Generate Shareable Link</h3>
      </div>

      {!generatedLink ? (
        <form onSubmit={generateLink} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Family Member Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="member@family.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm placeholder-slate-400 outline-none transition-colors hover:border-slate-300 focus:border-teal-500 focus:bg-white focus:ring-1 focus:ring-teal-500/20 disabled:opacity-50"
              required
            />
          </div>

          <div className="text-xs text-slate-500 space-y-1">
            <p>• Link expires in 7 days</p>
            <p>• Can only be used once</p>
            <p>• Email will be pre-filled</p>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full rounded-lg app-button-primary py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 inline-block h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Share2 className="mr-2 inline-block h-4 w-4" />
                Generate Link
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Shareable Link Generated</p>
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 border border-slate-200">
              <code className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-600">
                {generatedLink}
              </code>
              <button
                onClick={copyToClipboard}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
            Share this link with <strong>{email}</strong> so they can join your family.
          </div>

          <button
            onClick={reset}
            className="w-full rounded-lg bg-slate-200 py-2 text-sm font-medium text-slate-900 hover:bg-slate-300 transition-colors"
          >
            Generate Another Link
          </button>
        </div>
      )}
    </div>
  )
}
