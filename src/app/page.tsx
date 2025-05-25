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
            展兵的个人博客
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            分享技术心得、学习笔记和生活感悟的地方
          </p>
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
            © 2024 展兵的个人博客. 使用 Next.js 构建
          </p>
        </footer>
      </div>
    </div>
  )
}
