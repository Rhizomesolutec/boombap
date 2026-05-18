import Image from "next/image";
import MotionReveal from "../ui/MotionReveal";

const merchItems = [
  {
    title: "Archive Tee",
    tag: "Drop 01",
    price: "₹1,499",
    image: "/bmbp-whiteblack-logo.png",
    tone: "bg-white",
  },
  {
    title: "Bassline Hoodie",
    tag: "Limited",
    price: "₹2,999",
    image: "/bmbp-green-logo.png",
    tone: "bg-zinc-950",
  },
  {
    title: "Cypher Cap",
    tag: "Streetwear",
    price: "₹899",
    image: "/bmbp-violet-logo.png",
    tone: "bg-[#141019]",
  },
];

export default function MerchSection() {
  return (
    <section id="merch" className="relative w-full overflow-hidden border-t border-white/5 bg-black py-24 md:py-32">
      <div className="absolute left-1/2 top-10 z-0 -translate-x-1/2 opacity-5">
        <span className="kinetic-title text-watermark whitespace-nowrap">MERCH</span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <MotionReveal className="mb-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-4 block font-proxima text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              Merch Table
            </span>
            <h2 className="font-sarpanch text-5xl font-black leading-tight text-white md:text-6xl">
              WEAR THE<br />MOVEMENT
            </h2>
          </div>
          <p className="max-w-md font-proxima text-lg leading-relaxed text-white/58 md:text-right">
            Small-run pieces for the people on the floor, behind the decks, and outside after the last track.
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <MotionReveal className="relative min-h-[32rem] overflow-hidden border border-primary/30 bg-white/[0.03] p-7 md:p-9">
            <div className="absolute inset-0 opacity-[0.08]" style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #ffffff 0 1px, transparent 1px 18px)",
            }} />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <span className="mb-5 inline-flex border border-primary/60 px-3 py-2 font-proxima text-[9px] font-bold uppercase tracking-[0.35em] text-primary">
                  First Drop
                </span>
                <h3 className="mb-5 font-sarpanch text-4xl font-black uppercase leading-none text-white md:text-5xl">
                  VOL.02<br />KIT
                </h3>
                <p className="max-w-sm font-proxima text-base leading-relaxed text-white/62">
                  Tee, patch, sticker sheet, and event wristband packed like an old record-store handoff.
                </p>
              </div>

              <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-proxima text-[10px] uppercase tracking-[0.32em] text-white/35">
                    Starting at
                  </p>
                  <p className="mt-2 font-sarpanch text-3xl font-black text-white">₹899</p>
                </div>
                <a href="#" className="boombap-button">
                  Shop Drop
                </a>
              </div>
            </div>
          </MotionReveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {merchItems.map((item, idx) => (
              <MotionReveal
                key={item.title}
                className="group relative overflow-hidden border border-white/10 bg-white/[0.025]"
                transition={{ delay: idx * 0.1 }}
              >
                <div className={`relative aspect-[4/5] ${item.tone}`}>
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/30" />
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 100vw"
                    className="object-contain p-10 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[-3deg]"
                  />
                  <span className="absolute left-4 top-4 border border-black/20 bg-primary px-3 py-2 font-proxima text-[8px] font-black uppercase tracking-[0.28em] text-black">
                    {item.tag}
                  </span>
                </div>
                <div className="flex items-end justify-between gap-4 p-5">
                  <div>
                    <h3 className="font-sarpanch text-xl font-black uppercase text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 font-proxima text-xs uppercase tracking-[0.26em] text-white/35">
                      BOOMBAP Goods
                    </p>
                  </div>
                  <p className="font-sarpanch text-lg font-black text-primary">{item.price}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
