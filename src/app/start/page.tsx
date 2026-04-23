import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { getSortedPostsData } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import {
  activeProjects,
  getPostTrack,
  getPostsBySlugs,
  getTrackById,
  getTrackClass,
  readingPaths,
  writingTracks,
} from '@/lib/content-map'

export const metadata = {
  title: 'Start Here',
  description: 'A guided path through the main ideas, projects, and writing tracks on this site.',
  alternates: {
    canonical: '/start',
  },
}

export default function StartPage() {
  const posts = getSortedPostsData()
  const newestPost = posts[0]

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 md:py-14">
        <header className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Start here</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
              A guided route through the knowledge base.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              This site is organized around a question: how can a medical student use AI tools, writing, and project work to build durable personal knowledge instead of collecting scattered notes?
            </p>
          </div>

          <aside className="border-l-4 border-[var(--accent)] bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Best entry point</p>
            {newestPost && (
              <>
                <Link href={`/posts/${newestPost.id}`} className="mt-3 block text-lg font-semibold leading-snug text-slate-950 hover:text-[var(--accent)]">
                  {newestPost.title}
                </Link>
                <p className="mt-2 text-sm text-slate-500">{formatDate(newestPost.date)}</p>
                {newestPost.excerpt && <p className="mt-3 text-sm leading-6 text-slate-600">{newestPost.excerpt}</p>}
              </>
            )}
          </aside>
        </header>

        <section className="mt-14">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Reading paths</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Choose a path by intent</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {readingPaths.map((path) => {
              const pathPosts = getPostsBySlugs(posts, path.postSlugs)
              return (
                <section key={path.id} className="border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-xl font-semibold text-slate-950">{path.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{path.description}</p>
                  <ol className="mt-5 space-y-3">
                    {pathPosts.map((post, index) => {
                      const track = getPostTrack(post)
                      return (
                        <li key={post.id} className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 border-t border-slate-100 pt-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                            {index + 1}
                          </span>
                          <div>
                            <Link href={`/posts/${post.id}`} className="font-medium leading-snug text-slate-950 hover:text-[var(--accent)]">
                              {post.title}
                            </Link>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className={`rounded-full border px-2 py-0.5 text-[11px] ${getTrackClass(track, 'soft')}`}>
                                {track.shortTitle}
                              </span>
                              <time dateTime={post.date} className="text-xs text-slate-500">
                                {formatDate(post.date)}
                              </time>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                </section>
              )
            })}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current projects</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">What the notes are orbiting</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {activeProjects.map((project) => {
              const track = getTrackById(project.trackId)
              const projectPosts = getPostsBySlugs(posts, project.postSlugs)
              return (
                <article key={project.title} className="border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-xs ${getTrackClass(track, 'soft')}`}>
                      {project.status}
                    </span>
                    <Link href={`/posts#${track.id}`} className="text-xs font-medium text-[var(--accent)] hover:underline">
                      {track.shortTitle}
                    </Link>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-950">{project.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{project.description}</p>
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                    {projectPosts.map((post) => (
                      <Link key={post.id} href={`/posts/${post.id}`} className="block text-sm font-medium text-slate-800 hover:text-[var(--accent)]">
                        {post.title}
                      </Link>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="mt-16 border-t border-slate-200 pt-8">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Site structure</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">The four writing tracks</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            {writingTracks.map((track) => (
              <Link key={track.id} href={`/posts#${track.id}`} className="border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className={`mb-4 h-1.5 w-14 ${getTrackClass(track, 'bg')}`} aria-hidden />
                <h3 className="font-semibold leading-snug text-slate-950">{track.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{track.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
