import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import Navigation from '@/components/Navigation'

export default function Home() {
  const allPostsData = getSortedPostsData()
  const latestUpdate = allPostsData[0]?.date

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Hero Section */}
        <header className="text-center mb-12 md:mb-16">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              欢迎来到我的技术世界
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              在这里分享前端开发心得、技术学习笔记和编程实践经验
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-5 sm:gap-8 mb-8 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{allPostsData.length}</div>
              <div className="text-sm text-gray-600">篇文章</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">2025</div>
              <div className="text-sm text-gray-600">年开始</div>
            </div>
            {latestUpdate && (
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatDate(latestUpdate)}</div>
                <div className="text-sm text-gray-600">最近更新</div>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/feed.xml"
              className="flex w-full sm:inline-flex sm:w-auto items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3.429 2.571c0-.952.771-1.714 1.714-1.714.952 0 1.714.762 1.714 1.714 0 .943-.762 1.714-1.714 1.714-.943 0-1.714-.771-1.714-1.714zM3.429 7.429c3.771 0 6.857 3.086 6.857 6.857h2.286c0-5.029-4.114-9.143-9.143-9.143v2.286zM3.429 12.286c1.257 0 2.286 1.029 2.286 2.286H8c0-2.514-2.057-4.571-4.571-4.571v2.285z"/>
              </svg>
              RSS 订阅
            </Link>
          </div>
        </header>
        {/* Articles */}
        <main>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">最新文章</h2>
            <Link 
              href="/posts" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              查看全部 →
            </Link>
          </div>
          
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allPostsData.slice(0, 6).map(({ id, date, title, excerpt }) => (
              <article
                key={id}
                className="group h-full bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <time className="text-sm text-gray-500" dateTime={date}>
                      {formatDate(date)}
                    </time>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                    <Link href={`/posts/${id}`}>
                      {title}
                    </Link>
                  </h3>
                  
                  {excerpt && (
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {excerpt}
                    </p>
                  )}
                  
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href={`/posts/${id}`}
                      className="flex w-full sm:inline-flex sm:w-auto items-center justify-center sm:justify-start text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                    >
                      阅读全文
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
            <p className="text-gray-600">
              © 2025 zhanbing. 使用 Next.js 构建，托管在 GitHub Pages
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                关于
              </Link>
              <Link href="/feed.xml" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                RSS
              </Link>
              <a 
                href="https://github.com/Zhanbingli" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
