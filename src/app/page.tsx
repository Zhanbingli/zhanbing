import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import Navigation from '@/components/Navigation'

export default function Home() {
  const allPostsData = getSortedPostsData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              欢迎来到我的技术世界
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              在这里分享前端开发心得、技术学习笔记和编程实践经验
            </p>
          </div>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{allPostsData.length}</div>
              <div className="text-sm text-gray-600">篇文章</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Array.from(new Set(allPostsData.flatMap(post => post.tags || []))).length}
              </div>
              <div className="text-sm text-gray-600">个标签</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2025</div>
              <div className="text-sm text-gray-600">年开始</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/tags"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              浏览标签
            </Link>
            <Link
              href="/feed.xml"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
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

        {/* Featured Tags */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">热门标签</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from(new Set(allPostsData.flatMap(post => post.tags || [])))
              .slice(0, 8)
              .map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span className="text-sm font-medium">{tag}</span>
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {allPostsData.filter(post => post.tags?.includes(tag)).length}
                  </span>
                </Link>
              ))}
          </div>
        </section>

        {/* Articles */}
        <main>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">最新文章</h2>
            <Link 
              href="/posts" 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              查看全部 →
            </Link>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allPostsData.slice(0, 6).map(({ id, date, title, excerpt, tags }) => (
              <article
                key={id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <time className="text-sm text-gray-500" dateTime={date}>
                      {formatDate(date)}
                    </time>
                    {tags && tags.length > 0 && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {tags[0]}
                      </span>
                    )}
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
                          <span
                            key={tag}
                            className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* Newsletter */}
        <section className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">保持联系</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            订阅我的博客，第一时间获取最新的技术文章和学习心得
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <input
              type="email"
              placeholder="输入你的邮箱地址"
              className="px-4 py-3 rounded-lg text-gray-900 w-full sm:w-80 focus:ring-2 focus:ring-white focus:outline-none"
            />
            <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto">
              订阅更新
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">
              © 2025 展兵的技术博客. 使用 Next.js 构建，托管在 GitHub Pages
            </p>
            <div className="flex space-x-6">
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
