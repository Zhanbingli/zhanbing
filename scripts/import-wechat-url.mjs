import fs from 'node:fs/promises'
import path from 'node:path'

const inputUrl = process.argv[2]
const slugOverride = process.argv[3] || process.env.WECHAT_SLUG || ''

if (!inputUrl) {
  console.error('用法：node scripts/import-wechat-url.mjs "https://mp.weixin.qq.com/s/..."')
  process.exit(1)
}

function decodeJsString(value) {
  return value
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
}

function extractJsDecodeField(html, fieldName) {
  const pattern = new RegExp(`${fieldName}:\\s*JsDecode\\('((?:\\\\.|[^'])*)'\\)`, 's')
  const match = html.match(pattern)
  return match ? decodeJsString(match[1]) : ''
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

function slugify(title) {
  if (slugOverride) {
    return slugOverride
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9-]+/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const slug = title
    .trim()
    .toLowerCase()
    .replace(/windows/g, 'windows')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9\u4e00-\u9fff-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return slug || `wechat-${Date.now()}`
}

function normalizeImageUrl(src) {
  if (!src) return ''
  if (src.startsWith('//')) return `https:${src}`
  return src
}

function stripAttributes(html, tagName) {
  return html
    .replace(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'), `<${tagName}>`)
    .replace(new RegExp(`</${tagName}>`, 'gi'), `</${tagName}>`)
}

function cleanInlineHtml(html, preserveBreaks = false) {
  const breakReplacement = preserveBreaks ? '\n' : ' '

  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|section|div|li|h[1-6])>/gi, breakReplacement)
      .replace(/<\/?(span|strong|em|section|mp-common-profile|mp-style-type)[^>]*>/gi, '')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function imageExtensionFromUrl(url) {
  const parsed = new URL(url)
  const wxFormat = parsed.searchParams.get('wx_fmt')
  if (wxFormat) return wxFormat === 'jpeg' ? 'jpg' : wxFormat

  const pathnameExt = path.extname(parsed.pathname).replace('.', '')
  return pathnameExt || 'jpg'
}

function convertHtmlToMarkdown(html, slug) {
  const images = []

  let source = html
    .replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_, code) => {
      const text = cleanInlineHtml(code, true)
      return `\n\n\`\`\`\n${text}\n\`\`\`\n\n`
    })
    .replace(/<img\b[^>]*>/gi, (tag) => {
      const src =
        tag.match(/\bdata-src=["']([^"']+)["']/i)?.[1] ||
        tag.match(/\bsrc=["']([^"']+)["']/i)?.[1] ||
        ''
      const alt = tag.match(/\balt=["']([^"']*)["']/i)?.[1] || '图片'
      const imageUrl = normalizeImageUrl(decodeHtmlEntities(src))
      if (!imageUrl) return ''

      const extension = imageExtensionFromUrl(imageUrl)
      const filename = `image-${String(images.length + 1).padStart(2, '0')}.${extension}`
      const publicPath = `/images/posts/${slug}/${filename}`
      const filePath = path.join('public', 'images', 'posts', slug, filename)
      images.push({ url: imageUrl, filePath })

      return `\n\n![${cleanInlineHtml(alt)}](${publicPath})\n\n`
    })

  for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li']) {
    source = stripAttributes(source, tag)
  }

  source = source
    .replace(/<h1>([\s\S]*?)<\/h1>/gi, (_, text) => `\n\n# ${cleanInlineHtml(text)}\n\n`)
    .replace(/<h2>([\s\S]*?)<\/h2>/gi, (_, text) => `\n\n## ${cleanInlineHtml(text)}\n\n`)
    .replace(/<h3>([\s\S]*?)<\/h3>/gi, (_, text) => `\n\n### ${cleanInlineHtml(text)}\n\n`)
    .replace(/<h4>([\s\S]*?)<\/h4>/gi, (_, text) => `\n\n#### ${cleanInlineHtml(text)}\n\n`)
    .replace(/<h5>([\s\S]*?)<\/h5>/gi, (_, text) => `\n\n##### ${cleanInlineHtml(text)}\n\n`)
    .replace(/<h6>([\s\S]*?)<\/h6>/gi, (_, text) => `\n\n###### ${cleanInlineHtml(text)}\n\n`)
    .replace(/<li>([\s\S]*?)<\/li>/gi, (_, text) => `\n- ${cleanInlineHtml(text)}\n`)
    .replace(/<p>([\s\S]*?)<\/p>/gi, (_, text) => {
      const cleaned = cleanInlineHtml(text)
      return cleaned ? `\n\n${cleaned}\n\n` : '\n\n'
    })
    .replace(/<\/?(ul|ol|blockquote|section|div|article)[^>]*>/gi, '\n\n')

  const markdown = cleanInlineHtml(source)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => `![${alt || '图片'}](${src})`)
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return { markdown, images }
}

function extractDate(html) {
  const candidates = [
    /var\s+ct\s*=\s*["'](\d{10})["']/,
    /var\s+createTime\s*=\s*["']([^"']+)["']/,
    /publish_time\s*:\s*["']([^"']+)["']/,
    /oriCreateTime\s*=\s*["']([^"']+)["']/,
  ]

  for (const pattern of candidates) {
    const match = html.match(pattern)
    if (!match) continue

    const value = match[1]
    if (/^\d{10}$/.test(value)) {
      return new Date(Number(value) * 1000).toISOString().slice(0, 10)
    }

    const dateMatch = value.match(/\d{4}-\d{1,2}-\d{1,2}/)
    if (dateMatch) return dateMatch[0]
  }

  return new Date().toISOString().slice(0, 10)
}

function yamlString(value) {
  return JSON.stringify(value || '')
}

async function downloadImages(images) {
  for (const image of images) {
    await fs.mkdir(path.dirname(image.filePath), { recursive: true })

    const response = await fetch(image.url, {
      headers: {
        Referer: inputUrl,
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      },
    })

    if (!response.ok) {
      console.warn(`图片下载失败：HTTP ${response.status} ${image.url}`)
      continue
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    await fs.writeFile(image.filePath, buffer)
    console.log(`已下载图片：${image.filePath}`)
  }
}

async function main() {
  const response = await fetch(inputUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    },
  })

  if (!response.ok) {
    throw new Error(`抓取失败：HTTP ${response.status} ${response.statusText}`)
  }

  const html = await response.text()
  const title = extractJsDecodeField(html, 'title') || '未命名微信文章'
  const author = extractJsDecodeField(html, 'nick_name')
  const excerpt = extractJsDecodeField(html, 'desc')
  const contentHtml = extractJsDecodeField(html, 'content_noencode')

  if (!contentHtml) {
    throw new Error('没有在页面中找到 content_noencode，可能被微信限制或页面结构变化。')
  }

  const date = extractDate(html)
  const slug = slugify(title)
  const filePath = path.join('posts', `${slug}.md`)
  const { markdown, images } = convertHtmlToMarkdown(contentHtml, slug)
  const body = `---\ntitle: ${yamlString(title)}\ndate: ${yamlString(date)}\nexcerpt: ${yamlString(excerpt || title)}\ntags: ["微信公众号"]\ndraft: false\nsource: ${yamlString(inputUrl)}\nauthor: ${yamlString(author)}\n---\n\n${markdown}\n`

  await downloadImages(images)
  await fs.writeFile(filePath, body, 'utf8')

  console.log(`标题：${title}`)
  console.log(`作者：${author || 'unknown'}`)
  console.log(`日期：${date}`)
  console.log(`图片：${images.length}`)
  console.log(`已生成：${filePath}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
