import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import Navigation from '@/components/Navigation'
import { notFound } from 'next/navigation'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  
  return {
    title: `标签: ${decodedTag}`,
    description: `查看所有关于 "${decodedTag}" 的文章`,
  }
}

export async function generateStaticParams() {
  const allPostsData = getSortedPostsData()
  const allTags = Array.from(new Set(allPostsData.flatMap(post => post.tags || [])))
  
  return allTags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }))
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const allPostsData = getSortedPostsData()
  
  // 过滤出包含该标签的文章
  const taggedPosts = allPostsData.filter(post => 
    post.tags?.includes(decodedTag)
  )

  if (taggedPosts.length === 0) {
    notFound()
  }

  // 获取相关标签（与当前标签一起出现的其他标签）
  const relatedTags = Array.from(new Set(
    taggedPosts
      .flatMap(post => post.tags || [])
      .filter(t => t !== decodedTag)
  )).slice(0, 8)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
            <span className="text-white font-bold text-2xl">
              {decodedTag.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            {decodedTag}
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            找到 <span className="font-semibold text-blue-600">{taggedPosts.length}</span> 篇关于 &ldquo;{decodedTag}&rdquo; 的文章
          </p>

          {/* Breadcrumb */}
          <nav className="flex justify-center" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">
                  首页
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link href="/tags" className="ml-1 text-gray-700 hover:text-blue-600 transition-colors duration-200 md:ml-2">
                    标签
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-gray-500 md:ml-2">{decodedTag}</span>
                </div>
              </li>
            </ol>
          </nav>
        </header>

        {/* Articles */}
        <main className="mb-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {taggedPosts.map(({ id, date, title, excerpt, tags }) => (
              <article
                key={id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <time className="text-sm text-gray-500" dateTime={date}>
                      {formatDate(date)}
                    </time>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {decodedTag}
                    </span>
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
                        {tags.filter(t => t !== decodedTag).slice(0, 2).map((tag) => (
                          <Link
                            key={tag}
                            href={`/tags/${encodeURIComponent(tag)}`}
                            className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full transition-colors duration-200"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* Related Tags */}
        {relatedTags.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">相关标签</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {relatedTags.map((relatedTag) => (
                <Link
                  key={relatedTag}
                  href={`/tags/${encodeURIComponent(relatedTag)}`}
                  className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <span className="text-sm font-medium">{relatedTag}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/tags"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            所有标签
          </Link>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
} 