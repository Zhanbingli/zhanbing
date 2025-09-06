import { getSortedPostsData } from '@/lib/posts'
import { remark } from 'remark'
import html from 'remark-html'

export const dynamic = 'force-static'

export async function GET() {
  const posts = getSortedPostsData()
  const baseUrl = 'https://zhanbing.site'
  
  const itemsXml = await Promise.all(posts.map(async (post) => {
    // 将 Markdown 转换为 HTML，用于全文内容
    const processed = await remark().use(html).process(post.content)
    const contentHtml = processed.toString()
    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.title}]]></description>
      <link>${baseUrl}/posts/${post.id}</link>
      <guid isPermaLink="true">${baseUrl}/posts/${post.id}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>zhanbing</author>
      ${post.tags ? post.tags.map(tag => `<category>${tag}</category>`).join('\n      ') : ''}
      <content:encoded><![CDATA[${contentHtml}]]></content:encoded>
    </item>`
  }))

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>blog of lizhanbing</title>
    <description>分享技术心得、学习笔记和生活感悟的个人博客</description>
    <link>${baseUrl}</link>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml.join('')}
  </channel>
</rss>`

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
    },
  })
} 
