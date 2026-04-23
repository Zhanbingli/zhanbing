import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSortedPostsData } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { getDisplayTags, getPostTrack, getTrackClass } from '@/lib/content-map'
import Navigation from '@/components/Navigation'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)

  return {
    title: `Tag: ${decodedTag}`,
    description: `Browse all posts tagged "${decodedTag}".`,
    alternates: {
      canonical: `/tags/${encodeURIComponent(decodedTag)}`,
    },
  }
}

export async function generateStaticParams() {
  const allPostsData = getSortedPostsData()
  const allTags = Array.from(new Set(allPostsData.flatMap((post) => getDisplayTags(post.tags))))

  return allTags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }))
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const allPostsData = getSortedPostsData()
  const taggedPosts = allPostsData.filter((post) => post.tags?.includes(decodedTag))

  if (taggedPosts.length === 0) {
    notFound()
  }

  const relatedTags = Array.from(
    new Set(taggedPosts.flatMap((post) => getDisplayTags(post.tags)).filter((candidate) => candidate !== decodedTag))
  ).slice(0, 10)

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 md:py-14">
        <header className="max-w-3xl">
          <Link href="/tags" className="text-sm font-medium text-[var(--accent)] hover:underline">
            Back to topics
          </Link>
          <p className="mt-6 text-xs uppercase tracking-[0.24em] text-slate-500">Tag</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">{decodedTag}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {taggedPosts.length} post{taggedPosts.length === 1 ? '' : 's'} connected to this tag.
          </p>
        </header>

        <section className="mt-10">
          <ol className="divide-y divide-slate-200 border-y border-slate-200">
            {taggedPosts.map((post) => {
              const track = getPostTrack(post)
              return (
                <li key={post.id} className="grid gap-3 py-5 sm:grid-cols-[132px_minmax(0,1fr)]">
                  <div className="text-sm text-slate-500">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <p className="mt-1">{Math.max(1, post.readingTime ?? 1)} min read</p>
                  </div>
                  <article>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] ${getTrackClass(track, 'soft')}`}>
                        {track.shortTitle}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-semibold leading-snug text-slate-950">
                      <Link href={`/posts/${post.id}`} className="hover:text-[var(--accent)]">
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>}
                  </article>
                </li>
              )
            })}
          </ol>
        </section>

        {relatedTags.length > 0 && (
          <section className="mt-12 border-t border-slate-200 pt-6">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Related tags</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {relatedTags.map((relatedTag) => (
                <Link
                  key={relatedTag}
                  href={`/tags/${encodeURIComponent(relatedTag)}`}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  {relatedTag}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
