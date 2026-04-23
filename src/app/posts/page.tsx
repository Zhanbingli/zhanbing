import Link from 'next/link'
import { getSortedPostsData, type PostData } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { getLanguageSummary, getTrackClass, groupPostsByTrack } from '@/lib/content-map'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: 'Archive',
  description: 'Browse the full writing archive by theme and date.',
  alternates: {
    canonical: '/posts',
  },
}

function PostRow({ post }: { post: PostData }) {
  return (
    <article className="grid gap-3 border-t border-slate-200 py-5 sm:grid-cols-[128px_minmax(0,1fr)]">
      <div className="text-sm text-slate-500">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <p className="mt-1">{Math.max(1, post.readingTime ?? 1)} min read</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold leading-snug text-slate-950">
          <Link href={`/posts/${post.id}`} className="hover:text-[var(--accent)]">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags?.slice(0, 4).map((tag) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function PostsPage() {
  const allPostsData = getSortedPostsData()
  const trackGroups = groupPostsByTrack(allPostsData)
  const totalPosts = allPostsData.length
  const allTags = Array.from(new Set(allPostsData.flatMap((post: PostData) => post.tags || [])))
  const languageSummary = getLanguageSummary(allPostsData)
  const currentYear = new Date().getFullYear()
  const thisYearPosts = allPostsData.filter((post: PostData) => new Date(post.date).getFullYear() === currentYear).length

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 md:py-14">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Archive</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">A map of the work so far</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            The archive is organized by the problems that keep returning: AI as a working tool, learning through projects, medical knowledge systems, and writing as a way to act.
          </p>
        </header>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Posts', totalPosts],
            ['Tags', allTags.length],
            [`Published in ${currentYear}`, thisYearPosts],
            ['ZH / EN', `${languageSummary.zh} / ${languageSummary.en}`],
          ].map(([label, value]) => (
            <div key={label} className="border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p>
            </div>
          ))}
        </section>

        <div className="mt-12 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 border-l border-slate-200 pl-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Tracks</p>
              <nav className="mt-4 space-y-2 text-sm">
                {trackGroups.map(({ track, posts }) => (
                  <a key={track.id} href={`#${track.id}`} className="block text-slate-600 hover:text-[var(--accent)]">
                    {track.shortTitle} <span className="text-slate-400">({posts.length})</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="space-y-14">
            {trackGroups.map(({ track, posts }) => (
              <section key={track.id} id={track.id} className="scroll-mt-28">
                <div className="flex flex-col gap-3 border-b border-slate-300 pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className={`text-xs uppercase tracking-[0.2em] ${getTrackClass(track, 'text')}`}>
                      {track.eyebrow}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">{track.title}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{track.description}</p>
                  </div>
                  <span className={`w-fit rounded-full border px-3 py-1 text-xs ${getTrackClass(track, 'soft')}`}>
                    {posts.length} posts
                  </span>
                </div>

                <div>
                  {posts.map((post) => (
                    <PostRow key={post.id} post={post} />
                  ))}
                </div>
              </section>
            ))}

            {totalPosts === 0 && (
              <div className="border border-slate-200 bg-white p-8 text-center">
                <p className="text-xl font-semibold text-slate-900">No posts yet</p>
                <p className="mt-2 text-slate-600">Writing is in progress. New posts will show up here soon.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
