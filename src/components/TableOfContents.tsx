'use client'

import { useEffect, useState, type MouseEvent } from 'react'

export type TocHeading = { id: string; text: string; level: number }

interface TableOfContentsProps {
  headings: TocHeading[]
  className?: string
  collapsible?: boolean
  sticky?: boolean
}

const cls = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ')

export default function TableOfContents({
  headings,
  className = '',
  collapsible = false,
  sticky = false,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null)
  const [open, setOpen] = useState(!collapsible)

  useEffect(() => {
    setOpen(!collapsible)
  }, [collapsible])

  useEffect(() => {
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const topVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (topVisible?.target?.id) {
          setActiveId(topVisible.target.id)
          return
        }

        const nearest = [...entries].sort(
          (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
        )[0]

        if (nearest?.target?.id) {
          setActiveId(nearest.target.id)
        }
      },
      {
        rootMargin: '-42% 0px -46% 0px',
        threshold: [0, 0.25, 0.5, 1],
      }
    )

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => Boolean(el))

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  const handleClick = (id: string, event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const target = document.getElementById(id)
    if (!target) return

    const y = target.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo({ top: y, behavior: 'smooth' })
    if (collapsible) setOpen(false)
  }

  const visible = open || !collapsible
  const title = 'Contents'

  if (!headings.length) return null

  return (
    <div className={cls(className, sticky && 'lg:sticky lg:top-28')}>
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white/95 via-slate-50 to-white shadow-sm">
        <div className="flex items-center justify-between px-4 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-slate-500">{title}</p>
            <p className="text-sm font-medium text-slate-800 mt-1">
              Quick jump · {headings.length} section{headings.length === 1 ? '' : 's'}
            </p>
          </div>
          {collapsible && (
            <button
              type="button"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
            >
              {open ? 'Hide' : 'Show'}
            </button>
          )}
        </div>

        <div
          className={cls(
            'px-2 pb-4 transition-[max-height,opacity] duration-200 ease-out',
            visible ? 'opacity-100 max-h-[70vh]' : 'opacity-0 max-h-0 overflow-hidden'
          )}
        >
          <nav className="mt-3 space-y-1 text-sm text-slate-700">
            {headings.map((heading) => {
              const isActive = heading.id === activeId
              return (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  onClick={(event) => handleClick(heading.id, event)}
                  className={cls(
                    'group flex items-start gap-3 rounded-xl px-3 py-2 transition-colors',
                    isActive
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)] shadow-sm'
                      : 'hover:bg-slate-100 hover:text-slate-900',
                    heading.level === 3 && 'pl-6 text-[13px] text-slate-600'
                  )}
                >
                  <span
                    aria-hidden
                    className={cls(
                      'mt-1 inline-flex h-2 w-2 rounded-full transition-colors',
                      isActive ? 'bg-[var(--accent)]' : 'bg-slate-300',
                      heading.level === 3 && 'scale-75'
                    )}
                  />
                  <span className="leading-snug">{heading.text}</span>
                </a>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
