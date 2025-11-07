'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Utilities from '@/lib/utils'

export default function Navbar() {
  const pathname = usePathname()

  const baseLinks = [
    { href: '/kontakt', label: 'Kontakt' },
    { href: '/%C3%A7alak%C3%AE', label: 'Çalakî' },
    { href: '/f%C3%AArb%C3%BBn', label: 'Fêrbûn' },
  ]
  
  const links = Utilities.isLoggedIn() 
    ? [...baseLinks, { href: '/new-entry', label: 'Nû' }]
    : baseLinks

  const isHome = pathname === '/'

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-800/80 backdrop-blur-md border-b border-gray-700 shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <img src="/logo.jpg" alt="SFPZK Logo" width={40} className={`rounded-full ${isHome ? 'outline-2 outline-yellow-200' : ''
              }`}
            />
          </Link>
        </div>

        {/* navigation */}
        <nav className="flex items-center gap-6">
          {links.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`transition-colors ${isActive
                  ? 'text-yellow-200'
                  : 'text-gray-200 hover:text-yellow-200 active:text-yellow-200 focus:text-yellow-200'
                  }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
