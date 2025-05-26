import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: '标签分类',
  description: '浏览所有文章标签和分类',
}

export default function TagsPage() {
  const allPostsData = getSortedPostsData()
  
  // 统计所有标签
  const tagCounts = allPostsData.reduce((acc, post) => {
    if (post.tags) {
      post.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1
      })
    }
    return acc
  }, {} as Record<string, number>)

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            标签分类
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            通过标签快速找到你感兴趣的文章内容
          </p>
        </header>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{sortedTags.length}</div>
              <div className="text-gray-600">个标签</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{allPostsData.length}</div>
              <div className="text-gray-600">篇文章</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">
                {Math.round(Object.values(tagCounts).reduce((a, b) => a + b, 0) / sortedTags.length * 10) / 10}
              </div>
              <div className="text-gray-600">平均文章数</div>
            </div>
          </div>
        </div>

        {/* Tags Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedTags.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {tag.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {count} 篇
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {tag}
              </h3>
              
              <p className="text-gray-600 text-sm">
                查看所有关于 &ldquo;{tag}&rdquo; 的文章
              </p>
              
              <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-800 transition-colors duration-200">
                <span className="text-sm font-medium">浏览文章</span>
                <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Popular Tags */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">热门标签</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {sortedTags.slice(0, 10).map(([tag, count]) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="font-medium">{tag}</span>
                <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
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