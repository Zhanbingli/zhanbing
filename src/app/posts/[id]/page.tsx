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
      <div className="min-h-screen">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-6 py-10 md:py-14 space-y-10">
          <header className="space-y-4">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回文章列表
            </Link>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Article</p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 leading-snug">
              {postData.title}
            </h1>
            {postData.excerpt && (
              <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
                {postData.excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <time dateTime={postData.date}>{formatDate(postData.date)}</time>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" aria-hidden />
                约 {Math.max(1, postData.readingTime ?? 1)} 分钟阅读
              </span>
              {postData.tags?.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </header>

          {headings.length > 0 && (
            <div className="block lg:hidden rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">目录</p>
              <nav className="space-y-2 text-sm text-slate-600">
                {headings.map((h) => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className={`block rounded-lg px-2 py-1 transition hover:bg-slate-100 ${h.level === 3 ? 'pl-4 text-slate-500' : ''}`}
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
            <article className="rounded-2xl border border-slate-200 bg-white/95 p-6 md:p-8 shadow-sm">
              <div
                className="prose max-w-none sm:prose-lg prose-headings:font-semibold prose-headings:text-slate-900 prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:text-[#0c316f] prose-code:text-[var(--accent)] prose-code:bg-[var(--accent-soft)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-slate-950 prose-pre:text-slate-100 prose-blockquote:border-l-4 prose-blockquote:border-[var(--accent)]/60 prose-blockquote:bg-[var(--accent-soft)] prose-blockquote:py-1.5 prose-blockquote:px-4"
                dangerouslySetInnerHTML={{ __html: enhancedHtml }}
              />

              <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600">喜欢这篇文章？分享给朋友是对作者最大的鼓励。</p>
                <ShareButton
                  title={postData.title}
                  excerpt={postData.excerpt || postData.title}
                  url={`https://zhanbing.site/posts/${id}`}
                />
              </div>
            </article>

            {headings.length > 0 && (
              <aside className="hidden lg:block lg:sticky lg:top-28 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500 mb-2">目录</p>
                <nav className="space-y-2 text-sm text-slate-600">
                  {headings.map((h) => (
                    <a
                      key={h.id}
                      href={`#${h.id}`}
                      className={`block rounded-lg px-2 py-1 transition hover:bg-slate-100 hover:text-slate-900 ${h.level === 3 ? 'pl-4 text-slate-500' : ''}`}
                    >
                      {h.text}
                    </a>
                  ))}
                </nav>
              </aside>
            )}
          </div>

          {relatedPosts.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 md:p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-slate-900">延伸阅读</h2>
                <Link href="/posts" className="text-sm font-medium text-[var(--accent)] hover:underline">
                  所有文章
                </Link>
              </div>
              <ul className="space-y-3">
                {relatedPosts.map(({ id: relatedId, title, excerpt, date }) => (
                  <li key={relatedId} className="rounded-xl border border-slate-100 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:shadow-sm">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" aria-hidden />
                      <time dateTime={date}>{formatDate(date)}</time>
                    </div>
                    <Link href={`/posts/${relatedId}`} className="mt-2 block text-lg font-semibold text-slate-900 hover:text-[var(--accent)]">
                      {title}
                    </Link>
                    {excerpt && <p className="mt-1 text-sm text-slate-600 leading-relaxed">{excerpt}</p>}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </>
  )
}
