'use client'

interface ShareButtonProps {
  title: string
  excerpt?: string
  url: string
}

export default function ShareButton({ title, excerpt, url }: ShareButtonProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: excerpt || title,
        url,
      })
    } else {
      navigator.clipboard.writeText(url)
      alert('链接已复制到剪贴板')
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex w-full sm:inline-flex sm:w-auto items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
      </svg>
      分享
    </button>
  )
}
