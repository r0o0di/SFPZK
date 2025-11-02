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











export default function HomePage() {
  return (
    <div className="min-h-screen text-gray-100 flex flex-col">

      {/* HERO-BEREICH */}
      <section className="w-full h-[70vh] mt-20 relative">
        <img
          src="/hero.jpg"
          alt="Bingehên SFPZK"
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

        {/* SAZIYA ME */}
        <section>
          <h3 className="text-3xl font-semibold text-red-300 mb-4">
            Saziyê Me
          </h3>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Ji ber giringî û pêwîstiya zimanê kurdî, ku hebûna gelê Kurd bi hebûna wî ve girêdayî ye.
            Çend zimanhez, welatparêz û xemxurên zimanê kurdî li hev kirin ku saziyek ji bo
            fêrkirin û parastina zimanê kurdî damezrînin.
          </p>
        </section>

        {/* DAMEZRANDIN */}
        <section>
          <h3 className="text-3xl font-semibold text-red-300 mb-4">
            Damezrandin
          </h3>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Di sala 2006an de li bajarê Helebê, sazî bi beşdarbûna mamosteyan zimanperwer hate damezrandin.
            Piştî damezrandinê, şaxên saziyê li hemû deverên kurdnîşîn û li bajarên din ên Sûriyê
            (wek Şam, Reqa, Helebê) hatin damezrandin.
          </p>
        </section>

        {/* ŞAXA EWROPAYÊ */}
        <section>
          <h3 className="text-3xl font-semibold text-red-300 mb-4">
            Şaxa Ewropayê
          </h3>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Piştî krîzeya Sûriyê û koçkirina bi sed hezaran ji gelê me yên Rojavayê Kurdistanê,
            hin mamosteyên ku berê di saziyê de kar dikirin, xwestin ku karê xwe berdewam bikin
            û şaxekî saziyê li Ewropayê jî damezrînin.
            Li 06.07.2019ê li bajarê Essen, şaxa Almanyayê hate damezrandin.
            Di 19.08.2023ê de jî li Bremen navê wê hate guhertin bo “Şaxa Ewropayê”.
          </p>
        </section>

        {/* XEBAT Û FÊRKIRIN */}
        <section>
          <h3 className="text-3xl font-semibold text-red-300 mb-4">
            Xebat û Fêrkirin
          </h3>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Li hemû deverên ku şaxên saziyê hene, kar li ser fêrkirin û parastina zimanê kurdî bi
            hez û xebat tê kirin. Bi hezaran xwendekar ji sê astên xwendinê derçûn û fêrnameyên xwe
            wergirtin. Alfabeya mamoste Mihemed Emîn Bozarslan hate bikaranîn û çend pirtûkên
            fêrkî hatin çap kirin û belav kirin.
          </p>
        </section>

        {/* PIRTÛK Û FÊRNAMÊ */}
        <section>
          <h3 className="text-3xl font-semibold text-red-300 mb-4">
            Pirtûk û Fêrnamê
          </h3>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {[
              {
                title: 'Zimanê Kurdî Fêr Dibim',
                desc: 'M. Merwan Berekat (çapkirî & PDF)',
              },
              {
                title: 'Rêzimana Kurdî',
                desc: 'Endez. Memê Alan, Dr. Mihemed Ebdo Elî, Kamîran Bêkes (niha nayê bikaranîn)',
              },
              {
                title: 'Nasîna Zimanê Kurdî',
                desc: 'Dr. Mihemed Ebdo Elî (çapkirî & PDF)',
              },
              {
                title: 'Ji Bingehên Rêzimana Kurdî',
                desc: 'Dr. Mihemed Ebdo Elî (çapkirî & PDF)',
              },
              {
                title: 'Bingehên Fêrkirina Rêzimana Zimanê Kurdî, ji bo Qonaxa 1em',
                desc: 'M. Dilovanê Deştê',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <h4 className="text-xl font-semibold text-gray-100 mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ARMANCÊN ME */}
        <section>
          <h3 className="text-3xl font-semibold text-red-300 mb-4">
            Armancên Me
          </h3>
          <ul className="text-gray-300 leading-relaxed max-w-3xl mx-auto text-left list-disc list-inside space-y-1">
            <li>Piştgiriya axaftin û peywandina bi zimanê dayikê</li>
            <li>Hezikirina zimanê kurdî bi hemû pêkhateyên civaka Kurdî, nemaze jî nifşa nû</li>
            <li>Fêrkirin û xwendin bi zimanê kurdî, ji bo parastin û pêşxistina zimanê kurdî, li hemî deverên kurdnişîn û deverên din ên ku Kurd lê dijîn</li>
            <li>Hewldan bo fermîkirina zimanê kurdî li diyaspora û dibistanan</li>
          </ul>
        </section>

        {/* PIŞTEVANIYA YEKÎTÎ */}
        <section>
          <h3 className="text-3xl font-semibold text-red-300 mb-4">
            Piştevaniya Yekîtî
          </h3>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Ji bo ku sazî bisekine û bi pêşbikeve, Partiya Yekîtî ya Demokrat a Kurd li Sûriyê
            piştevaniya xwe da. Digel vê yekê jî sazî di kar û biryarên xwe de serbixwe ye
            û hemû kesên zimanhez û yên ku dixwazin fêrî zimanê kurdî bibin, çi Kurd bin û çi jî ji neteweyên din,
            bi dilgermî pêşwazî dike.
          </p>
        </section>

      </main>
    </div>
  )
}