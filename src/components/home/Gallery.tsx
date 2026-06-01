import Image from "next/image";
import MotionReveal from "../ui/MotionReveal";
import ScrambleText from "../ui/ScrambleText";


export default function Gallery() {
  return (
    <section id="gallery" className="relative w-full py-24 bg-black overflow-hidden border-t border-white/5">
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-0 opacity-5">
        <span className="kinetic-title text-watermark whitespace-nowrap">ENERGY</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <MotionReveal className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <span className="text-primary text-[10px] tracking-[0.4em] uppercase font-proxima mb-4 block">
              The Gallery
            </span>
            <h2 className="text-white text-5xl md:text-6xl font-sarpanch font-black leading-tight">
              LATEST<br />ENERGY
            </h2>
          </div>
          <a href="/vol1-recap" className="text-white hover:text-primary transition-colors font-sarpanch text-xs uppercase tracking-widest border-b border-white/20 pb-2">
            <ScrambleText text="View all work" /> →
          </a>
        </MotionReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { img: '/recaps/gallery1.jpg', tag: 'CULTURE', title: 'Street Soul' },
            { img: '/recaps/gallery2.jpg', tag: 'GEAR', title: 'Analog Vibe' },
            { img: '/recaps/gallery3.jpg', tag: 'NIGHTS', title: 'Neon Pulse' },
          ].map((item, idx) => (
            <MotionReveal
              key={item.title}
              className="ticker-hover group relative overflow-hidden aspect-square border border-white/10"
              transition={{ delay: idx * 0.1 }}
            >
              <Image
                fill
                src={item.img}
                alt={item.title}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover group-hover:scale-110 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="text-primary text-[8px] tracking-[0.3em] uppercase font-proxima mb-2">{item.tag}</span>
                <h3 className="text-white text-2xl font-sarpanch font-bold">{item.title}</h3>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
