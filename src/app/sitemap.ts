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

  const allTags = Array.from(new Set(posts.flatMap(p => p.tags || [])))
  const tagUrls = allTags.map((tag) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...postUrls,
    ...tagUrls,
  ]
}
