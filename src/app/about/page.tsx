import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: 'About',
  description: 'About Zhanbing Li and the direction behind this blog.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <header className="text-center space-y-5">
          <div className="relative w-28 h-28 mx-auto rounded-full border border-slate-200 shadow-sm overflow-hidden">
            <Image
              src="/lizhanbing.png"
              alt="zhanbing avatar"
              fill
              sizes="128px"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">About</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">Hi, I&apos;m Zhanbing Li</h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              A medical student and builder using writing to understand AI tools, personal knowledge systems, programming practice, and the discipline of taking action.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          <section className="border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">What I care about</h2>
            <p className="text-slate-600 leading-relaxed">
              I care about practical systems: AI agents that help with real work, medical knowledge that can be searched and reused, and learning methods that survive contact with actual projects.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3 bg-white">
                <p className="text-sm text-slate-500">Current focus</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  <li>• Building personal workflows with Obsidian, Zotero, OpenCode, and LLMs</li>
                  <li>• Learning TypeScript, Python, R, and frontend systems through projects</li>
                  <li>• Turning scattered reading and clinical knowledge into durable notes</li>
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 bg-white">
                <p className="text-sm text-slate-500">Typical stack</p>
                <ul className="mt-2 flex flex-wrap gap-2 text-sm">
                  {['TypeScript', 'React', 'Next.js', 'Tailwind', 'Vite', 'ESLint', 'Jest'].map((item) => (
                    <li key={item} className="rounded-full border border-slate-200 px-2.5 py-1 bg-slate-50 text-slate-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">What this blog is for</h2>
            <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
              <p className="rounded-lg border border-slate-200 p-3 bg-white">
                This is not a polished tutorial site. It is a long-running record of experiments: what I tried, where I got stuck, and how tools changed my next action.
              </p>
              <p className="rounded-lg border border-slate-200 p-3 bg-white">
                The technical setup stays intentionally simple: Markdown, static output, RSS, search, and a theme map that keeps the archive connected as it grows.
              </p>
            </div>
          </section>

          <section className="border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Find me here</h2>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/Zhanbingli"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                GitHub
              </a>
              <a
                href="mailto:contact@zhanbing.site"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Email
              </a>
              <Link
                href="/feed.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                RSS Feed
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
} 
