import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

export default function Home() {
  const allPostsData = getSortedPostsData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 博客头部 */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            blog of lizhanbing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            分享技术心得、学习笔记和生活感悟的地方
          </p>
          <div className="flex justify-center">
            <Link
              href="/feed.xml"
              className="inline-flex items-center text-orange-600 hover:text-orange-800 font-medium transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="mr-2 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3.429 2.571c0-.952.771-1.714 1.714-1.714.952 0 1.714.762 1.714 1.714 0 .943-.762 1.714-1.714 1.714-.943 0-1.714-.771-1.714-1.714zM3.429 7.429c3.771 0 6.857 3.086 6.857 6.857h2.286c0-5.029-4.114-9.143-9.143-9.143v2.286zM3.429 12.286c1.257 0 2.286 1.029 2.286 2.286H8c0-2.514-2.057-4.571-4.571-4.571v2.285z"/>
              </svg>
              RSS 订阅
            </Link>
          </div>
        </header>

        {/* 文章列表 */}
        <main>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">最新文章</h2>
          <div className="space-y-8">
            {allPostsData.map(({ id, date, title, excerpt, tags }) => (
              <article
                key={id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2 sm:mb-0">
                    <Link
                      href={`/posts/${id}`}
                      className="hover:text-blue-600 transition-colors duration-200"
                    >
                      {title}
                    </Link>
                  </h3>
                  <time className="text-sm text-gray-500" dateTime={date}>
                    {formatDate(date)}
                  </time>
                </div>
                
                {excerpt && (
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {excerpt}
                  </p>
                )}
                
                {tags && tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <Link
                  href={`/posts/${id}`}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  阅读全文
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </article>
            ))}
          </div>
        </main>

        {/* 页脚 */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            © 2025 blog of lizhanbing. 使用 Next.js 构建
          </p>
        </footer>
      </div>
    </div>
  )
}
