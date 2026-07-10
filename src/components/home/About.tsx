import Image from "next/image";
import type { CSSProperties } from "react";
import ScrambleText from "../ui/ScrambleText";
import MotionReveal from "../ui/MotionReveal";

const strips = [
  { top: "7%", left: "18%", width: "64%", height: "16%", delay: "0s" },
  { top: "29%", left: "4%", width: "86%", height: "13%", delay: "-1.7s" },
  { top: "48%", left: "25%", width: "70%", height: "19%", delay: "-3.2s" },
  { top: "74%", left: "10%", width: "58%", height: "12%", delay: "-4.4s" },
];

const rails = [
  ["Floor", "Events and recaps"],
  ["Archive", "Artists and crews"],
  ["Radio", "Sets and cyphers"],
  ["Drops", "Tickets and merch"],
];

export default function AboutLanding() {
  return (
    <section id="culture" className="relative overflow-hidden border-t border-white/5 bg-black py-24 text-white md:py-32">
      <style>{`
        .about-map {
          background:
            linear-gradient(90deg, rgba(160,239,70,0.12) 1px, transparent 1px) 0 0 / 5.8rem 100%,
            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px) 0 0 / 100% 5.8rem;
          mask-image: linear-gradient(90deg, transparent, black 20%, black 82%, transparent);
        }

        .about-slice {
          clip-path: polygon(2.2rem 0, 100% 0, calc(100% - 2.2rem) 100%, 0 100%);
          animation: aboutSliceFloat 8s ease-in-out infinite;
          animation-delay: var(--slice-delay);
        }

        @keyframes aboutSliceFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(1.1rem, -0.5rem, 0); }
        }

        .about-frequency {
          animation: aboutFrequency 22s linear infinite;
        }

        @keyframes aboutFrequency {
          to { transform: rotate(360deg); }
        }

        .about-readout::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(160,239,70,0.18), transparent);
          transform: translateX(-120%);
          animation: aboutReadout 5s ease-in-out infinite;
        }

        @keyframes aboutReadout {
          0%, 45% { transform: translateX(-120%); }
          75%, 100% { transform: translateX(120%); }
        }
      `}</style>
      
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <MotionReveal>
            <span className="mb-5 block font-proxima text-[10px] font-bold uppercase tracking-[0.42em] text-primary">
              About Boombap
            </span>

            <h2 className="max-w-xl font-sarpanch text-[clamp(2.2rem,4.8vw,5rem)] font-black uppercase leading-[0.94] text-white">
              A signal for the underground.
            </h2>

            <p className="mt-7 max-w-lg font-proxima text-base font-light leading-relaxed text-white/62 md:text-lg">
              BOOMBAP documents the rap culture, live energy, and community already moving through the city.
            </p>

            {/* <div className="about-readout relative mt-8 max-w-lg overflow-hidden border-l border-primary/35 bg-black/72 px-5 py-5 backdrop-blur-md">
              <div className="relative z-10 flex gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-white/10 bg-white/[0.03]">
                  <Image
                    src="/DIR-logo.png"
                    alt="Devil Inside Records"
                    width={46}
                    height={46}
                    className="h-11 w-11 object-contain opacity-85"
                  />
                </div>

                <div>
                  <span className="font-proxima text-[8px] font-bold uppercase tracking-[0.34em] text-primary">
                    Manifest
                  </span>
                  <p className="mt-3 font-sarpanch text-xl font-black uppercase leading-[0.96] text-white md:text-2xl">
                    We are showing what already exists here.
                  </p>
                  <a
                    href="https://devilinsiderecords.in/"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex font-sarpanch text-[10px] font-black uppercase tracking-[0.18em] text-primary transition-colors hover:text-white"
                  >
                    <ScrambleText text="Visit DIR" />
                  </a>
                </div>
              </div>
            </div> */}

            <div className="mt-10 max-w-lg border-y border-white/10">
              {rails.map(([title, value], index) => (
                <div key={title} className="grid grid-cols-[3.2rem_1fr] items-center border-b border-white/10 py-4 last:border-b-0">
                  <span className="font-sarpanch text-xs font-black text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="grid gap-1 sm:grid-cols-[0.62fr_1fr] sm:items-center">
                    <h3 className="font-sarpanch text-base font-black uppercase text-white">{title}</h3>
                    <p className="font-proxima text-[10px] font-bold uppercase tracking-[0.22em] text-white/42">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </MotionReveal>

          <MotionReveal delay={0.12} className="relative min-h-[31rem] md:min-h-[40rem]">
            <div className="absolute left-1/2 top-1/2 h-[min(72vw,31rem)] w-[min(72vw,31rem)] -translate-x-1/2 -translate-y-1/2">
              <div className="about-frequency absolute inset-0 border border-dashed border-primary/35" />
              <div className="absolute inset-8 border border-white/10" />
              <div className="absolute inset-16 border border-secondary/35" />

              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-black px-3 font-proxima text-[8px] font-bold uppercase tracking-[0.28em] text-primary">
                Live culture
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-black px-3 font-proxima text-[8px] font-bold uppercase tracking-[0.28em] text-white/38">
                Chennai frequency
              </div>
            </div>

            <div className="absolute inset-0">
              {strips.map((strip, index) => (
                <div
                  key={index}
                  className="about-slice absolute overflow-hidden border border-white/10 bg-white/[0.025]"
                  style={{
                    top: strip.top,
                    left: strip.left,
                    width: strip.width,
                    height: strip.height,
                    "--slice-delay": strip.delay,
                  } as CSSProperties & { "--slice-delay": string }}
                >
                  <Image
                    src={index % 2 === 0 ? "/boombap-event.jpg" : "/crowd-section.png"}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 48vw, 100vw"
                    className="object-cover opacity-80 saturate-110"
                    style={{
                      objectPosition: index % 2 === 0 ? "center 46%" : "center 54%",
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-black/62 via-transparent to-black/30" />
                </div>
              ))}
            </div>

          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
