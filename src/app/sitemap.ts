import { getSortedPostsData } from '@/lib/posts'

export const dynamic = 'force-static'

export default function sitemap() {
  const posts = getSortedPostsData()
  const baseUrl = 'https://zhanbing.site'

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    ...postUrls,
  ]
} 