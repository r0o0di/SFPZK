// import Link from 'next/link'

// export default function HomePage() {
//   return (
//     <>
//       <div style={{ padding: 20 }}>
//         <Link href="/new-entry">Add New</Link><br /><br />
//         <Link href="/çalakî">çalakî</Link><br /><br />
//         <Link href="/fêrbûn">fêrbûn</Link><br /><br />
//       </div>
//     </>
//   );
// }




// import Link from "next/link";

// export default function HomePage() {
//   return (
//     <div className="min-h-screen flex flex-col text-gray-900 bg-gradient-to-br from-white via-green-100 via-40% to-red-100">
//       {/* Header / Navbar */}
//       <header className="w-full flex items-center justify-between px-8 py-4 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 shadow-md">
//         {/* Logo */}
//         <div className="flex items-center space-x-3">
//           <img
//             src="/globe.svg"
//             alt="Logo"
//             className="h-12 w-12 object-contain"
//           />
//         </div>

//         {/* Menü */}
//         <nav className="flex space-x-6 font-medium text-white">
//           <Link
//             href="/new-entry"
//             className="hover:text-yellow-200 transition-colors"
//           >
//             Add New
//           </Link>
//           <Link
//             href="/çalakî"
//             className="hover:text-yellow-200 transition-colors"
//           >
//             çalakî
//           </Link>
//           <Link
//             href="/fêrbûn"
//             className="hover:text-yellow-200 transition-colors"
//           >
//             fêrbûn
//           </Link>
//         </nav>
//       </header>

//       {/* Titel */}
//       <h1 className="text-5xl font-extrabold text-center mt-10 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 drop-shadow-sm">
//         SFPZK
//       </h1>

//       {/* Hauptbereich */}
//       <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
//         <img
//           src="/globe.svg"
//           alt="Main visual"
//           className="w-full max-w-xl rounded-2xl shadow-lg object-cover border-4 border-yellow-200 bg-white/70 p-6"
//         />
//       </main>

//       {/* Über uns Bereich */}
//       <section className="bg-white/80 py-12 px-8 backdrop-blur-sm shadow-inner">
//         <div className="max-w-3xl mx-auto text-center">
//           <h2 className="text-3xl font-semibold mb-4 text-green-700">
//             Über uns
//           </h2>
//           <p className="text-gray-700 leading-relaxed">
//             Wir sind <strong>SFPZK</strong> – eine Plattform für Projekte, Lernen
//             und Zusammenarbeit. Unser Ziel ist es, Menschen zu verbinden und Wissen
//             zugänglich zu machen. Gemeinsam gestalten wir eine bessere Zukunft
//             durch Bildung, Austausch und Gemeinschaft.
//           </p>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="text-center text-sm text-gray-100 py-4 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 shadow-inner">
//         © {new Date().getFullYear()} SFPZK
//       </footer>
//     </div>
//   );
// }










import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen text-gray-100 flex flex-col">

      {/* HERO-BEREICH */}
      <section className="w-full h-[70vh] mt-20 relative">
        <img
          src="/hero.jpg"
          alt="Hintergrundbild"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-green-300 mb-4">
            S F P Z K
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl">
            Saziya Fêrkirin û Parastina Zimanê Kurdî
          </p>
        </div>
      </section>

      {/* HAUPTINHALT */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-16 space-y-24">
        {/* ÜBER UNS */}
        <section className="text-center">
          <h3 className="text-3xl font-semibold text-green-300 mb-4">
            Über uns
          </h3>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Wir sind eine Organisation, die sich auf Zusammenarbeit,
            Kreativität und kulturellen Austausch konzentriert. Unser Ziel ist
            es, Menschen zusammenzubringen und Wissen durch gemeinsames Lernen
            zugänglich zu machen.
          </p>
        </section>

        {/* UNSER ZIEL */}
        <section className="text-center">
          <h3 className="text-3xl font-semibold text-yellow-200 mb-4">
            Unser Ziel
          </h3>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Wir möchten Bildung, Training und Beteiligung fördern. Unser Ziel
            ist es, Menschen zu inspirieren, sich zu vernetzen, zu lernen und
            gemeinsam an einer besseren Zukunft zu arbeiten.
          </p>
        </section>

        {/* UNSERE ERFOLGE */}
        <section className="text-center">
          <h3 className="text-3xl font-semibold text-red-300 mb-4">
            Unsere Erfolge
          </h3>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {[
              {
                title: 'Gemeinschaftsprojekte',
                desc: 'Über 50 Projekte erfolgreich mit lokalen Partnern umgesetzt.',
              },
              {
                title: 'Bildungsprogramme',
                desc: 'Mehr als 200 Teilnehmer in unseren Lernveranstaltungen.',
              },
              {
                title: 'Kulturelle Veranstaltungen',
                desc: 'Mehrere erfolgreiche kulturelle Feste organisiert.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <h4 className="text-xl font-semibold text-gray-100 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
