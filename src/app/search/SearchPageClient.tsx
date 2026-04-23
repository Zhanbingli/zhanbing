'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { escapeRegExp, formatDate } from '@/lib/utils'
import Navigation from '@/components/Navigation'
import {
  activeProjects,
  getTrackById,
  getTrackClass,
  readingPaths,
  writingTracks,
} from '@/lib/content-map'

interface SearchResult {
  id: string
  title: string
  date: string
  excerpt?: string
  content?: string
  tags?: string[]
  score: number
}

type SearchIndexItem = Omit<SearchResult, 'score'>

const suggestedQueries = ['OpenCode', 'Zotero', 'TypeScript', '行动', 'medical', 'AI tools']

export default function SearchPageClient() {
  const searchParams = useSearchParams()
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [initialQuery, setInitialQuery] = useState('')
  const [index, setIndex] = useState<SearchIndexItem[] | null>(null)

  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    
    try {
      const results: SearchResult[] = []
      const normalizedQuery = searchTerm.toLowerCase().trim()
      const keywords = normalizedQuery.split(/\s+/).filter(Boolean)

      const data = index ?? []
      data.forEach(post => {
        let score = 0
        const title = post.title.toLowerCase()
        const excerpt = post.excerpt?.toLowerCase() || ''
        const content = post.content?.toLowerCase() || ''
        const tags = post.tags || []

        keywords.forEach((keyword) => {
          if (title.includes(keyword)) score += title === keyword ? 18 : 12
          if (excerpt.includes(keyword)) score += 6
          if (content.includes(keyword)) score += 3
          tags.forEach((tag) => {
            const normalizedTag = tag.toLowerCase()
            if (normalizedTag === keyword) {
              score += 10
            } else if (normalizedTag.includes(keyword)) {
              score += 5
            }
          })
        })

        if (score > 0) {
          results.push({
            ...post,
            score
          })
        }
      })

      results.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [index])

  // Load a lightweight index (once)
  useEffect(() => {
    let aborted = false
    const loadIndex = async () => {
      try {
        const res = await fetch('/search-index.json', { cache: 'force-cache' })
        const data: SearchIndexItem[] = await res.json()
        if (!aborted) setIndex(data)
      } catch (e) {
        console.error('Failed to load search index', e)
        if (!aborted) setIndex([])
      }
    }
    loadIndex()
    return () => { aborted = true }
  }, [])

  useEffect(() => {
    const query = searchParams.get('q') || ''
    setSearchQuery(query)
    setInitialQuery(query)
    if (query) {
      performSearch(query)
    }
  }, [searchParams, performSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const url = new URL(window.location.href)
      url.searchParams.set('q', searchQuery.trim())
      window.history.pushState({}, '', url.toString())
      performSearch(searchQuery.trim())
    }
  }

  const highlightText = (text: string, query: string) => {
    if (!query) return text

    const rawKeywords = query
      .trim()
      .split(/\s+/)
      .filter(Boolean)
    const escapedKeywords = rawKeywords.map((keyword) => escapeRegExp(keyword))

    if (escapedKeywords.length === 0) return text

    const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) => 
      rawKeywords.some((keyword) => part.toLowerCase() === keyword.toLowerCase()) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
      )
  }

  const getPreviewText = (result: SearchResult) => {
    if (result.excerpt) return result.excerpt
    if (result.content) return `${result.content.slice(0, 140)}...`
    return ''
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-6 py-10 md:py-14">
        <header className="space-y-6 mb-10">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Explore</p>
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">Explore the knowledge base</h1>
            <p className="mt-2 text-lg text-slate-600 max-w-3xl leading-relaxed">
              Search directly, or start from projects, reading paths, and the main writing tracks.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search titles, tags, or keywords"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-base border border-slate-200 bg-white rounded-full focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all duration-150 shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 rounded-lg bg-[var(--accent)] px-5 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-[#115e59]"
              >
                Search
              </button>
            </div>
          </form>
        </header>

        {/* Search Results */}
        <main className="space-y-6">
          {initialQuery && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                  Results
                </h2>
                <div className="text-slate-600 text-sm">
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </div>
                  ) : (
                    `${searchResults.length} result${searchResults.length === 1 ? '' : 's'}`
                  )}
                </div>
              </div>

              <div className="mt-2 text-slate-600 text-sm">
                Query: <span className="font-medium text-[var(--accent)]">&ldquo;{initialQuery}&rdquo;</span>
              </div>
            </div>
          )}

          {!isLoading && searchResults.length === 0 && initialQuery && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center border border-slate-200">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No matching posts</h3>
              <p className="text-slate-600 mb-6">
                Try a different keyword, or start from the archive and tag pages.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/posts"
                  className="inline-flex items-center rounded-lg bg-[var(--accent)] px-6 py-3 font-medium text-white shadow-sm transition-colors duration-150 hover:bg-[#115e59]"
                >
                  Browse all posts
                </Link>
                <Link
                  href="/tags"
                  className="inline-flex items-center rounded-lg border border-slate-200 px-6 py-3 font-medium text-slate-700 transition-colors duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  Browse tags
                </Link>
              </div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {searchResults.map(({ id, date, title, excerpt, content, tags, score }) => (
                <article
                  key={id}
                  className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-3 text-sm text-slate-500">
                    <time dateTime={date}>{formatDate(date)}</time>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">Relevance {score}</span>
                      {tags && tags.length > 0 && (
                        <span className="inline-block bg-[var(--accent-soft)] text-[var(--accent)] text-[11px] px-2 py-0.5 rounded-full">
                          {tags[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-2 leading-snug">
                    <Link href={`/posts/${id}`} className="hover:text-[var(--accent)]">
                      {highlightText(title, initialQuery)}
                    </Link>
                  </h3>
                  
                  {getPreviewText({ id, date, title, excerpt, content, tags, score }) && (
                    <p className="text-slate-600 mb-3 leading-relaxed line-clamp-3">
                      {highlightText(getPreviewText({ id, date, title, excerpt, content, tags, score }), initialQuery)}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/posts/${id}`}
                      className="inline-flex items-center text-sm font-medium text-[var(--accent)] hover:underline"
                    >
                      Read more
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    
                    {tags && tags.length > 1 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.slice(1, 3).map((tag) => (
                          <Link
                            key={tag}
                            href={`/tags/${encodeURIComponent(tag)}`}
                            className="inline-block bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full transition-colors duration-150"
                          >
                            {highlightText(tag, initialQuery)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {!initialQuery && (
            <div className="space-y-12">
              <section>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Suggested searches</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">Try a keyword</h2>
                  </div>
                  <Link href="/start" className="text-sm font-medium text-[var(--accent)] hover:underline">
                    Guided start
                  </Link>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestedQueries.map((query) => (
                    <Link
                      key={query}
                      href={`/search?q=${encodeURIComponent(query)}`}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      {query}
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Projects</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">What the notes are building toward</h2>
                  </div>
                  <Link href="/projects" className="text-sm font-medium text-[var(--accent)] hover:underline">
                    All projects
                  </Link>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {activeProjects.map((project) => {
                    const track = getTrackById(project.trackId)
                    return (
                      <Link key={project.title} href="/projects" className="border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <span className={`rounded-full border px-2.5 py-1 text-xs ${getTrackClass(track, 'soft')}`}>
                          {project.status}
                        </span>
                        <h3 className="mt-4 text-lg font-semibold leading-snug text-slate-950">{project.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p>
                      </Link>
                    )
                  })}
                </div>
              </section>

              <section>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Reading paths</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Start by intent</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {readingPaths.map((path) => (
                    <Link key={path.id} href="/start" className="border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                      <h3 className="text-lg font-semibold leading-snug text-slate-950">{path.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{path.description}</p>
                    </Link>
                  ))}
                </div>
              </section>

              <section>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Tracks</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Browse by knowledge area</h2>
                <div className="mt-6 grid gap-4 lg:grid-cols-4">
                  {writingTracks.map((track) => (
                    <Link key={track.id} href={`/posts#${track.id}`} className="border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className={`mb-4 h-1.5 w-14 ${getTrackClass(track, 'bg')}`} aria-hidden />
                      <h3 className="font-semibold leading-snug text-slate-950">{track.shortTitle}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{track.description}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 
