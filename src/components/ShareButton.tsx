'use client'

import { useState } from 'react'

interface ShareButtonProps {
  title: string
  excerpt?: string
  url: string
  className?: string
}

const cls = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ')

export default function ShareButton({ title, excerpt, url, className }: ShareButtonProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'sharing'>('idle')

  const showCopiedState = () => {
    setStatus('copied')
    window.setTimeout(() => setStatus('idle'), 1800)
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        setStatus('sharing')
        await navigator.share({
          title,
          text: excerpt || title,
          url,
        })
        setStatus('idle')
        return
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        showCopiedState()
        return
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStatus('idle')
        return
      }
    }

    window.prompt('Copy this link', url)
    showCopiedState()
  }

  const label = status === 'copied' ? 'Copied' : status === 'sharing' ? 'Sharing...' : 'Share'

  return (
    <button
      onClick={handleShare}
      className={cls(
        'flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#115e59] sm:inline-flex sm:w-auto',
        className
      )}
      aria-live="polite"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
      </svg>
      {label}
    </button>
  )
}
