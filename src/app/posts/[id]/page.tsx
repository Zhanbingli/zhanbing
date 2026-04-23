import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostData, getSortedPostsData } from '@/lib/posts'
import { detectContentLanguage, formatDate } from '@/lib/utils'
import Navigation from '@/components/Navigation'
import ShareButton from '@/components/ShareButton'
import TableOfContents, { type TocHeading } from '@/components/TableOfContents'
import { getPostTrack, getTrackClass } from '@/lib/content-map'
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
      description: postData.excerpt || `Read "${postData.title}"`,
      keywords: postData.tags?.join(', ') || '',
      authors: [{ name: 'Zhanbing Li', url: baseUrl }],
      openGraph: {
        title: postData.title,
        description: postData.excerpt || `Read "${postData.title}"`,
        type: 'article',
        publishedTime: postData.date,
        authors: ['Zhanbing Li'],
        tags: postData.tags,
        url: `${baseUrl}/posts/${id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: postData.title,
        description: postData.excerpt || `Read "${postData.title}"`,
      },
      alternates: {
        canonical: `/posts/${id}`,
      },
    }
  } catch {
    return {
      title: 'Post not found',
      description: 'The post you requested does not exist or has been removed.',
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

  // Basic TOC generation and content enhancements (inject ids into h2/h3; add lazy images)
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-')

  const headings: TocHeading[] = []

  const enhancedHtml = postData.content
    // Extract h2/h3 and inject ids
    .replace(/<h([23])(.*?)>([\s\S]*?)<\/h\1>/g, (_m, lvl, attrs, inner) => {
      const cleanText = String(inner).replace(/<[^>]+>/g, '').trim()
      const idVal = slugify(cleanText)
      headings.push({ id: idVal, text: cleanText, level: Number(lvl) })
      const hasId = /\sid=\".*?\"/.test(attrs)
      const newAttrs = hasId ? attrs : `${attrs} id="${idVal}"`
      return `<h${lvl}${newAttrs}>${inner}</h${lvl}>`
    })
    // Lazy-load images
    .replace(/<img(\s+[^>]*)?>/g, (m) => {
      if (/loading=\"lazy\"/.test(m)) return m
      return m.replace('<img', '<img loading="lazy" decoding="async"')
    })
    // Open external links in new tab (http/https and not this domain)
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

  const allPosts = getSortedPostsData()
  const currentIndex = allPosts.findIndex((post) => post.id === id)
  const previousPost = currentIndex >= 0 ? allPosts[currentIndex + 1] : undefined
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined
  const track = getPostTrack(postData)

  // Fetch related posts (shared tags)
  const relatedPosts = allPosts
    .filter(post => 
      post.id !== id && 
      post.tags?.some(tag => postData.tags?.includes(tag))
    )
    .slice(0, 3)
  const contentLanguage = detectContentLanguage(`${postData.title} ${postData.content}`)

  // Structured data (JSON-LD)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: postData.title,
    description: postData.excerpt || postData.title,
    image: ['https://zhanbing.site/og-image.svg'],
    author: {
      '@type': 'Person',
      name: 'Zhanbing Li',
      url: 'https://zhanbing.site',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Zhanbing Li',
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
    inLanguage: contentLanguage,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen">
        <Navigation />
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 md:py-14">
          <header className="max-w-3xl space-y-4">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to posts
            </Link>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Post</p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 leading-snug">
              {postData.title}
            </h1>
            {postData.excerpt && (
              <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
                {postData.excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <Link
                href={`/posts#${track.id}`}
                className={`rounded-full border px-3 py-1 text-xs ${getTrackClass(track, 'soft')}`}
              >
                {track.shortTitle}
              </Link>
              <time dateTime={postData.date}>{formatDate(postData.date)}</time>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" aria-hidden />
                {Math.max(1, postData.readingTime ?? 1)} min read
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
            <TableOfContents headings={headings} className="block lg:hidden" collapsible />
          )}

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
            <article className="min-w-0">
              <div
                className="prose max-w-none sm:prose-lg prose-headings:font-semibold prose-headings:text-slate-900 prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:text-[#115e59] prose-code:text-[var(--accent)] prose-code:bg-[var(--accent-soft)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-slate-950 prose-pre:text-slate-100 prose-blockquote:border-l-4 prose-blockquote:border-[var(--accent)]/60 prose-blockquote:bg-[var(--accent-soft)] prose-blockquote:py-1.5 prose-blockquote:px-4"
                dangerouslySetInnerHTML={{ __html: enhancedHtml }}
              />

              <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600">If this post was useful, share it with someone who might need it.</p>
                <ShareButton
                  title={postData.title}
                  excerpt={postData.excerpt || postData.title}
                  url={`https://zhanbing.site/posts/${id}`}
                />
              </div>
            </article>

            {headings.length > 0 && (
              <aside className="hidden lg:block">
                <TableOfContents headings={headings} sticky />
              </aside>
            )}
          </div>

          {(previousPost || nextPost) && (
            <nav className="mt-12 grid gap-4 border-y border-slate-200 py-6 sm:grid-cols-2" aria-label="Post navigation">
              {previousPost ? (
                <Link href={`/posts/${previousPost.id}`} className="block border border-slate-200 bg-white p-4 shadow-sm hover:border-[var(--accent)]">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Previous</span>
                  <span className="mt-2 block font-semibold leading-snug text-slate-950">{previousPost.title}</span>
                </Link>
              ) : (
                <div />
              )}
              {nextPost && (
                <Link href={`/posts/${nextPost.id}`} className="block border border-slate-200 bg-white p-4 text-right shadow-sm hover:border-[var(--accent)]">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Next</span>
                  <span className="mt-2 block font-semibold leading-snug text-slate-950">{nextPost.title}</span>
                </Link>
              )}
            </nav>
          )}

          {relatedPosts.length > 0 && (
            <section className="mt-12 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-slate-900">Related posts</h2>
                <Link href="/posts" className="text-sm font-medium text-[var(--accent)] hover:underline">
                  All posts
                </Link>
              </div>
              <ul className="grid gap-4 md:grid-cols-3">
                {relatedPosts.map(({ id: relatedId, title, excerpt, date }) => (
                  <li key={relatedId} className="border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-sm">
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
