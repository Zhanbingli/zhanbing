'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/start', label: 'Start' },
  { href: '/posts', label: 'Posts' },
  { href: '/tags', label: 'Tags' },
  { href: '/about', label: 'About' },
]

export default function Navigation() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

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
            <div className="relative w-10 h-10 rounded-full border border-slate-200 shadow-sm overflow-hidden">
              <Image
                src="/lizhanbing.png"
                alt="Zhanbing Li avatar"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <span className="font-bold text-lg text-slate-900 hidden sm:inline">Zhanbing Li</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                  isActive(link.href)
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                    : 'text-slate-700 hover:text-[var(--accent)] hover:bg-white/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/search"
            className={`hidden md:inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-150 shadow-sm ${
              pathname === '/search'
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                : 'border-slate-200 bg-white text-slate-700 hover:border-[var(--accent)] hover:text-[var(--accent)]'
            }`}
          >
            <svg
              className="h-4 w-4"
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
            Search
          </Link>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center space-x-1">
            {/* Search button */}
            <button 
              onClick={toggleSearch}
              className="text-slate-700 hover:text-[var(--accent)] transition-colors duration-150 p-2 touch-target rounded-lg hover:bg-white/70"
              aria-label="Search"
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
              aria-label="Menu"
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
                  placeholder="Search titles, tags, or keywords"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-base shadow-sm outline-none transition-all duration-150 focus:border-transparent focus:ring-2 focus:ring-[var(--accent)]"
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
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`font-medium py-3 px-2 rounded-lg touch-target transition-colors duration-150 ${
                    isActive(link.href)
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                      : 'text-slate-700 hover:text-[var(--accent)] hover:bg-white'
                  }`}
                  onClick={closeMenus}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/search"
                className={`font-medium py-3 px-2 rounded-lg touch-target transition-colors duration-150 ${
                  pathname === '/search'
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                    : 'text-slate-700 hover:text-[var(--accent)] hover:bg-white'
                }`}
                onClick={closeMenus}
              >
                Search
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 
