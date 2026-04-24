import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import TableOfContents, { type TocHeading } from '@/components/TableOfContents'
import { getDisplayTags } from '@/lib/content-map'
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
  const displayTags = getDisplayTags(postData.tags)
  const readingTime = Math.max(1, postData.readingTime ?? 1)
  const showToc = headings.length >= 3

  const contentLanguage = detectContentLanguage(`${postData.title} ${postData.content}`)

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
      <div className="min-h-screen">
        <Navigation />

        <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 md:pt-14">
          <header className="mx-auto max-w-3xl">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-[var(--accent)]"
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

            <h1 className="mt-6 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              {postData.title}
            </h1>

            {postData.excerpt && (
              <p className="mt-5 text-lg leading-8 text-slate-600">{postData.excerpt}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <time dateTime={postData.date}>{formatDate(postData.date)}</time>
              <span>{readingTime} min read</span>
              {postData.updatedAt && postData.updatedAt !== postData.date && (
                <span>Updated {formatDate(postData.updatedAt)}</span>
              )}
            </div>

            {displayTags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {displayTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          {showToc && (
            <div className="mx-auto mt-8 max-w-3xl lg:hidden">
              <TableOfContents headings={headings} collapsible />
            </div>
          )}

          <div
            className={
              showToc
                ? 'mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_220px]'
                : 'mx-auto mt-10 max-w-3xl'
            }
          >
            <article className="min-w-0">
              <div className={showToc ? 'mx-auto max-w-3xl' : ''}>
                <div
                  className="post-prose prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: enhancedHtml }}
                />
              </div>
            </article>

            {showToc && (
              <aside className="hidden lg:block">
                <TableOfContents headings={headings} sticky />
              </aside>
            )}
          </div>

          {(previousPost || nextPost) && (
            <nav
              className="mx-auto mt-12 grid max-w-5xl gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2"
              aria-label="Post navigation"
            >
              {previousPost ? (
                <Link
                  href={`/posts/${previousPost.id}`}
                  className="rounded-xl border border-slate-200 p-4 transition hover:border-[var(--accent)]"
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Previous
                  </span>
                  <span className="mt-2 block font-medium leading-snug text-slate-950">
                    {previousPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextPost && (
                <Link
                  href={`/posts/${nextPost.id}`}
                  className="rounded-xl border border-slate-200 p-4 text-right transition hover:border-[var(--accent)]"
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Next</span>
                  <span className="mt-2 block font-medium leading-snug text-slate-950">
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
