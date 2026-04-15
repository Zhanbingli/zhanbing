'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { escapeRegExp, formatDate } from '@/lib/utils'
import Navigation from '@/components/Navigation'

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
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">站内搜索</p>
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">搜索文章</h1>
            <p className="mt-2 text-lg text-slate-600 max-w-3xl leading-relaxed">
              支持搜索标题、摘要、标签和正文关键词。输入一个词，就能更快找到你真正想看的内容。
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索标题、标签或正文关键词"
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
                className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-[var(--accent)] text-white text-sm font-medium rounded-full shadow-sm hover:bg-[#0c316f] transition-colors duration-150"
              >
                搜索
              </button>
            </div>
          </form>
        </header>

        {/* Search Results */}
        <main className="space-y-6">
          {initialQuery && (
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                  搜索结果
                </h2>
                <div className="text-slate-600 text-sm">
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      搜索中...
                    </div>
                  ) : (
                    `共找到 ${searchResults.length} 条结果`
                  )}
                </div>
              </div>

              <div className="mt-2 text-slate-600 text-sm">
                关键词：<span className="font-medium text-[var(--accent)]">&ldquo;{initialQuery}&rdquo;</span>
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
              <h3 className="text-xl font-semibold text-slate-900 mb-2">没有找到相关文章</h3>
              <p className="text-slate-600 mb-6">
                换一个关键词试试，或者先从文章归档和标签页开始浏览。
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/posts"
                  className="inline-flex items-center px-6 py-3 bg-[var(--accent)] text-white font-medium rounded-full shadow-sm hover:bg-[#0c316f] transition-colors duration-150"
                >
                  浏览全部文章
                </Link>
                <Link
                  href="/tags"
                  className="inline-flex items-center px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-full hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-150"
                >
                  查看标签
                </Link>
              </div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {searchResults.map(({ id, date, title, excerpt, content, tags, score }) => (
                <article
                  key={id}
                  className="group rounded-xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-3 text-sm text-slate-500">
                    <time dateTime={date}>{formatDate(date)}</time>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">相关度 {score}</span>
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
                      阅读全文
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
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center border border-slate-200">
                <svg className="w-12 h-12 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">开始搜索</h3>
              <p className="text-slate-600 mb-6">
                输入关键词后，可以搜索标题、摘要、标签和正文内容。
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/posts"
                  className="inline-flex items-center px-6 py-3 bg-[var(--accent)] text-white font-medium rounded-full shadow-sm hover:bg-[#0c316f] transition-colors duration-150"
                >
                  浏览全部文章
                </Link>
                <Link
                  href="/tags"
                  className="inline-flex items-center px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-full hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-150"
                >
                  查看标签
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 
