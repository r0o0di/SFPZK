import Link from 'next/link'

export default function Navbar() {
    return (
        <header className="fixed top-0 left-0 w-full bg-gray-800/80 backdrop-blur-md border-b border-gray-700 shadow-sm z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* links: logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="font-semibold text-lg">
                    <img src="/vercel.svg" alt="" width={40}/>
                        {/* SFPZK */}
                    </Link>
                </div>

                {/* rechts: nav-links */}
                <nav className="flex items-center gap-6">
                    <Link
                        href="/kontakt"
                        className="hover:text-green-300 transition-colors"
                    >
                        Kontakt
                    </Link>
                    <Link
                        href="/çalakî"
                        className="hover:text-yellow-200 transition-colors"
                    >
                        Çalakî
                    </Link>
                    <Link
                        href="/fêrbûn"
                        className="hover:text-red-300 transition-colors"
                    >
                        Fêrbûn
                    </Link>
                    <Link
                        href="/new-entry"
                        className="hover:text-green-300 transition-colors"
                    >
                        Neuer Eintrag
                    </Link>
                </nav>
            </div>
        </header>
    )
}
