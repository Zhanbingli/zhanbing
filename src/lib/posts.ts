import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export interface PostData {
  id: string
  title: string
  date: string
  excerpt?: string
  content: string
  tags?: string[]
  draft?: boolean
  readingTime?: number
}

function estimateReadingTime(text: string): number {
  // 粗略估算：中文按 300 字/分钟，英文按 200 词/分钟
  const cjkMatches = text.match(/[\u4e00-\u9fff]/g) || []
  const cjkCount = cjkMatches.length
  const enWords = (text.replace(/[\u4e00-\u9fff]/g, ' ').trim().match(/\b[\w'-]+\b/g) || []).length
  const minutes = Math.ceil(cjkCount / 300 + enWords / 200)
  return Math.max(1, minutes)
}

export function getSortedPostsData(): PostData[] {
  // 获取posts目录下的文件名
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      // 移除文件名的".md"后缀获取id
      const id = fileName.replace(/\.md$/, '')

      // 读取markdown文件内容
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      // 使用gray-matter解析文章元数据
      const matterResult = matter(fileContents)

      const draft = matterResult.data?.draft === true
      if (process.env.NODE_ENV === 'production' && draft) {
        // 生产环境过滤草稿
        return null as unknown as PostData
      }

      // 组合数据和id
      const content = matterResult.content
      return {
        id,
        content,
        readingTime: estimateReadingTime(content),
        ...(matterResult.data as { title: string; date: string; excerpt?: string; tags?: string[]; draft?: boolean })
      }
    })
    .filter(Boolean) as PostData[]

  // 按日期排序
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContents)
      const draft = matterResult.data?.draft === true
      if (process.env.NODE_ENV === 'production' && draft) {
        return null
      }
      return { params: { id: fileName.replace(/\.md$/, '') } }
    })
    .filter(Boolean) as { params: { id: string } }[]
}

export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // 使用gray-matter解析文章元数据
  const matterResult = matter(fileContents)

  // 使用remark将markdown转换为HTML字符串
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // 组合数据和id
  return {
    id,
    content: contentHtml,
    readingTime: estimateReadingTime(matterResult.content),
    ...(matterResult.data as { title: string; date: string; excerpt?: string; tags?: string[]; draft?: boolean })
  }
}
