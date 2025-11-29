import Image from 'next/image'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: 'About Me',
  description: 'Learn more about zhanbing and this tech blog.',
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
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">About</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">Hi, I’m zhanbing</h1>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Frontend engineer who enjoys lean products, clear writing, and sharing what I learn.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">What I’m into</h2>
            <p className="text-slate-600 leading-relaxed">
              Building clean, maintainable frontends. Exploring better ways to ship static sites,
              structure content, and keep performance sharp without over-engineering.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-3 bg-white">
                <p className="text-sm text-slate-500">Currently</p>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  <li>• Writing about Next.js and learning workflows</li>
                  <li>• Tweaking UI polish and accessibility</li>
                  <li>• Keeping this blog fast and low-friction</li>
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 p-3 bg-white">
                <p className="text-sm text-slate-500">Tools I reach for</p>
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

          <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">About this blog</h2>
            <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-700">
              <p className="rounded-xl border border-slate-200 p-3 bg-white">
                Static, export-first. Markdown posts, type-checked, minimal dependencies.
              </p>
              <p className="rounded-xl border border-slate-200 p-3 bg-white">
                Built with Next.js 15, Tailwind, date-fns. Deployed to GitHub Pages.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Say hello</h2>
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
                RSS feed
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
} 
