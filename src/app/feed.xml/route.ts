import { getSortedPostsData } from '@/lib/posts'

export const dynamic = 'force-static'

export async function GET() {
  const posts = getSortedPostsData()
  const baseUrl = 'https://zhanbing.site'
  
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>blog of lizhanbing</title>
    <description>分享技术心得、学习笔记和生活感悟的个人博客</description>
    <link>${baseUrl}</link>
    <language>zh-CN</language>
    <managingEditor>lizhanbing@example.com (lizhanbing)</managingEditor>
    <webMaster>lizhanbing@example.com (lizhanbing)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      <link>${baseUrl}/posts/${post.id}</link>
      <guid isPermaLink="true">${baseUrl}/posts/${post.id}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.tags ? post.tags.map(tag => `<category>${tag}</category>`).join('\n      ') : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  })
} 