import Link from 'next/link'
import { getSortedPostsData, type PostData } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: '全部文章',
  description: '浏览我的所有博客文章，包括技术分享、学习笔记和编程心得',
  alternates: {
    canonical: '/posts',
  },
}

export default function PostsPage() {
  const allPostsData = getSortedPostsData()

  // 按日期排序（最新在前）
  const sortedPosts = allPostsData.sort((a: PostData, b: PostData) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // 统计信息
  const totalPosts = allPostsData.length
  const allTags = Array.from(new Set(allPostsData.flatMap((post: PostData) => post.tags || [])))
  const currentYear = new Date().getFullYear()
  const thisYearPosts = allPostsData.filter((post: PostData) => new Date(post.date).getFullYear() === currentYear).length

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-6 py-10 md:py-14 space-y-8">
        <header className="rounded-2xl bg-white/90 border border-slate-200 shadow-sm p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Archive</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-slate-900">全部文章</h1>
          <p className="mt-3 text-lg text-slate-600 leading-relaxed max-w-3xl">
            按时间排序的写作档案。保持篇幅克制、语气诚恳，让你能快速浏览并找到感兴趣的内容。
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[var(--accent)] font-medium">
              {totalPosts} 篇文章
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1">
              {allTags.length} 个标签
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1">
              {thisYearPosts} 篇发表于 {currentYear}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-white shadow-sm transition hover:translate-y-px hover:bg-[#0c316f]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              搜索文章
            </Link>
            <Link
              href="/tags"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-slate-700 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              按标签浏览
            </Link>
          </div>
        </header>

        <section className="space-y-4">
          {sortedPosts.map(({ id, date, title, excerpt, tags, readingTime }: PostData) => (
            <article
              key={id}
              className="group rounded-xl border border-slate-200 bg-white/90 p-5 sm:p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500">
                <time dateTime={date}>{formatDate(date)}</time>
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" aria-hidden />
                  约 {Math.max(1, (readingTime ?? 1))} 分钟阅读
                </span>
              </div>

              <h2 className="mt-2 text-xl sm:text-2xl font-semibold text-slate-900 leading-snug">
                <Link href={`/posts/${id}`} className="hover:text-[var(--accent)]">
                  {title}
                </Link>
              </h2>

              {excerpt && (
                <p className="mt-2 text-slate-600 leading-relaxed line-clamp-2">
                  {excerpt}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {tags?.slice(0, 4).map((tag) => (
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
            </article>
          ))}

          {sortedPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl font-semibold text-slate-800 mb-2">暂无文章</p>
              <p className="text-slate-600">写作进行中，很快就会有内容和你见面。</p>
            </div>
          )}
        </section>

        <div className="text-center pt-6 border-t border-slate-200/70">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2 text-slate-700 transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
        </div>
      </main>
    </div>
  )
}
