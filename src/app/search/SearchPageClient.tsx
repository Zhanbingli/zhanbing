'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import Navigation from '@/components/Navigation'

interface SearchResult {
  id: string
  title: string
  date: string
  excerpt?: string
  tags?: string[]
  content: string
  score: number
}

interface PostData {
  id: string
  title: string
  date: string
  excerpt?: string
  tags?: string[]
  content: string
}

interface SearchPageClientProps {
  allPosts: PostData[]
}

export default function SearchPageClient({ allPosts }: SearchPageClientProps) {
  const searchParams = useSearchParams()
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [initialQuery, setInitialQuery] = useState('')

  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    
    try {
      const results: SearchResult[] = []

      allPosts.forEach(post => {
        let score = 0
        const searchTermLower = searchTerm.toLowerCase()
        
        // 搜索标题 (权重最高)
        if (post.title.toLowerCase().includes(searchTermLower)) {
          score += 10
        }
        
        // 搜索摘要
        if (post.excerpt && post.excerpt.toLowerCase().includes(searchTermLower)) {
          score += 5
        }
        
        // 搜索标签
        if (post.tags) {
          post.tags.forEach(tag => {
            if (tag.toLowerCase().includes(searchTermLower)) {
              score += 3
            }
          })
        }
        
        // 搜索内容
        if (post.content.toLowerCase().includes(searchTermLower)) {
          score += 1
        }

        if (score > 0) {
          results.push({
            ...post,
            score
          })
        }
      })

      // 按相关性排序
      results.sort((a, b) => b.score - a.score)
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [allPosts])

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
    
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            搜索文章
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            在这里搜索你感兴趣的技术文章和学习笔记
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="输入关键词搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="h-6 w-6 text-gray-400"
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
                className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                搜索
              </button>
            </div>
          </form>
        </header>

        {/* Search Results */}
        <main>
          {initialQuery && (
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  搜索结果
                </h2>
                <div className="text-gray-600">
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      搜索中...
                    </div>
                  ) : (
                    `找到 ${searchResults.length} 个结果`
                  )}
                </div>
              </div>
              
              <div className="mt-2 text-gray-600">
                搜索关键词: <span className="font-medium text-blue-600">&ldquo;{initialQuery}&rdquo;</span>
              </div>
            </div>
          )}

          {!isLoading && searchResults.length === 0 && initialQuery && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">没有找到相关文章</h3>
              <p className="text-gray-600 mb-6">
                尝试使用不同的关键词或者浏览所有文章
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  浏览所有文章
                </Link>
                <Link
                  href="/tags"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  查看标签分类
                </Link>
              </div>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map(({ id, date, title, excerpt, tags, score }) => (
                <article
                  key={id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <time className="text-sm text-gray-500" dateTime={date}>
                        {formatDate(date)}
                      </time>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          相关度: {score}
                        </span>
                        {tags && tags.length > 0 && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {tags[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                      <Link href={`/posts/${id}`}>
                        {highlightText(title, initialQuery)}
                      </Link>
                    </h3>
                    
                    {excerpt && (
                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                        {highlightText(excerpt, initialQuery)}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/posts/${id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                      >
                        阅读全文
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      
                      {tags && tags.length > 1 && (
                        <div className="flex space-x-1">
                          {tags.slice(1, 3).map((tag) => (
                            <Link
                              key={tag}
                              href={`/tags/${encodeURIComponent(tag)}`}
                              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full transition-colors duration-200"
                            >
                              {highlightText(tag, initialQuery)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!initialQuery && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">开始搜索</h3>
              <p className="text-gray-600 mb-6">
                输入关键词来搜索文章标题、内容或标签
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  浏览最新文章
                </Link>
                <Link
                  href="/tags"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  查看标签分类
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
} 