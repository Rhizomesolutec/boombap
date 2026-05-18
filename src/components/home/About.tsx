import Image from "next/image";
import MotionReveal from "../ui/MotionReveal";

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
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-0 opacity-5">
          <span className="kinetic-title text-watermark whitespace-nowrap">ARCHIVE</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <MotionReveal className="mb-12 grid gap-7 md:grid-cols-[0.82fr_1.18fr] md:items-end">
            <div>
              <span className="text-primary text-[10px] tracking-[0.4em] uppercase font-proxima mb-4 block">
                About Boombap
              </span>
              <h2 className="text-white text-5xl md:text-6xl font-sarpanch font-black leading-tight">
                UNDERGROUND<br />MOVEMENT
              </h2>
            </div>
            <div className="grid gap-5 border-l border-primary/50 pl-5 md:pl-7">
              <p className="text-white/66 text-lg md:text-xl font-proxima font-light max-w-2xl leading-relaxed">
                Coming from Under A Devil Inside, BOOMBAP is a digital underground space built around rap culture, live energy, and community.
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {culturePoints.map((item, idx) => (
                  <div key={item} className="border border-white/10 bg-white/[0.025] p-3">
                    <span className="mb-2 block font-sarpanch text-xs text-primary">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <p className="font-proxima text-[10px] uppercase tracking-[0.18em] leading-relaxed text-white/58">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </MotionReveal>

          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  img: "/dj-section.png",
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
                  className="ticker-hover group relative overflow-hidden aspect-[4/5] border border-white/10 bg-white/5"
                  transition={{ delay: idx * 0.12 }}
                >
                  <Image
                    fill
                    src={item.img}
                    alt={item.title}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
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

            <MotionReveal delay={0.24} className="grid h-full gap-6 lg:grid-rows-[1fr_auto]">
              <div className="relative flex min-h-[28rem] overflow-hidden border border-primary/25 bg-white/[0.025] p-7 md:p-8">
                <span className="pointer-events-none absolute -right-4 bottom-0 font-sarpanch text-[9rem] font-black leading-none text-white/[0.025] md:text-[12rem]">
                  DIR
                </span>
                <div className="absolute right-7 top-7 hidden h-24 w-24 items-center justify-center border border-white/10 bg-black/45 md:flex">
                  <Image
                    src="/DIR-logo.png"
                    alt=""
                    width={72}
                    height={72}
                    className="h-16 w-16 object-contain opacity-80"
                  />
                </div>
                <div className="relative z-10 flex max-w-lg flex-col justify-between">
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
                    className="boombap-button boombap-button--ghost w-fit"
                  >
                    Visit Label
                  </a>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>
    </>
  )
}
