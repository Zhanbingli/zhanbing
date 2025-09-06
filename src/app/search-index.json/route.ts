import { getSortedPostsData } from '@/lib/posts'

export const dynamic = 'force-static'

export async function GET() {
  const posts = getSortedPostsData()
  const index = posts.map(p => ({
    id: p.id,
    title: p.title,
    date: p.date,
    excerpt: p.excerpt || '',
    tags: p.tags || [],
  }))

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  })
}

