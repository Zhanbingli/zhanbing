import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'
import { getTrackClass, groupPostsByTrack } from '@/lib/content-map'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: 'Topics',
  description: 'Browse the site by writing tracks and tags.',
  alternates: {
    canonical: '/tags',
  },
}

export default function TagsPage() {
  const allPostsData = getSortedPostsData()
  const trackGroups = groupPostsByTrack(allPostsData)
  const tagCounts = allPostsData.reduce((acc, post) => {
    post.tags?.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const sortedTags = Object.entries(tagCounts).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1]
    return a[0].localeCompare(b[0])
  })

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 md:py-14">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Topics</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">Themes before tags</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Tags are useful, but the stronger structure is the set of questions behind the writing. Start with a track, then use tags to narrow the archive.
          </p>
        </header>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          {trackGroups.map(({ track, posts }) => {
            const trackTags = Array.from(new Set(posts.flatMap((post) => post.tags || []))).slice(0, 8)
            return (
              <article key={track.id} className="border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`mb-4 h-1.5 w-16 ${getTrackClass(track, 'bg')}`} aria-hidden />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{track.eyebrow}</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">{track.title}</h2>
                  </div>
                  <Link
                    href={`/posts#${track.id}`}
                    className={`rounded-full border px-3 py-1 text-xs ${getTrackClass(track, 'soft')}`}
                  >
                    {posts.length} posts
                  </Link>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{track.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {trackTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </article>
            )
          })}
        </section>

        <section className="mt-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">All tags</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">{sortedTags.length} tags in use</h2>
            </div>
            <Link href="/search" className="text-sm font-medium text-[var(--accent)] hover:underline">
              Search all posts
            </Link>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedTags.map(([tag, count]) => (
              <li key={tag}>
                <Link
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="flex items-center justify-between border border-slate-200 bg-white px-4 py-3 text-slate-800 shadow-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <span className="font-medium">{tag}</span>
                  <span className="text-sm text-slate-500">{count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
