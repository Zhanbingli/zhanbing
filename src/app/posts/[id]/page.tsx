import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostData, getSortedPostsData } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import Navigation from '@/components/Navigation'
import ShareButton from '@/components/ShareButton'
import type { Metadata } from 'next'

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  const posts = getSortedPostsData()
  return posts.map((post) => ({
    id: post.id,
  }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const postData = await getPostData(id)
    const baseUrl = 'https://zhanbing.site'
    
    return {
      title: postData.title,
      description: postData.excerpt || `阅读 ${postData.title} - zhanbing`,
      keywords: postData.tags?.join(', ') || '',
      authors: [{ name: 'zhanbing', url: baseUrl }],
      openGraph: {
        title: postData.title,
        description: postData.excerpt || `阅读 ${postData.title} - zhanbing`,
        type: 'article',
        publishedTime: postData.date,
        authors: ['zhanbing'],
        tags: postData.tags,
        url: `${baseUrl}/posts/${id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: postData.title,
        description: postData.excerpt || `阅读 ${postData.title} - zhanbing`,
      },
      alternates: {
        canonical: `/posts/${id}`,
      },
    }
  } catch {
    return {
      title: '文章未找到',
      description: '您访问的文章不存在',
    }
  }
}

export default async function Post({ params }: PostPageProps) {
  const { id } = await params
  let postData
  
  try {
    postData = await getPostData(id)
  } catch {
    notFound()
  }

  // 简易 TOC 生成与内容增强（为 h2/h3 注入 id；为 img 添加 lazy 属性）
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-')

  const headings: { id: string; text: string; level: number }[] = []

  const enhancedHtml = postData.content
    // 抽取 h2/h3，注入 id
    .replace(/<h([23])(.*?)>([\s\S]*?)<\/h\1>/g, (_m, lvl, attrs, inner) => {
      const cleanText = String(inner).replace(/<[^>]+>/g, '').trim()
      const idVal = slugify(cleanText)
      headings.push({ id: idVal, text: cleanText, level: Number(lvl) })
      const hasId = /\sid=\".*?\"/.test(attrs)
      const newAttrs = hasId ? attrs : `${attrs} id="${idVal}"`
      return `<h${lvl}${newAttrs}>${inner}</h${lvl}>`
    })
    // 图片懒加载
    .replace(/<img(\s+[^>]*)?>/g, (m) => {
      if (/loading=\"lazy\"/.test(m)) return m
      return m.replace('<img', '<img loading="lazy" decoding="async"')
    })
    // 外链新窗口打开（保守：仅 http/https 且不含本站域名）
    .replace(/<a(\s+[^>]*href=\"(http[s]?:\/\/[^\"]+)\"[^>]*)>/g, (m, attrs, href) => {
      if (/zhanbing\.site/.test(href)) return m
      const hasTarget = /\starget=\"_blank\"/.test(attrs)
      const hasRel = /\srel=\"[^\"]+\"/.test(attrs)
      let out = `<a${attrs}`
      if (!hasTarget) out += ' target="_blank"'
      if (!hasRel) out += ' rel="noopener noreferrer"'
      out += '>'
      return out
    })

  // 获取相关文章（相同标签的其他文章）
  const allPosts = getSortedPostsData()
  const relatedPosts = allPosts
    .filter(post => 
      post.id !== id && 
      post.tags?.some(tag => postData.tags?.includes(tag))
    )
    .slice(0, 3)

  // 结构化数据 (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: postData.title,
    description: postData.excerpt || postData.title,
    image: ['https://zhanbing.site/og-image.svg'],
    author: {
      '@type': 'Person',
      name: 'zhanbing',
      url: 'https://zhanbing.site',
    },
    publisher: {
      '@type': 'Organization',
      name: 'zhanbing',
      logo: {
        '@type': 'ImageObject',
        url: 'https://zhanbing.site/og-image.svg',
      },
    },
    datePublished: postData.date,
    dateModified: postData.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://zhanbing.site/posts/${id}`,
    },
    keywords: postData.tags?.join(', ') || '',
    articleSection: 'Technology',
    inLanguage: 'zh-CN',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navigation />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-1 md:space-x-3">
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
                  <span className="ml-1 text-gray-500 md:ml-2">文章</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Main Grid: Article + Sidebar TOC */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Article */}
          <article className="lg:col-span-9 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Article Header */}
            <header className="p-8 pb-6 border-b border-gray-100">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {postData.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">占</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">zhanbing</div>
                    <time className="text-sm text-gray-500" dateTime={postData.date}>
                      {formatDate(postData.date)}
                    </time>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  约 {Math.max(1, postData.readingTime ?? 1)} 分钟阅读
                </div>
                
                {postData.tags && postData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {postData.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${encodeURIComponent(tag)}`}
                        className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm px-3 py-1 rounded-full transition-colors duration-200"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {postData.excerpt && (
                <p className="text-xl text-gray-600 leading-relaxed">
                  {postData.excerpt}
                </p>
              )}

              {/* Mobile TOC (collapsible) */}
              {headings.length > 0 && (
                <div className="mt-6 lg:hidden">
                  <details className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <summary className="cursor-pointer font-medium text-gray-900">目录</summary>
                    <nav className="mt-3 text-sm text-gray-700">
                      <ul className="space-y-2">
                        {headings.map(h => (
                          <li key={h.id} className={h.level === 3 ? 'ml-4' : ''}>
                            <a className="hover:text-blue-600" href={`#${h.id}`}>{h.text}</a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </details>
                </div>
              )}
            </header>

            {/* Article Content */}
            <div className="p-8">
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-r-lg"
                dangerouslySetInnerHTML={{ __html: enhancedHtml }}
              />
            </div>

            {/* Article Footer */}
            <footer className="p-8 pt-6 border-t border-gray-100 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-4 sm:mb-0">
                  <p className="text-sm text-gray-600">
                    喜欢这篇文章？分享给更多人吧！
                  </p>
                </div>
                <div className="flex space-x-4">
                  <ShareButton
                    title={postData.title}
                    excerpt={postData.excerpt || postData.title}
                    url={`https://zhanbing.site/posts/${id}`}
                  />
                </div>
              </div>
            </footer>
          </article>

          {/* Sidebar TOC (desktop) */}
          {headings.length > 0 && (
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-24">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-base font-semibold text-gray-900 mb-3">目录</h2>
                  <nav className="text-sm text-gray-700">
                    <ul className="space-y-2">
                      {headings.map(h => (
                        <li key={h.id} className={h.level === 3 ? 'ml-4' : ''}>
                          <a className="hover:text-blue-600" href={`#${h.id}`}>{h.text}</a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </aside>
          )}
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">相关文章</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map(({ id: relatedId, title, excerpt, date, tags }) => (
                  <article
                    key={relatedId}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 p-6"
                  >
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
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                      <Link href={`/posts/${relatedId}`}>
                        {title}
                      </Link>
                    </h3>
                    
                    {excerpt && (
                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                        {excerpt}
                      </p>
                    )}
                    
                    <Link
                      href={`/posts/${relatedId}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                    >
                      阅读全文
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <nav className="mt-16 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回首页
            </Link>
            <Link
              href="/tags"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              浏览标签
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
} 
