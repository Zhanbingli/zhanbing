import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: 'Tags',
  description: 'Browse all tags and categories across the blog.',
  alternates: {
    canonical: '/tags',
  },
}

export default function TagsPage() {
  const allPostsData = getSortedPostsData()
  const tagCounts = allPostsData.reduce((acc, post) => {
    post.tags?.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-6 py-10 md:py-14">
        <header className="mb-10 space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Tags</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">Browse by tag</h1>
          <p className="text-slate-600 text-base">Pick a tag to filter posts. {sortedTags.length} tags total.</p>
        </header>

        <ul className="grid gap-3 sm:grid-cols-2">
          {sortedTags.map(([tag, count]) => (
            <li key={tag} className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-sm flex items-center justify-between">
              <div>
                <Link href={`/tags/${encodeURIComponent(tag)}`} className="text-lg font-semibold text-slate-900 hover:text-[var(--accent)]">
                  {tag}
                </Link>
                <p className="text-sm text-slate-600">{count} post{count === 1 ? '' : 's'}</p>
              </div>
              <Link
                href={`/tags/${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                View
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 
