import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import ReadingProgress from '@/components/ReadingProgress'
import ShareButton from '@/components/ShareButton'
import TableOfContents, { type TocHeading } from '@/components/TableOfContents'
import { getDisplayTags, getPostTrack, getTrackClass } from '@/lib/content-map'
import { getPostData, getSortedPostsData } from '@/lib/posts'
import { detectContentLanguage, formatDate } from '@/lib/utils'

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')

const normalizeComparableText = (text: string) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '')
    .trim()

function createEnhancedPostHtml(content: string, title: string) {
  const headings: TocHeading[] = []
  const headingIdCounts = new Map<string, number>()

  const nextHeadingId = (text: string) => {
    const base = slugify(text) || 'section'
    const count = headingIdCounts.get(base) ?? 0
    headingIdCounts.set(base, count + 1)
    return count === 0 ? base : `${base}-${count + 1}`
  }

  const contentWithoutDuplicateTitle = content.replace(
    /^\s*<h([1-3])(.*?)>([\s\S]*?)<\/h\1>\s*/,
    (match, _level, _attrs, inner) =>
      normalizeComparableText(String(inner)) === normalizeComparableText(title) ? '' : match
  )

  const enhancedHtml = contentWithoutDuplicateTitle
    .replace(/<h([23])(.*?)>([\s\S]*?)<\/h\1>/g, (_match, level, attrs, inner) => {
      const cleanText = String(inner).replace(/<[^>]+>/g, '').trim()
      const existingId = String(attrs).match(/\sid="([^"]+)"/)?.[1]
      const idVal = existingId ?? nextHeadingId(cleanText)

      headings.push({ id: idVal, text: cleanText, level: Number(level) })

      const nextAttrs = existingId ? attrs : `${attrs} id="${idVal}"`
      return `<h${level}${nextAttrs}>${inner}</h${level}>`
    })
    .replace(/<img(\s+[^>]*)?>/g, (match) => {
      if (/loading="lazy"/.test(match)) return match
      return match.replace('<img', '<img loading="lazy" decoding="async"')
    })
    .replace(/<a(\s+[^>]*href="(http[s]?:\/\/[^"]+)"[^>]*)>/g, (match, attrs, href) => {
      if (/zhanbing\.site/.test(href)) return match

      const hasTarget = /\starget="_blank"/.test(attrs)
      const hasRel = /\srel="[^"]+"/.test(attrs)
      let output = `<a${attrs}`

      if (!hasTarget) output += ' target="_blank"'
      if (!hasRel) output += ' rel="noopener noreferrer"'

      output += '>'
      return output
    })

  return { enhancedHtml, headings }
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
        modifiedTime: postData.updatedAt ?? postData.date,
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

  const { enhancedHtml, headings } = createEnhancedPostHtml(postData.content, postData.title)
  const allPosts = getSortedPostsData()
  const currentIndex = allPosts.findIndex((post) => post.id === id)
  const previousPost = currentIndex >= 0 ? allPosts[currentIndex + 1] : undefined
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined
  const track = getPostTrack(postData)
  const displayTags = getDisplayTags(postData.tags)
  const relatedPosts = allPosts
    .filter((post) => post.id !== id && getPostTrack(post).id === track.id)
    .slice(0, 3)

  const contentLanguage = detectContentLanguage(`${postData.title} ${postData.content}`)
  const readingTime = Math.max(1, postData.readingTime ?? 1)
  const articleMeta = [
    {
      label: 'Published',
      value: formatDate(postData.date),
    },
    ...(postData.updatedAt && postData.updatedAt !== postData.date
      ? [
          {
            label: 'Updated',
            value: formatDate(postData.updatedAt),
          },
        ]
      : []),
    {
      label: 'Reading time',
      value: `${readingTime} min`,
    },
    {
      label: 'Language',
      value: contentLanguage === 'zh-CN' ? '中文为主' : 'English first',
    },
    {
      label: 'Sections',
      value: String(Math.max(headings.length, 1)),
    },
  ]

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
    dateModified: postData.updatedAt ?? postData.date,
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
      <div className="min-h-screen overflow-x-clip">
        <Navigation />
        <ReadingProgress />

        <main className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 md:pt-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[24rem] bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.16),transparent_42%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.78),rgba(247,248,251,0))]"
          />

          <header className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_30px_80px_-56px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8 lg:p-10">
            <div
              aria-hidden
              className="absolute right-[-4rem] top-[-6rem] h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.18),rgba(20,184,166,0))]"
            />
            <div
              aria-hidden
              className="absolute bottom-[-5rem] left-[-3rem] h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(148,163,184,0.12),rgba(148,163,184,0))]"
            />

            <div className="relative">
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/80 px-4 py-2 text-sm text-slate-700 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to posts
              </Link>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
                <span className={`rounded-full border px-3 py-1 ${getTrackClass(track, 'soft')}`}>
                  {track.shortTitle}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-600">
                  Article
                </span>
                {displayTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-slate-600 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-slate-950 sm:text-5xl">
                {postData.title}
              </h1>

              {postData.excerpt && (
                <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 sm:text-[1.2rem]">
                  {postData.excerpt}
                </p>
              )}

              <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
                <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                  {articleMeta.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-3"
                    >
                      <dt className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                        {item.label}
                      </dt>
                      <dd className="mt-2 text-sm font-medium text-slate-900">{item.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                    Reading context
                  </p>
                  <p className="mt-3 text-base font-semibold text-slate-900">{track.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{track.thesis}</p>
                  <Link
                    href={`/posts#${track.id}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
                  >
                    Browse this track
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </header>

          {headings.length > 0 && (
            <TableOfContents headings={headings} className="mt-6 block lg:hidden" collapsible />
          )}

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
            <article className="min-w-0">
              <div className="rounded-[2rem] border border-slate-200/80 bg-white px-5 py-8 shadow-[0_28px_70px_-56px_rgba(15,23,42,0.55)] sm:px-8 lg:px-10 lg:py-10">
                <div className="mb-6 flex items-start gap-3 border-b border-slate-200 pb-4 text-sm text-slate-600">
                  <span
                    aria-hidden
                    className={`mt-1.5 h-2.5 w-2.5 rounded-full ${getTrackClass(track, 'bg')}`}
                  />
                  <p className="leading-6">
                    Structured as {Math.max(headings.length, 1)} section
                    {headings.length === 1 ? '' : 's'} for slow reading or fast scanning.
                  </p>
                </div>

                <div
                  className="post-prose prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: enhancedHtml }}
                />
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm lg:hidden">
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  Share this post
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  If it was useful, send it to someone who would actually use it.
                </p>
                <ShareButton
                  className="mt-4 w-full"
                  title={postData.title}
                  excerpt={postData.excerpt || postData.title}
                  url={`https://zhanbing.site/posts/${id}`}
                />
              </div>
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-4">
                <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/95 p-5 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.4)] backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Track</p>
                  <p className="mt-3 text-base font-semibold text-slate-900">{track.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{track.description}</p>
                  <Link
                    href={`/posts#${track.id}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
                  >
                    Open archive path
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>

                <div className="rounded-[1.5rem] border border-slate-200/80 bg-white/95 p-5 shadow-[0_24px_60px_-44px_rgba(15,23,42,0.4)] backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Share</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Keep a copy, or pass it to the next person who needs it.
                  </p>
                  <ShareButton
                    className="mt-4 w-full"
                    title={postData.title}
                    excerpt={postData.excerpt || postData.title}
                    url={`https://zhanbing.site/posts/${id}`}
                  />
                </div>

                {headings.length > 0 && <TableOfContents headings={headings} sticky />}
              </div>
            </aside>
          </div>

          {relatedPosts.length > 0 && (
            <section className="mt-14">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                    Continue in this track
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">{track.title}</h2>
                </div>
                <Link
                  href={`/posts#${track.id}`}
                  className="text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  View all related posts
                </Link>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {relatedPosts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <p className="text-xs text-slate-500">{formatDate(post.date)}</p>
                    <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-950">
                      <Link href={`/posts/${post.id}`} className="hover:text-[var(--accent)]">
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {post.excerpt}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {(previousPost || nextPost) && (
            <nav
              className="mt-12 grid gap-4 border-y border-slate-200 py-6 sm:grid-cols-2"
              aria-label="Post navigation"
            >
              {previousPost ? (
                <Link
                  href={`/posts/${previousPost.id}`}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[var(--accent)] hover:shadow-md"
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Previous
                  </span>
                  <span className="mt-3 block font-semibold leading-snug text-slate-950">
                    {previousPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextPost && (
                <Link
                  href={`/posts/${nextPost.id}`}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-right shadow-sm transition hover:border-[var(--accent)] hover:shadow-md"
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Next</span>
                  <span className="mt-3 block font-semibold leading-snug text-slate-950">
                    {nextPost.title}
                  </span>
                </Link>
              )}
            </nav>
          )}
        </main>
      </div>
    </>
  )
}
