import Link from 'next/link'
import { getSortedPostsData, type PostData } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: '全部文章',
  description: '浏览我的所有博客文章，包括技术分享、学习笔记和编程心得',
  alternates: {
    canonical: '/posts',
  },
}

export default function PostsPage() {
  const allPostsData = getSortedPostsData()

  // 按日期排序（最新在前）
  const sortedPosts = allPostsData.sort((a: PostData, b: PostData) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // 统计信息
  const totalPosts = allPostsData.length
  const allTags = Array.from(new Set(allPostsData.flatMap((post: PostData) => post.tags || [])))
  const currentYear = new Date().getFullYear()
  const thisYearPosts = allPostsData.filter((post: PostData) => new Date(post.date).getFullYear() === currentYear).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            全部文章
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            探索我的技术世界，从前端开发到编程心得，记录每一次学习与成长
          </p>

          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalPosts}</div>
              <div className="text-sm text-gray-600">篇文章</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{allTags.length}</div>
              <div className="text-sm text-gray-600">个标签</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{thisYearPosts}</div>
              <div className="text-sm text-gray-600">今年发布</div>
            </div>
          </div>

          {/* Quick navigation */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/tags"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              按标签浏览
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              搜索文章
            </Link>
          </div>
        </header>

        {/* Articles List */}
        <main>
          <div className="space-y-8">
            {sortedPosts.map(({ id, date, title, excerpt, tags, readingTime }: PostData, index: number) => (
              <article
                key={id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-8">
                  {/* Article Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <time className="text-sm text-gray-500 font-medium" dateTime={date}>
                        {formatDate(date)}
                      </time>
                    </div>
                    
                    {/* Tags */}
                    {tags && tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 3).map((tag) => (
                          <Link
                            key={tag}
                            href={`/tags/${encodeURIComponent(tag)}`}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-200"
                          >
                            {tag}
                          </Link>
                        ))}
                        {tags.length > 3 && (
                          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                            +{tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                      <Link href={`/posts/${id}`} className="hover:underline">
                        {title}
                      </Link>
                    </h2>
                    
                    {excerpt && (
                      <p className="text-gray-600 text-lg leading-relaxed line-clamp-3">
                        {excerpt}
                      </p>
                    )}
                  </div>

                  {/* Article Footer */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/posts/${id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 text-lg"
                    >
                      阅读全文
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    
                    <div className="text-sm text-gray-500">
                      约 {Math.max(1, (readingTime ?? 1))} 分钟阅读
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* No posts message */}
          {sortedPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">暂无文章</h3>
              <p className="text-gray-600">
                文章正在努力创作中，敬请期待！
              </p>
            </div>
          )}
        </main>

        {/* Back to Home */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
} 
