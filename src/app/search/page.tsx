import { Suspense } from 'react'
import { getSortedPostsData } from '@/lib/posts'
import SearchPageClient from './SearchPageClient'

export const metadata = {
  title: '搜索文章',
  description: '搜索博客中的技术文章和学习笔记',
}

function SearchPageContent() {
  const allPosts = getSortedPostsData()
  return <SearchPageClient allPosts={allPosts} />
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载搜索页面...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
} 