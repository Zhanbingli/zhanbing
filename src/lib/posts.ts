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

      // 组合数据和id
      return {
        id,
        content: matterResult.content,
        ...(matterResult.data as { title: string; date: string; excerpt?: string; tags?: string[] })
      }
    })

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
      return {
        params: {
          id: fileName.replace(/\.md$/, '')
        }
      }
    })
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
    ...(matterResult.data as { title: string; date: string; excerpt?: string; tags?: string[] })
  }
} 