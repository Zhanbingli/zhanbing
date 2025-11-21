import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import Navigation from '@/components/Navigation'

export default function Home() {
  const allPostsData = getSortedPostsData()
  const latestUpdate = allPostsData[0]?.date
  const featuredPosts = allPostsData.slice(0, 6)

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-6 py-10 md:py-14 space-y-10">
        <section className="rounded-2xl bg-white/90 border border-slate-200 shadow-sm p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Personal Notes</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-slate-900">
            写给自己，也写给同路人的技术手记
          </h1>
          <p className="mt-3 text-lg text-slate-600 max-w-3xl leading-relaxed">
            以阅读体验为中心，记录前端开发、工程化和学习方法。希望让每一篇文章都像一次轻松的对话。
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[var(--accent)] font-medium">
              共 {allPostsData.length} 篇文章
            </span>
            {latestUpdate && (
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1">
                最近更新：{formatDate(latestUpdate)}
              </span>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-white shadow-sm transition hover:translate-y-px hover:bg-[#0c316f]"
            >
              浏览全部文章
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/feed.xml"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-slate-700 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              target="_blank"
              rel="noopener noreferrer"
            >
              RSS 订阅
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Latest</p>
              <h2 className="text-2xl font-semibold text-slate-900">最近更新</h2>
            </div>
            <Link 
              href="/posts" 
              className="text-sm font-medium text-[var(--accent)] hover:underline"
            >
              查看全部
            </Link>
          </div>

          <ul className="space-y-4">
            {featuredPosts.map(({ id, date, title, excerpt, tags, readingTime }) => (
              <li
                key={id}
                className="group rounded-xl border border-slate-200 bg-white/90 p-5 sm:p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500">
                  <time dateTime={date}>{formatDate(date)}</time>
                  <span className="inline-flex items-center gap-2 text-xs sm:text-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300" aria-hidden />
                    约 {Math.max(1, readingTime ?? 1)} 分钟阅读
                  </span>
                </div>

                <h3 className="mt-2 text-xl font-semibold text-slate-900 leading-snug">
                  <Link href={`/posts/${id}`} className="hover:text-[var(--accent)]">
                    {title}
                  </Link>
                </h3>

                {excerpt && (
                  <p className="mt-2 text-slate-600 leading-relaxed line-clamp-2">
                    {excerpt}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {tags?.slice(0, 3).map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${encodeURIComponent(tag)}`}
                      className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200"
                    >
                      {tag}
                    </Link>
                  ))}
                  <Link
                    href={`/posts/${id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline"
                  >
                    阅读全文
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <footer className="border-t border-slate-200/70 pt-6 text-sm text-slate-600">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2025 zhanbing · 写作与设计都在不断打磨</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/about" className="hover:text-[var(--accent)]">关于</Link>
              <Link href="/feed.xml" className="hover:text-[var(--accent)]">RSS</Link>
              <a href="https://github.com/Zhanbingli" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)]">
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
