import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { getSortedPostsData } from '@/lib/posts'
import {
  activeProjects,
  getPostsBySlugs,
  getTrackById,
  getTrackClass,
  writingTracks,
} from '@/lib/content-map'
import { formatDate } from '@/lib/utils'

export const metadata = {
  title: 'Projects',
  description: 'Long-running projects behind the notes: AI tools, medical knowledge systems, and learning workflows.',
  alternates: {
    canonical: '/projects',
  },
}

export default function ProjectsPage() {
  const posts = getSortedPostsData()

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 md:py-14">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Projects</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
            The working systems behind the writing.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            These are not portfolio case studies. They are ongoing knowledge systems: tools, habits, and experiments that turn reading, clinical learning, and AI work into durable output.
          </p>
        </header>

        <section className="mt-12 grid gap-5 lg:grid-cols-2">
          {activeProjects.map((project) => {
            const track = getTrackById(project.trackId)
            const projectPosts = getPostsBySlugs(posts, project.postSlugs)
            return (
              <article key={project.title} className="border border-slate-200 bg-white p-6 shadow-sm">
                <div className={`mb-5 h-1.5 w-16 ${getTrackClass(track, 'bg')}`} aria-hidden />
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-xs ${getTrackClass(track, 'soft')}`}>
                    {project.status}
                  </span>
                  <Link href={`/posts#${track.id}`} className="text-xs font-medium text-[var(--accent)] hover:underline">
                    {track.title}
                  </Link>
                </div>
                <h2 className="mt-4 text-2xl font-semibold leading-snug text-slate-950">{project.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{project.description}</p>

                <div className="mt-6 border-t border-slate-200 pt-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Project notes</p>
                  <ol className="mt-4 space-y-3">
                    {projectPosts.map((post) => (
                      <li key={post.id}>
                        <Link href={`/posts/${post.id}`} className="font-medium leading-snug text-slate-950 hover:text-[var(--accent)]">
                          {post.title}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">{formatDate(post.date)}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </article>
            )
          })}
        </section>

        <section className="mt-16 border-t border-slate-200 pt-8">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Project map</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">How projects connect to tracks</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-4">
            {writingTracks.map((track) => (
              <Link
                key={track.id}
                href={`/posts#${track.id}`}
                className="border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`mb-4 h-1.5 w-14 ${getTrackClass(track, 'bg')}`} aria-hidden />
                <h3 className="font-semibold leading-snug text-slate-950">{track.shortTitle}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{track.thesis}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
