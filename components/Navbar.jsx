'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Utilities from '@/lib/utils'

export default function Navbar() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [authReady, setAuthReady] = useState(false) // ✅ added
  const isHome = pathname === '/'

  useEffect(() => {
    const unsubscribe = Utilities.onAuthChange(user => {
      setIsAdmin(!!(user && Utilities.isAdminEmail(user.email)))
      setAuthReady(true) // ✅ mark ready once first event fires
    })
    return () => unsubscribe()
  }, [])

  const links = [
    { href: '/kontakt', label: 'Kontakt' },
    { href: '/%C3%A7alak%C3%AE', label: 'Çalakî' },
    { href: '/f%C3%AArb%C3%BBn', label: 'Fêrbûn' },
  ]

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-800/80 backdrop-blur-md border-b border-gray-700 shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <img
              src="/logo.jpg"
              alt="SFPZK Logo"
              width={40}
              className={`rounded-full ${isHome ? 'outline-2 outline-yellow-200' : ''}`}
            />
          </Link>
        </div>

        {/* navigation */}
        <nav className="flex items-center gap-6">
          {!authReady ? (
            //  placeholder while auth loads
            <div className="w-[300px] h-5 bg-gray-700 rounded animate-pulse" />
          ) : (
            <>
              {links.map(({ href, label }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    prefetch
                    className={`transition-colors ${
                      isActive
                        ? 'text-yellow-200'
                        : 'text-gray-200 hover:text-yellow-200 active:text-yellow-200 focus:text-yellow-200'
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
              {isAdmin && (
                <Link
                  prefetch
                  href="/new-entry"
                  className={`transition-colors ${
                    pathname === '/new-entry'
                      ? 'text-yellow-200'
                      : 'text-gray-200 hover:text-yellow-200 active:text-yellow-200 focus:text-yellow-200'
                  }`}
                >
                  Nû
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
