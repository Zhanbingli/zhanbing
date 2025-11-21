'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setIsMobileMenuOpen(false)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setIsSearchOpen(false)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    setIsMobileMenuOpen(false)
  }

  const closeMenus = () => {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-[var(--background)]/90 backdrop-blur container-mobile">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex justify-between items-center h-16 nav-mobile-landscape">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0 touch-target" onClick={closeMenus}>
            <div className="w-9 h-9 bg-[#0f3d91] rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-semibold text-sm">ZB</span>
            </div>
            <span className="font-bold text-lg text-slate-900 hidden sm:inline">zhanbing</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-slate-700 hover:text-[var(--accent)] transition-colors duration-150 font-medium"
            >
              首页
            </Link>
            <Link 
              href="/about" 
              className="text-slate-700 hover:text-[var(--accent)] transition-colors duration-150 font-medium"
            >
              关于
            </Link>
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-slate-200 bg-white rounded-full focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all duration-150 shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </form>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center space-x-1">
            {/* Search button */}
            <button 
              onClick={toggleSearch}
              className="text-slate-700 hover:text-[var(--accent)] transition-colors duration-150 p-2 touch-target rounded-lg hover:bg-white/70"
              aria-label="搜索"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Menu button */}
            <button 
              onClick={toggleMobileMenu}
              className="text-slate-700 hover:text-[var(--accent)] transition-colors duration-150 p-2 touch-target rounded-lg hover:bg-white/70"
              aria-label="菜单"
            >
              <svg
                className={`h-6 w-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden border-t border-slate-200/80 py-4 mobile-nav-transition">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-base border border-slate-200 bg-white rounded-xl focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent outline-none transition-all duration-150 shadow-sm"
                  autoFocus
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/80 py-4 mobile-nav-transition bg-white/70 rounded-b-xl shadow-sm">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="text-slate-700 hover:text-[var(--accent)] transition-colors duration-150 font-medium py-3 px-2 rounded-lg hover:bg-white touch-target"
                onClick={closeMenus}
              >
                首页
              </Link>
              <Link 
                href="/about" 
                className="text-slate-700 hover:text-[var(--accent)] transition-colors duration-150 font-medium py-3 px-2 rounded-lg hover:bg-white touch-target"
                onClick={closeMenus}
              >
                关于
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 
