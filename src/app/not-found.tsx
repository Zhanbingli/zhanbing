import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="inline-block rounded-lg bg-white p-8 shadow-sm">
              <svg className="h-24 w-24 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="mb-6 text-6xl font-bold text-[var(--accent)] md:text-8xl">
            404
          </h1>
          
          <h2 className="mb-4 text-2xl font-bold text-slate-950 md:text-3xl">
            Page not found
          </h2>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-600">
            Sorry, the page you are looking for does not exist. It might be a broken link, or the page has moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-[var(--accent)] px-6 py-3 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-[#115e59]"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to home
            </Link>
            
            <Link
              href="/posts"
              className="inline-flex items-center rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50"
            >
              <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Browse posts
            </Link>
          </div>

          {/* Popular Links */}
          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-950">
              Helpful links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/tags"
                className="flex items-center rounded-lg p-3 text-slate-600 transition-colors duration-200 hover:bg-teal-50 hover:text-[var(--accent)]"
              >
                <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Tags
              </Link>
              
              <Link
                href="/about"
                className="flex items-center rounded-lg p-3 text-slate-600 transition-colors duration-200 hover:bg-teal-50 hover:text-[var(--accent)]"
              >
                <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                About me
              </Link>
              
              <Link
                href="/search"
                className="flex items-center rounded-lg p-3 text-slate-600 transition-colors duration-200 hover:bg-teal-50 hover:text-[var(--accent)]"
              >
                <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search posts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
