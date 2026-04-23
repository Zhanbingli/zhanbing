import fs from 'node:fs/promises'
import path from 'node:path'

const INPUT_FILE = process.env.WECHAT_JSON_FILE || 'wechat-articles.json'

const importPlan = [
  { id: 6, slug: 'vibe-coding-app-lessons' },
  { id: 10, slug: 'learning-computers-seriously' },
  { id: 12, slug: 'growth-choice-market-medical-student' },
  { id: 17, slug: 'production-over-consumption' },
  { id: 20, slug: 'conversations-with-gpt' },
  { id: 22, slug: 'pursuit-of-realness' },
  { id: 23, slug: 'why-paying-is-a-bargain' },
  { id: 24, slug: 'scarcity-growth-shackles' },
  { id: 27, slug: 'daily-life-with-gpt' },
  { id: 33, slug: 'english-ai-tools-information-channel' },
  { id: 35, slug: 'leaving-a-shares' },
  { id: 37, slug: 'learning-action-invisible-barrier' },
  { id: 40, slug: 'thinking-writing-reading-learning' },
  { id: 41, slug: 'just-be-yourself' },
  { id: 43, slug: 'why-read-books' },
  { id: 44, slug: 'ai-tools-misguidance' },
  { id: 50, slug: 'why-i-still-write-myself' },
  { id: 53, slug: 'personal-career-development' },
  { id: 54, slug: 'future-role-of-brain' },
  { id: 56, slug: 'asking-better-questions' },
  { id: 57, slug: 'reading-and-writing-questions' },
  { id: 58, slug: 'gpt-sentences' },
  { id: 64, slug: 'cognitive-differences' },
  { id: 79, slug: 'liang-yongan-gap-year' },
]

const skippedAsDuplicate = new Map([
  [5, '对应已有文章 action-vs-thinking.md'],
  [8, '对应已有文章 how-use-chatgpt-plus.md'],
  [13, '对应已有文章 my-freelancer.md'],
  [19, '对应已有文章 r-learning-base.md'],
  [31, '对应已有文章 just-to-do.md'],
  [32, '对应已有文章 blog-buit-thinking.md'],
  [45, '对应已有文章 research-about-learn.md'],
  [46, '与 45/research-about-learn.md 主题高度重合'],
])

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

function cleanInlineHtml(html, preserveBreaks = false) {
  const breakReplacement = preserveBreaks ? '\n' : ' '

  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|section|div|li|h[1-6]|tr|table)>/gi, breakReplacement)
      .replace(/<\/?(span|strong|em|section|mp-common-profile|mp-style-type)[^>]*>/gi, '')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function stripHtml(html = '') {
  return cleanInlineHtml(html).replace(/\s+/g, ' ').trim()
}

function extractHeading(html = '') {
  const match = html.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i)
  return match ? cleanInlineHtml(match[1]) : ''
}

function normalizeImageUrl(src) {
  if (!src) return ''
  if (src.startsWith('//')) return `https:${src}`
  return src
}

function imageExtensionFromUrl(url) {
  const parsed = new URL(url)
  const wxFormat = parsed.searchParams.get('wx_fmt')
  if (wxFormat) return wxFormat === 'jpeg' ? 'jpg' : wxFormat

  const pathnameExt = path.extname(parsed.pathname).replace('.', '')
  return pathnameExt || 'jpg'
}

function convertTables(html) {
  return html.replace(/<table\b[^>]*>([\s\S]*?)<\/table>/gi, (_, table) => {
    const rows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((row) => {
      return [...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) =>
        cleanInlineHtml(cell[1]).replace(/\|/g, '\\|')
      )
    })

    if (rows.length === 0) return ''

    const width = Math.max(...rows.map((row) => row.length))
    const normalizedRows = rows.map((row) => [...row, ...Array(width - row.length).fill('')])
    const header = normalizedRows[0]
    const separator = Array(width).fill('---')
    const body = normalizedRows.slice(1)

    return [
      '',
      `| ${header.join(' | ')} |`,
      `| ${separator.join(' | ')} |`,
      ...body.map((row) => `| ${row.join(' | ')} |`),
      '',
    ].join('\n')
  })
}

async function downloadImage(url, filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })

  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    },
  })

  if (!response.ok) {
    return false
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  await fs.writeFile(filePath, buffer)
  return true
}

async function convertHtmlToMarkdown(html, slug) {
  const imageTokens = []
  let source = convertTables(html)

  source = source
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

      const index = imageTokens.length + 1
      const extension = imageExtensionFromUrl(imageUrl)
      const filename = `image-${String(index).padStart(2, '0')}.${extension}`
      const publicPath = `/images/posts/${slug}/${filename}`
      const filePath = path.join('public', 'images', 'posts', slug, filename)
      const token = `@@WECHAT_IMAGE_${index}@@`

      imageTokens.push({ token, alt: cleanInlineHtml(alt) || '图片', imageUrl, publicPath, filePath })
      return `\n\n${token}\n\n`
    })

  for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li']) {
    source = source
      .replace(new RegExp(`<${tag}\\b[^>]*>`, 'gi'), `<${tag}>`)
      .replace(new RegExp(`</${tag}>`, 'gi'), `</${tag}>`)
  }

  let markdown = source
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

  markdown = cleanInlineHtml(markdown, true).replace(/\n{3,}/g, '\n\n').trim()

  for (const image of imageTokens) {
    let pathToUse = image.imageUrl
    try {
      if (await downloadImage(image.imageUrl, image.filePath)) {
        pathToUse = image.publicPath
      }
    } catch {
      pathToUse = image.imageUrl
    }
    markdown = markdown.replace(image.token, `![${image.alt}](${pathToUse})`)
  }

  return markdown
}

function normalizeForCompare(value = '') {
  return value
    .toLowerCase()
    .replace(/[\s`*_#>\-[\](){}:：，。、“”‘’！!？?；;,.|]+/g, '')
    .trim()
}

function titleFromMarkdown(markdown) {
  const match = markdown.match(/^---[\s\S]*?title:\s*["']?([^"'\n]+)["']?/m)
  return match?.[1]?.trim() || ''
}

async function getExistingPosts() {
  const files = await fs.readdir('posts')
  const posts = []

  for (const file of files.filter((name) => name.endsWith('.md'))) {
    const content = await fs.readFile(path.join('posts', file), 'utf8')
    posts.push({
      file,
      title: titleFromMarkdown(content),
      normalizedTitle: normalizeForCompare(titleFromMarkdown(content)),
    })
  }

  return posts
}

function yamlString(value) {
  return JSON.stringify(value || '')
}

function unixDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10)
  return new Date(Number(value) * 1000).toISOString().slice(0, 10)
}

async function main() {
  const articles = JSON.parse(await fs.readFile(INPUT_FILE, 'utf8'))
  const existingPosts = await getExistingPosts()
  const imported = []
  const skipped = []

  for (const [id, reason] of skippedAsDuplicate.entries()) {
    skipped.push({ id, reason })
  }

  for (const item of importPlan) {
    const article = articles[item.id - 1]
    if (!article) {
      skipped.push({ id: item.id, reason: 'JSON 中找不到这篇文章' })
      continue
    }

    const title = article.title?.trim() || extractHeading(article.content) || `微信文章 ${item.id}`
    const normalizedTitle = normalizeForCompare(title)
    const filePath = path.join('posts', `${item.slug}.md`)
    const contentText = stripHtml(article.content)

    if (contentText.length < 400) {
      skipped.push({ id: item.id, title, reason: '正文太短，跳过' })
      continue
    }

    if (existingPosts.some((post) => post.normalizedTitle === normalizedTitle)) {
      skipped.push({ id: item.id, title, reason: '标题已存在，跳过' })
      continue
    }

    try {
      await fs.access(filePath)
      skipped.push({ id: item.id, title, reason: `${filePath} 已存在，跳过` })
      continue
    } catch {
      // File does not exist. Continue importing.
    }

    const markdown = await convertHtmlToMarkdown(article.content, item.slug)
    const date = unixDate(article.create_time || article.update_time)
    const updatedAt = unixDate(article.update_time || article.create_time)
    const body = `---\ntitle: ${yamlString(title)}\ndate: ${yamlString(date)}\nupdatedAt: ${yamlString(updatedAt)}\nexcerpt: ${yamlString(article.digest || title)}\ntags: ["微信公众号"]\ndraft: false\nauthor: ${yamlString(article.author || '')}\n---\n\n${markdown}\n`

    await fs.writeFile(filePath, body, 'utf8')
    existingPosts.push({ file: `${item.slug}.md`, title, normalizedTitle })
    imported.push({ id: item.id, title, filePath })
  }

  console.log(`导入完成：${imported.length} 篇`)
  for (const item of imported) {
    console.log(`IMPORT ${String(item.id).padStart(2, '0')} ${item.filePath} ${item.title}`)
  }

  console.log(`跳过：${skipped.length} 篇`)
  for (const item of skipped.sort((a, b) => a.id - b.id)) {
    console.log(`SKIP ${String(item.id).padStart(2, '0')} ${item.title || ''} ${item.reason}`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
