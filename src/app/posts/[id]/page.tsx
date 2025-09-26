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
      <div className="min-h-screen bg-white text-slate-900">
        <Navigation />
        <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
            <article className="space-y-12">
              <header className="relative space-y-8">
                <div className="absolute -inset-x-12 -top-12 h-32 bg-slate-100/60 blur-3xl"></div>
                <div className="relative space-y-6">
                  <p className="text-xs uppercase tracking-[0.45em] text-slate-400">Reading</p>
                  <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
                    {postData.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <div className="inline-flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-slate-100 text-sm font-medium">
                        占
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">zhanbing</span>
                        <time className="text-xs uppercase tracking-wide" dateTime={postData.date}>
                          {formatDate(postData.date)}
                        </time>
                      </div>
                    </div>
                    <span className="relative pl-4">
                      <span className="absolute left-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-slate-300"></span>
                      约 {Math.max(1, postData.readingTime ?? 1)} 分钟阅读
                    </span>
                  </div>
                  {postData.excerpt && (
                    <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
                      {postData.excerpt}
                    </p>
                  )}
                </div>

                {headings.length > 0 && (
                  <details className="relative block rounded-xl border border-slate-200 px-5 py-4 text-sm text-slate-600 shadow-sm transition lg:hidden">
                    <summary className="cursor-pointer list-none font-medium text-slate-700">章节导航</summary>
                    <nav className="mt-4 space-y-2">
                      {headings.map((h) => (
                        <a key={h.id} className={`block hover:text-slate-900 transition ${h.level === 3 ? 'pl-4 text-slate-500' : ''}`} href={`#${h.id}`}>
                          {h.text}
                        </a>
                      ))}
                    </nav>
                  </details>
                )}
              </header>

              <div
                className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-slate-900 prose-a:text-slate-900 prose-a:underline-offset-4 hover:prose-a:text-slate-600 prose-code:text-indigo-600 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-slate-950 prose-pre:text-slate-100 prose-blockquote:border-l-4 prose-blockquote:border-slate-900/20 prose-blockquote:bg-slate-100/60 prose-blockquote:py-1.5 prose-blockquote:px-4"
                dangerouslySetInnerHTML={{ __html: enhancedHtml }}
              />

              <footer className="space-y-4 border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-500">喜欢这篇文章？分享给朋友是对作者最大的鼓励。</p>
                <ShareButton
                  title={postData.title}
                  excerpt={postData.excerpt || postData.title}
                  url={`https://zhanbing.site/posts/${id}`}
                />
                <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                  <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 hover:border-slate-900 hover:text-slate-900 transition">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    返回首页
                  </Link>
                </div>
              </footer>

              {relatedPosts.length > 0 && (
                <section className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900">更多延伸阅读</h2>
                  <ul className="space-y-4">
                    {relatedPosts.map(({ id: relatedId, title, excerpt, date }) => (
                      <li key={relatedId} className="group flex flex-col gap-1 border-l-2 border-transparent pl-4 transition hover:border-slate-900">
                        <time className="text-xs uppercase tracking-widest text-slate-400" dateTime={date}>
                          {formatDate(date)}
                        </time>
                        <Link href={`/posts/${relatedId}`} className="text-lg font-medium text-slate-800 group-hover:text-slate-900">
                          {title}
                        </Link>
                        {excerpt && <p className="text-sm text-slate-500">{excerpt}</p>}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </article>

            {headings.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-28 space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">章节</p>
                  <nav className="border-l border-slate-200 pl-4 text-sm text-slate-500 space-y-2">
                    {headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        className={`block transition hover:text-slate-900 ${h.level === 3 ? 'pl-4 text-slate-400' : ''}`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
