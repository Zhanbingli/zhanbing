import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'
import { getDisplayTags, getTrackClass, groupPostsByTrack } from '@/lib/content-map'
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
            const trackTags = Array.from(new Set(posts.flatMap((post) => getDisplayTags(post.tags)))).slice(0, 8)
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

      </main>
    </div>
  )
}
