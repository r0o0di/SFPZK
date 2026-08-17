import { gsap, ScrollTrigger } from "@/lib/gsap";
// ttt

export default function HomePage() {
  const founders = [
    { id: 1, name: "M. Kemal Hennan", deceased: true },
    { id: 2, name: "Dr. Mihemed Ebdo Elî", deceased: false },
    { id: 3, name: "M. Merwan Berekat", deceased: false },
    { id: 4, name: "M. Mihemed Şêx Birîmce", deceased: true },
    { id: 5, name: "M. Kemal Ebdalo", deceased: false },
    { id: 6, name: "M. Kaziklî Kemal", deceased: false },
    { id: 7, name: "M. Mihemed Qere Hesen", deceased: false },
    { id: 8, name: "M. Nûşîn Bêcirmanî", deceased: false },
    { id: 9, name: "M. Diljar Seyda", deceased: true },
    { id: 10, name: "M. Osman Mihemed", deceased: false },
    { id: 11, name: "Salih Osman", deceased: true },
    { id: 12, name: "Ehmed bavê Omîd", deceased: false },
    { id: 13, name: "Mustafa Elaş", deceased: true },
  ];
  const scrollingFounders = [...founders, ...founders];


  const books = [
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
  ];
  const scrollingBooks = [...books, ...books];

  return (
    <div className="min-h-screen text-gray-100 flex flex-col">

      {/* HERO-BEREICH */}
      {/* <section className="w-full h-[70vh] mt-20 relative"> */}
      <section className="w-full h-[85vh] relative mt-[50px]">
        <img
          src="/hero.webp"
          alt="Bingehên SFPZK"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-green-300 mb-4">
            S F P Z K
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mb-[75px]">
            Saziya Fêrkirin û Parastina Zimanê Kurdî
          </p>
        </div>
      </section>

      {/* HAUPTINHALT */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-16 space-y-24">

        {/* SAZIYA ME */}
        <section>
          <h3 className="text-3xl font-semibold text-red-300 mb-4">
            Saziya Me
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Ji ber giringî û pêwîstiya zimanê kurdî, ku hebûna gelê Kurd bi hebûna wî ve girêdayî ye.
            Çend zimanhez, welatparêz û xemxurên zimanê kurdî li hev kirin ku saziyekê ji bo
            fêrkirin û parastina zimanê kurdî damezirînin.
          </p>
        </section>

        {/* DAMEZiRANDIN */}
        <section>
          <h3 className="text-3xl font-semibold text-red-300 mb-4">
            Damezirandin
          </h3>
          <div className="relative w-full overflow-hidden mb-2">
            <div className="founders flex animate-scroll-smooth gap-6">
              {
                scrollingFounders.map((item, i) => (
                  <div
                    key={i}
                    className={`relative flex-shrink-0 bg-gray-800  shadow-md transition-all hover:scale-[1.02]`}
                  >
                    {item.deceased && (
                      <>
                        <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden rounded-tl-xl">
                          <div className="absolute -left-8 top-4 w-24 rotate-[-45deg] border-t-7 border-black" />
                        </div>

                        <div className="absolute top-[1px] left-[2px] text-xs text-gray-400">
                          🕊
                        </div>
                      </>
                    )}

                    <div className="flex h-full flex-col items-center justify-center px-7 text-center">
                      <span className="text-sm text-gray-500 ">

                        #{item.id}
                      </span>
                      <h4
                        className={`mb-3 text-xl font-semibold leading-snug ${item.deceased ? "text-gray-300" : "text-gray-100"
                          }`}
                      >
                        {item.name}
                      </h4>


                    </div>
                    <div className="pointer-events-none absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-gray-900 to-transparent" />
                    <div className="pointer-events-none absolute top-0 right-0 h-full w-4 bg-gradient-to-l from-gray-900 to-transparent" />

                  </div>
                ))}

            </div>

            <div className="pointer-events-none absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-gray-900 to-transparent" />
            <div className="pointer-events-none absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-gray-900 to-transparent" />
          </div>

          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Di sala 2006an de li bajarê Helebê, sazî bi beşdarbûna 13 mamosteyên zimanperwer hate damezirandin.
            Piştî damezirandinê, şaxên saziyê li hemû deverên kurdnişîn û li bajarên din ên Sûriyê wek
            (Şam, Helebê) hatin damezirandin.
          </p>



        </section>

        {/* ŞAXA EWROPAYÊ */}
        <section>
          <h3 className="text-3xl font-semibold text-red-300 mb-4">
            Şaxa Ewropayê
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Piştî krîzeya Sûriyê û koçberkirina bi sed hezaran ji gelê me yê Rojavayê Kurdistanê berve Ewropayê,
            hin mamosteyên ku berê di saziyê de kar dikirin, xwestin ku karê xwe berdewam bikin
            û şaxeke saziyê li Ewropayê jî damezirînin.
            Li 06.07.2019an li bajarê Bochum, şaxa Almanyayê hate damezirandin.
            Di 19.08.2023an de jî li bajarê Bremen navê wê hate guhertin bû “Şaxa Ewropayê”.
          </p>
        </section>

        {/* XEBAT Û FÊRKIRIN */}
        <section>
          <h3 className="text-3xl font-semibold text-red-300 mb-4">
            Xebat û Fêrkirin
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Li hemû deverên ku şaxên saziyê hene, kar li ser fêrkirin û parastina zimanê kurdî bi
            hez û xebat tê kirin. Bi hezaran xwendekar ji sê astên xwendinê derçûn û fêrnameyên xwe
            wergirtin. Alfabeya mamoste Mihemed Emîn Bozarslan hate bikaranîn û çend pirtûkên
            fêrkirinê hatin çap kirin û belav kirin.
          </p>
        </section>

        {/* PIRTÛK Û FÊRNAMÊ */}
        <section className="overflow-hidden">
          <h3 className="text-3xl font-semibold text-red-300 mb-8">
            Pirtûk
          </h3>

          <div className="relative w-full overflow-hidden">
            <div className="flex animate-scroll-smooth gap-6">
              {
                scrollingBooks.map((item, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 min-w-[18rem] max-w-[20rem] bg-gray-800 border border-gray-700 rounded-xl p-6 text-center shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                  >
                    <h4 className="text-xl font-semibold text-gray-100 mb-2 break-words">
                      {item.title}
                    </h4>
                    <p className="text-gray-400 text-sm whitespace-pre-wrap break-words leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
            </div>

            {/* fade on edges */}
            <div className="pointer-events-none absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-gray-900 to-transparent"></div>
            <div className="pointer-events-none absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-gray-900 to-transparent"></div>
          </div>
        </section>


        {/* ARMANCÊN ME */}
        <section>
          <h3 className="text-3xl font-semibold text-red-300 mb-4">
            Armancên Me
          </h3>
          <ul className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto text-left list-disc list-outside min-[900px]:pl-0 pl-6 space-y-1">
            <li>Piştgiriya axaftin û peywendiya bi zimanê dayikê</li>
            <li>Hezikirina zimanê kurdî bi hemû pêkhateyên civaka Kurd, nemaze jî nifşa nû</li>
            <li>Fêrkirin û xwendin bi zimanê kurdî, ji bo parastin û pêşxistina zimanê kurdî, li hemî deverên kurdnişîn û deverên din ên ku Kurd lê dijîn</li>
            <li>Hewildan bo fermîkirina zimanê kurdî li diyaspora û dibistanan</li>
          </ul>
        </section>

        {/* PIŞTEVANIYA YEKÎTÎ */}
        {/* <section>
          <h3 className="text-3xl font-semibold text-red-300 mb-4">
            Piştevaniya Yekîtî
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Ji bo ku sazî bisekine û bi pêşbikeve, Partiya Yekîtî ya Demokrat a Kurd li Sûriyê
            piştevaniya xwe da. Digel vê yekê jî sazî di kar û biryarên xwe de serbixwe ye
            û hemû kesên zimanhez û yên ku dixwazin fêrî zimanê kurdî bibin, çi Kurd bin û çi jî ji neteweyên din,
            bi dilgermî pêşwazî dike.
          </p>
        </section> */}

      </main>
    </div>
  )
}