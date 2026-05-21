import Image from "next/image";
import Link from "next/link";
import MotionReveal from "../ui/MotionReveal";
import ScrambleText from "../ui/ScrambleText";

export default function Experience() {
  return (
    <section className="relative w-full min-h-screen flex items-center bg-black overflow-hidden border-t border-white/5 pt-20 md:pt-0">
      {/* Watermark Background */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 md:top-1/3 z-0 opacity-5 kinetic-title text-watermark whitespace-nowrap">
        EXPERIENCE
      </div>

      <div className="relative z-10 w-full">
        <div className="w-full flex flex-col md:flex-row-reverse">
          {/* IMAGE SIDE */}
          <div className="vhs-frame w-full md:w-1/2 h-[50vh] md:h-screen relative">
            <Image
              src="/boombap-experience.jpg"
              alt="The Experience"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-l from-black/40 to-transparent" />
          </div>

          {/* CONTENT SIDE */}
          <MotionReveal className="w-full md:w-1/2 p-8 md:p-24 flex flex-col justify-center">
            <span className="text-primary text-[10px] tracking-[0.4em] uppercase font-proxima font-bold mb-4 block">
              The Experience
            </span>
            <h2 className="kinetic-title text-white text-5xl md:text-6xl font-sarpanch font-black mb-8 leading-tight">
              VOL. 02<br />BENGALURU
            </h2>
            <div className="flex flex-col gap-8 mb-12">
              <div className="flex items-start gap-4 border-l border-white/10 pl-6">
                <span className="text-white/30 font-sarpanch text-sm pt-1">01.</span>
                <p className="text-white/66 text-lg font-proxima font-light leading-relaxed">Live sets from international underground masters.</p>
              </div>
              <div className="flex items-start gap-4 border-l border-white/10 pl-6">
                <span className="text-white/30 font-sarpanch text-sm pt-1">02.</span>
                <p className="text-white/66 text-lg font-proxima font-light leading-relaxed">Immersive audio-visual art installations.</p>
              </div>
              <div className="flex items-start gap-4 border-l border-white/10 pl-6">
                <span className="text-white/30 font-sarpanch text-sm pt-1">03.</span>
                <p className="text-white/66 text-lg font-proxima font-light leading-relaxed">A community of sound and soul.</p>
              </div>
            </div>
            <div>
                <Link
                  href="/tickets"
                  className="boombap-button boombap-button--ghost"
                >
                  <ScrambleText text="Secure Tickets" />
                </Link>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
