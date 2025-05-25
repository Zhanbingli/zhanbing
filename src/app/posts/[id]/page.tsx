import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostData, getSortedPostsData } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  const posts = getSortedPostsData()
  return posts.map((post) => ({
    id: post.id,
  }))
}

export async function generateMetadata({ params }: PostPageProps) {
  try {
    const { id } = await params
    const postData = await getPostData(id)
    return {
      title: `${postData.title} | 我的个人博客`,
      description: postData.excerpt || postData.title,
    }
  } catch {
    return {
      title: '文章未找到 | 我的个人博客',
    }
  }
}

export default async function Post({ params }: PostPageProps) {
  const { id } = await params
  let postData
  
  try {
    postData = await getPostData(id)
  } catch {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 返回链接 */}
        <nav className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            <svg
              className="mr-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            返回首页
          </Link>
        </nav>

        {/* 文章内容 */}
        <article className="bg-white rounded-lg shadow-lg p-8">
          {/* 文章头部 */}
          <header className="mb-8 pb-8 border-b border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {postData.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <time className="text-gray-500 mb-4 sm:mb-0" dateTime={postData.date}>
                {formatDate(postData.date)}
              </time>
              
              {postData.tags && postData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {postData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* 文章正文 */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
            dangerouslySetInnerHTML={{ __html: postData.content }}
          />
        </article>

        {/* 导航到其他文章 */}
        <nav className="mt-12">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              查看所有文章
            </Link>
          </div>
        </nav>
      </div>
    </div>
  )
} 