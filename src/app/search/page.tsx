import { Suspense } from 'react'
import SearchPageClient from './SearchPageClient'

export const metadata = {
  title: 'Search posts',
  description: 'Search technical articles and learning notes on this blog.',
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
          <p className="text-slate-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchPageClient />
    </Suspense>
  )
}
