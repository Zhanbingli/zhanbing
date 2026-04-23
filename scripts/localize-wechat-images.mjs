import fs from 'node:fs/promises'
import path from 'node:path'

const inputFiles = process.argv.slice(2)

function extensionFromUrl(url) {
  const parsed = new URL(url)
  const wxFormat = parsed.searchParams.get('wx_fmt')
  if (wxFormat) return wxFormat === 'jpeg' ? 'jpg' : wxFormat

  const extension = path.extname(parsed.pathname).replace('.', '')
  return extension || 'jpg'
}

async function download(url, filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })

  const response = await fetch(url, {
    headers: {
      Referer: 'https://mp.weixin.qq.com/',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  await fs.writeFile(filePath, buffer)
}

async function filesToProcess() {
  if (inputFiles.length > 0) return inputFiles

  const files = await fs.readdir('posts')
  return files.filter((file) => file.endsWith('.md')).map((file) => path.join('posts', file))
}

async function main() {
  const files = await filesToProcess()
  let localized = 0
  let failed = 0

  for (const filePath of files) {
    let markdown = await fs.readFile(filePath, 'utf8')
    const slug = path.basename(filePath, '.md')
    const matches = [...markdown.matchAll(/!\[([^\]]*)\]\((https?:\/\/mmbiz\.qpic\.cn[^)]+)\)/g)]

    if (matches.length === 0) continue

    let index = 1
    for (const match of matches) {
      const [fullMatch, alt, url] = match
      const extension = extensionFromUrl(url)
      const filename = `image-${String(index).padStart(2, '0')}.${extension}`
      const targetPath = path.join('public', 'images', 'posts', slug, filename)
      const publicPath = `/images/posts/${slug}/${filename}`

      index += 1

      try {
        await download(url, targetPath)
        markdown = markdown.replace(fullMatch, `![${alt || '图片'}](${publicPath})`)
        localized += 1
        console.log(`LOCALIZED ${filePath} -> ${targetPath}`)
      } catch (error) {
        failed += 1
        console.warn(`FAILED ${filePath} ${url}: ${error.message}`)
      }
    }

    await fs.writeFile(filePath, markdown, 'utf8')
  }

  console.log(`图片本地化完成：成功 ${localized}，失败 ${failed}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
