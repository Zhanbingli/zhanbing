import { Suspense } from 'react'
import SearchPageClient from './SearchPageClient'

export const metadata = {
  title: '搜索文章',
  description: '搜索博客中的技术文章和学习笔记',
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
          <p className="text-slate-600">加载搜索页面...</p>
        </div>
      </div>
    }>
      <SearchPageClient />
    </Suspense>
  )
}
