'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Utilities from '@/lib/utils'

export default function Navbar() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const isHome = pathname === '/'

  useEffect(() => {
    const unsubscribe = Utilities.onAuthChange(user => {
      setIsAdmin(!!(user && Utilities.isAdminEmail(user.email)))
      setAuthReady(true)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const links = [
    { href: '/%C3%A7alak%C3%AE', label: 'Çalakî' },
    { href: '/f%C3%AArb%C3%BBn', label: 'Fêrbûn' },
    { href: '/kontakt', label: 'Kontakt' },
  ]

  const allLinks = [
    ...links,
    ...(isAdmin
      ? [{ href: '/admin', label: 'Nû' }]
      : []),
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto ">
        <div className=" border border-gray-700/50 bg-gray-900/80 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-3"
            >
              <img
                src="/logo.jpg"
                alt="SFPZK Logo"
                width={42}
                height={42}
                className={`rounded-full transition-all duration-300 ${
                  isHome
                    // ? 'ring-2 ring-yellow-200'
                    // : 'group-hover:ring-2 group-hover:ring-yellow-200/50'
                }`}
              />

              <span className={`hidden sm:block text-gray-100 font-semibold transition-all duration-300 ${
                  isHome
                    ? 'text-yellow-200'
                    : 'hover:text-yellow-200'
                }`}>
                SFPZK
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center">
              {!authReady ? (
                <div className="w-64 h-10 rounded-full bg-gray-800 animate-pulse" />
              ) : (
                <div className="flex items-center gap-2 rounded-full bg-gray-800/70 p-1">
                  {allLinks.map(({ href, label }) => {
                    const isActive = pathname === href

                    return (
                      <Link
                        key={href}
                        href={href}
                        prefetch
                        className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                          isActive
                            ? 'bg-yellow-200 text-gray-900 shadow-lg'
                            : 'text-gray-200 hover:text-yellow-200 hover:bg-gray-700/70'
                        }`}
                      >
                        {label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </nav>

            {/* Mobile Button */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2 rounded-lg text-gray-200 hover:bg-gray-800 transition cursor-pointer"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              mobileOpen
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="border-t border-gray-700/50 px-4 py-4 space-y-2">
              {authReady &&
                allLinks.map(({ href, label }) => {
                  const isActive = pathname === href

                  return (
                    <Link
                      key={href}
                      href={href}
                      prefetch
                      className={`block rounded-xl px-4 py-3 transition-all ${
                        isActive
                          ? 'bg-yellow-200 text-gray-900 font-medium'
                          : 'text-gray-200 hover:bg-gray-800'
                      }`}
                    >
                      {label}
                    </Link>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}







// 'use client'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import Utilities from '@/lib/utils'

// export default function Navbar() {
//   const pathname = usePathname()
//   const [isAdmin, setIsAdmin] = useState(false)
//   const [authReady, setAuthReady] = useState(false) // ✅ added
//   const isHome = pathname === '/'

//   useEffect(() => {
//     const unsubscribe = Utilities.onAuthChange(user => {
//       setIsAdmin(!!(user && Utilities.isAdminEmail(user.email)))
//       setAuthReady(true) // ✅ mark ready once first event fires
//     })
//     return () => unsubscribe()
//   }, [])

//   const links = [
//     { href: '/%C3%A7alak%C3%AE', label: 'Çalakî' },
//     { href: '/f%C3%AArb%C3%BBn', label: 'Fêrbûn' },
//     { href: '/kontakt', label: 'Kontakt' },
//   ]

//   return (
//     <header className="fixed top-0 left-0 w-full bg-gray-800/80 backdrop-blur-md border-b border-gray-700 shadow-sm z-50">
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
//         {/* logo */}
//         <div className="flex items-center gap-2">
//           <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
//             <img
//               src="/logo.jpg"
//               alt="SFPZK Logo"
//               width={40}
//               className={`rounded-full ${isHome ? 'outline-2 outline-yellow-200' : ''}`}
//             />
//           </Link>
//         </div>

//         {/* navigation */}
//         <nav className="flex items-center gap-6">
//           {!authReady ? (
//             //  placeholder while auth loads
//             <div className="w-[250px] h-5 bg-gray-700 rounded animate-pulse" />
//           ) : (
//             <>
//               {links.map(({ href, label }) => {
//                 const isActive = pathname === href
//                 return (
//                   <Link
//                     key={href}
//                     href={href}
//                     prefetch
//                     className={`transition-colors ${
//                       isActive
//                         ? 'text-yellow-200'
//                         : 'text-gray-200 hover:text-yellow-200 active:text-yellow-200 focus:text-yellow-200'
//                     }`}
//                   >
//                     {label}
//                   </Link>
//                 )
//               })}
//               {isAdmin && (
//                 <Link
//                   prefetch
//                   href="/admin"
//                   className={`transition-colors ${
//                     pathname === '/admin'
//                       ? 'text-yellow-200'
//                       : 'text-gray-200 hover:text-yellow-200 active:text-yellow-200 focus:text-yellow-200'
//                   }`}
//                 >
//                   Nû
//                 </Link>
//               )}
//             </>
//           )}
//         </nav>
//       </div>
//     </header>
//   )
// }
