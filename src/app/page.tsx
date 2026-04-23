import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import {
  getFeaturedPosts,
  getLanguageSummary,
  getPostTrack,
  getTrackClass,
  groupPostsByTrack,
} from '@/lib/content-map'
import Navigation from '@/components/Navigation'

export default function Home() {
  const allPostsData = getSortedPostsData()
  const latestUpdate = allPostsData[0]?.date
  const featuredPosts = getFeaturedPosts(allPostsData)
  const trackGroups = groupPostsByTrack(allPostsData)
  const recentPosts = allPostsData.slice(0, 8)
  const languageSummary = getLanguageSummary(allPostsData)
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 md:py-14">
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Personal knowledge site</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              Learning in public through AI tools, medical knowledge, and writing practice.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              This blog is a working notebook about turning curiosity into systems: using AI to build, using writing to think, and using medical context to keep the work grounded.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#115e59]"
              >
                Browse the archive
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Search notes
              </Link>
            </div>
          </div>

          <aside className="border-l-4 border-[var(--accent)] bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current shape</p>
            <dl className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-slate-500">Posts</dt>
                <dd className="mt-1 text-3xl font-semibold text-slate-950">{allPostsData.length}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Tracks</dt>
                <dd className="mt-1 text-3xl font-semibold text-slate-950">{trackGroups.length}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Chinese</dt>
                <dd className="mt-1 text-2xl font-semibold text-slate-950">{languageSummary.zh}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">English</dt>
                <dd className="mt-1 text-2xl font-semibold text-slate-950">{languageSummary.en}</dd>
              </div>
            </dl>
            {latestUpdate && (
              <p className="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-600">
                Latest update: <span className="font-medium text-slate-900">{formatDate(latestUpdate)}</span>
              </p>
            )}
          </aside>
        </section>

        <section className="mt-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Start here</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Four posts that explain the site</h2>
            </div>
            <Link href="/posts" className="text-sm font-medium text-[var(--accent)] hover:underline">
              Full archive
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {featuredPosts.map((post) => {
              const track = getPostTrack(post)
              return (
                <article key={post.id} className="border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className={`rounded-full border px-2.5 py-1 ${getTrackClass(track, 'soft')}`}>
                      {track.shortTitle}
                    </span>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold leading-snug text-slate-950">
                    <Link href={`/posts/${post.id}`} className="hover:text-[var(--accent)]">
                      {post.title}
                    </Link>
                  </h3>
                  {post.excerpt && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                  )}
                </article>
              )
            })}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Writing map</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">The recurring questions</h2>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {trackGroups.map(({ track, posts }) => (
              <section key={track.id} id={track.id} className="border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`mb-4 h-1.5 w-16 ${getTrackClass(track, 'bg')}`} aria-hidden />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{track.eyebrow}</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-950">{track.title}</h3>
                  </div>
                  <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
                    {posts.length} posts
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{track.thesis}</p>
                <ul className="mt-5 space-y-3">
                  {posts.slice(0, 3).map((post) => (
                    <li key={post.id} className="border-t border-slate-100 pt-3">
                      <Link href={`/posts/${post.id}`} className="font-medium leading-snug text-slate-900 hover:text-[var(--accent)]">
                        {post.title}
                      </Link>
                      <p className="mt-1 text-xs text-slate-500">{formatDate(post.date)}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Latest log</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Recent notes</h2>
              </div>
              <Link href="/feed.xml" className="text-sm font-medium text-[var(--accent)] hover:underline">
                RSS
              </Link>
            </div>
            <ol className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
              {recentPosts.map((post) => {
                const track = getPostTrack(post)
                return (
                  <li key={post.id} className="grid gap-3 py-4 sm:grid-cols-[120px_minmax(0,1fr)]">
                    <time dateTime={post.date} className="text-sm text-slate-500">
                      {formatDate(post.date)}
                    </time>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/posts/${post.id}`} className="font-semibold leading-snug text-slate-950 hover:text-[var(--accent)]">
                          {post.title}
                        </Link>
                        <span className={`rounded-full border px-2 py-0.5 text-[11px] ${getTrackClass(track, 'soft')}`}>
                          {track.shortTitle}
                        </span>
                      </div>
                      {post.excerpt && <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>

          <aside className="border-t border-slate-200 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Site promise</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Notes stay close to actual practice: tools tried, projects built, mistakes made, and thoughts revised in public.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <Link href="/about" className="text-[var(--accent)] hover:underline">
                About
              </Link>
              <Link href="/tags" className="text-[var(--accent)] hover:underline">
                Tags
              </Link>
              <a href="https://github.com/Zhanbingli" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
                GitHub
              </a>
            </div>
          </aside>
        </section>

        <footer className="mt-14 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>© {currentYear} Zhanbing Li. Writing, building, and revising in public.</p>
        </footer>
      </main>
    </div>
  )
}
