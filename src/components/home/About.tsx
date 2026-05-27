import Image from "next/image";
import MotionReveal from "../ui/MotionReveal";
import ScrambleText from "../ui/ScrambleText";

const culturePoints = [
  "Floor-first event recaps",
  "Artist and crew archive",
  "Ticket drops and merch runs",
  "Street-level music stories",
];

export default function AboutLanding() {
  return (
    <>
      <section id="culture" className="relative w-full bg-black overflow-hidden border-t border-white/5 py-24 md:py-28">
        <div className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2 z-0 opacity-5 kinetic-title text-watermark whitespace-nowrap">
          ARCHIVE
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <MotionReveal className="mb-12 grid gap-7 md:grid-cols-[0.82fr_1.18fr] md:items-start">
            <div>
              <span className="text-primary text-[10px] tracking-[0.4em] uppercase font-proxima mb-4 block">
                About Boombap
              </span>
              <h2 className="text-white text-4xl sm:text-5xl md:text-6xl font-sarpanch font-black leading-tight tracking-tight">
                UNDERGROUND<br />MOVEMENT
              </h2>
            </div>
            <div className="grid gap-5 border-l border-primary/50 pl-5 md:pl-7">
              <p className="text-white/66 text-lg md:text-xl font-proxima font-light max-w-2xl leading-relaxed">
                Coming from Under A Devil Inside, BOOMBAP is a digital underground space built around rap culture, live energy, and community.
              </p>

              {/* Premium BOOMBAP Radio banner with live indicator and pattern overlay */}
              <div className="relative flex flex-col gap-3 border border-primary/30 bg-primary/[0.03] backdrop-blur-xs px-5 py-4 md:flex-row md:items-center md:justify-between overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: "repeating-linear-gradient(45deg, var(--color-primary) 0 1px, transparent 1px 10px)"
                  }}
                />
                <div className="relative z-10 flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                    </span>
                    <span className="block font-sarpanch text-sm font-black uppercase tracking-[0.16em] text-primary">
                      BOOMBAP Radio
                    </span>
                  </div>
                  <p className="mt-1.5 font-proxima text-[10px] uppercase tracking-[0.18em] text-white/48">
                    Live from the culture
                  </p>
                </div>
                <p className="relative z-10 font-proxima text-[10px] uppercase tracking-[0.18em] text-white/62 border-t border-white/5 pt-2 md:border-t-0 md:pt-0">
                  Podcasts // Live Sets // Cyphers
                </p>
              </div>

              {/* Enhanced Interactive Culture Points */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {culturePoints.map((item, idx) => (
                  <div
                    key={item}
                    className="group/item border border-white/10 bg-white/[0.02] backdrop-blur-xs p-4 transition-all duration-300 hover:border-primary/40 hover:bg-primary/[0.02]"
                  >
                    <span className="mb-3 block font-sarpanch text-xs text-primary/80 transition-colors group-hover/item:text-primary">
                      // {String(idx + 1).padStart(2, "0")}
                    </span>
                    <p className="font-proxima text-[10px] uppercase tracking-[0.18em] leading-relaxed text-white/58 group-hover/item:text-white transition-colors">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </MotionReveal>

          {/* Equal height bottom card grid using items-stretch and ticker-hover symmetry */}
          <div className="w-full">
            <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    img: "/boombap-event.jpg",
                    tag: "LIVE ENERGY",
                    title: "Events, Tickets, Recaps",
                    copy: "Explore upcoming nights, buy tickets, and watch VOL.01 moments pulled from the floor."
                  },
                  {
                    img: "/crowd-section.png",
                    tag: "PEOPLE",
                    title: "Artists, Culture, Community",
                    copy: "Discover the voices, crews, faces, and street-level movement around the sound."
                  }
                ].map((item, idx) => (
                  <MotionReveal
                    key={item.title}
                    className="ticker-hover group relative overflow-hidden aspect-4/5 border border-white/10 bg-white/5"
                    transition={{ delay: idx * 0.12 }}
                  >
                    <Image
                      src={item.img}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/45 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-7">
                      <span className="text-primary text-[8px] tracking-[0.3em] uppercase font-proxima mb-3">{item.tag}</span>
                      <h3 className="text-white text-2xl font-sarpanch font-bold leading-tight mb-3">{item.title}</h3>
                      <p className="text-white/58 text-sm leading-relaxed font-proxima">{item.copy}</p>
                    </div>
                  </MotionReveal>
                ))}
              </div>

              {/* Refactored Devil Inside Records Card to match left column height, add hover animation and improve watermark */}
              <MotionReveal delay={0.24} className="h-full">
                <div className="ticker-hover group relative flex h-full flex-col justify-between overflow-hidden border border-primary/25 bg-white/2.5 p-7 md:p-8">
                  {/* Transformed watermark to scale slightly on group hover and bleed out organically at the bottom-right corner */}
                  <span className="pointer-events-none absolute -right-6 -bottom-10 md:-right-8 md:-bottom-12 font-sarpanch text-[10rem] md:text-[13rem] font-black leading-none text-white/[0.025] select-none transition-transform duration-700 group-hover:scale-105">
                    DIR
                  </span>

                  <div className="absolute right-7 top-7 hidden h-24 w-24 items-center justify-center border border-white/10 bg-black/45 md:flex transition-colors group-hover:border-primary/30">
                    <Image
                      src="/DIR-logo.png"
                      alt=""
                      width={72}
                      height={72}
                      className="h-16 w-16 object-contain opacity-80"
                    />
                  </div>
                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <span className="text-primary text-[10px] tracking-[0.35em] uppercase font-proxima mb-5 block">
                        Devil Inside Records
                      </span>
                      <h3 className="text-white text-3xl md:text-4xl font-sarpanch font-black leading-tight mb-5">
                        INDEPENDENT.<br />ANTI-ESTABLISHMENT.
                      </h3>
                      <p className="text-white/66 text-lg font-proxima font-light leading-relaxed mb-6">
                        Devil Inside Records is an independent record label dedicated to the rawest corners of underground rap and hip-hop. It backs uncompromising artists, gritty cinematic sound, and real stories without chasing polished mainstream rules.
                      </p>
                    </div>
                    <a
                      href="https://devil-inside-records.vercel.app/"
                      target="_blank"
                      rel="noreferrer"
                      className="boombap-button boombap-button--ghost w-fit mt-auto"
                    >
                      <ScrambleText text="Visit Label" />
                    </a>
                  </div>
                </div>
              </MotionReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
