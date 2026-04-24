'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight

      if (documentHeight <= 0) {
        setProgress(0)
        return
      }

      const nextProgress = Math.min(100, Math.max(0, (window.scrollY / documentHeight) * 100))
      setProgress(nextProgress)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-16 z-40 h-1 bg-transparent"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-[var(--accent)] via-emerald-500 to-cyan-500 shadow-[0_0_18px_rgba(15,118,110,0.4)] transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  )
}
