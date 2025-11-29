import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import Navigation from '@/components/Navigation'
import { notFound } from 'next/navigation'

interface TagPageProps {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  
  return {
    title: `Tag: ${decodedTag}`,
    description: `See every post tagged "${decodedTag}".`,
    alternates: {
      canonical: `/tags/${encodeURIComponent(decodedTag)}`,
    },
  }
}

export async function generateStaticParams() {
  const allPostsData = getSortedPostsData()
  const allTags = Array.from(new Set(allPostsData.flatMap(post => post.tags || [])))
  
  return allTags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }))
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const allPostsData = getSortedPostsData()
  
  // Filter posts containing the tag
  const taggedPosts = allPostsData.filter(post => 
    post.tags?.includes(decodedTag)
  )

  if (taggedPosts.length === 0) {
    notFound()
  }

  // Related tags (co-occurring with current tag)
  const relatedTags = Array.from(new Set(
    taggedPosts
      .flatMap(post => post.tags || [])
      .filter(t => t !== decodedTag)
  )).slice(0, 8)

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-6 py-12">
        {/* Header */}
        <header className="mb-10 space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Tag</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">{decodedTag}</h1>
          <p className="text-slate-600 text-base">
            {taggedPosts.length} post{taggedPosts.length === 1 ? '' : 's'} tagged &ldquo;{decodedTag}&rdquo;
          </p>
        </header>

        {/* Articles */}
        <main className="mb-16">
          <div className="grid gap-4 md:grid-cols-2">
            {taggedPosts.map(({ id, date, title, excerpt, tags }) => (
              <article
                key={id}
                className="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3 text-sm text-slate-500">
                    <time dateTime={date}>{formatDate(date)}</time>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
                      {decodedTag}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[var(--accent)] transition-colors duration-200">
                    <Link href={`/posts/${id}`}>
                      {title}
                    </Link>
                  </h3>
                  
                  {excerpt && (
                    <p className="text-slate-600 mb-4 leading-relaxed line-clamp-3">
                      {excerpt}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/posts/${id}`}
                      className="inline-flex items-center text-[var(--accent)] hover:text-[#0c316f] font-medium transition-colors duration-200"
                    >
                      Read more
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    
                    {tags && tags.length > 1 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.filter(t => t !== decodedTag).slice(0, 3).map((tag) => (
                          <Link
                            key={tag}
                            href={`/tags/${encodeURIComponent(tag)}`}
                            className="inline-block bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full transition-colors duration-200"
                          >
                            {tag}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* Related Tags */}
        {relatedTags.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Related tags</h2>
            <div className="flex flex-wrap gap-2">
              {relatedTags.map((relatedTag) => (
                <Link
                  key={relatedTag}
                  href={`/tags/${encodeURIComponent(relatedTag)}`}
                  className="inline-flex items-center px-3 py-1.5 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors duration-150"
                >
                  <span className="text-sm">{relatedTag}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/tags" className="inline-flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200">
            <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            All tags
          </Link>
          <Link href="/" className="inline-flex items-center px-5 py-2.5 bg-[var(--accent)] text-white font-medium rounded-lg hover:bg-[#0c316f] transition-colors duration-200 shadow-sm">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
} 
