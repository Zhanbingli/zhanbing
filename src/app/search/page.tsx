import { Suspense } from 'react'
import SearchPageClient from './SearchPageClient'

export const metadata = {
  title: '搜索',
  description: '搜索这个博客里的文章、标签和关键词。',
  alternates: {
    canonical: '/search',
  },
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
          <p className="text-slate-600">正在加载搜索页...</p>
        </div>
      </div>
    }>
      <SearchPageClient />
    </Suspense>
  )
}
