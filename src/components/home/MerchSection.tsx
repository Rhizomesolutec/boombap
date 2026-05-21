import Image from "next/image";
import Link from "next/link";
import MotionReveal from "../ui/MotionReveal";
import ScrambleText from "../ui/ScrambleText";

const stickerImages = [
  "/stickers/sticker1.png",
  "/stickers/sticker2.png",
  "/stickers/sticker3.png",
  "/stickers/sticker4.png",
];

function StickerPreview() {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-3 p-7">
      {stickerImages.map((src, index) => (
        <div
          key={src}
          className="relative overflow-hidden border border-white/10 bg-black/55"
        >
          <Image
            src={src}
            alt={`BOOMBAP Vol.01 sticker ${index + 1}`}
            fill
            sizes="(min-width: 768px) 18vw, 45vw"
            className="object-contain p-4"
          />
        </div>
      ))}
    </div>
  );
}

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
              BOOMBAP<br />GOODS
            </h2>
          </div>
          <p className="max-w-md font-proxima text-lg leading-relaxed text-white/58 md:text-right">
            Small-run drops from the floor, the archive, and the next signal.
          </p>
        </MotionReveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <MotionReveal className="relative min-h-[30rem] overflow-hidden border border-primary/30 bg-white/[0.03] p-7 md:p-9">
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, #ffffff 0 1px, transparent 1px 18px)",
              }}
            />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <span className="mb-5 inline-flex border border-primary/60 px-3 py-2 font-proxima text-[9px] font-bold uppercase tracking-[0.35em] text-primary">
                  Coming Soon
                </span>
                <h3 className="mb-5 font-sarpanch text-4xl font-black uppercase leading-none text-white md:text-5xl">
                  VOL.02<br />MERCH KIT
                </h3>
                <p className="max-w-sm font-proxima text-base leading-relaxed text-white/62">
                  Tee, patch, sticker sheet, and event wristband packed for the next BOOMBAP drop.
                </p>
              </div>

              <div className="mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <p className="font-proxima text-[10px] uppercase tracking-[0.32em] text-white/35">
                  Drop details soon
                </p>
                <Link href="/merch" className="boombap-button">
                  <ScrambleText text="View Merch" />
                </Link>
              </div>
            </div>
          </MotionReveal>

          <MotionReveal delay={0.12} className="group overflow-hidden border border-white/10 bg-white/[0.025]">
            <div className="relative aspect-[4/3] bg-[#08080b]">
              <StickerPreview />
              <span className="absolute left-4 top-4 border border-black/20 bg-primary px-3 py-2 font-proxima text-[8px] font-black uppercase tracking-[0.28em] text-black">
                Sold Out
              </span>
            </div>
            <div className="flex items-end justify-between gap-4 p-6">
              <div>
                <h3 className="font-sarpanch text-2xl font-black uppercase text-white">
                  VOL.01 Stickers
                </h3>
                <p className="mt-2 font-proxima text-xs uppercase tracking-[0.24em] text-white/35">
                  Archive sticker pack
                </p>
              </div>
              <p className="font-sarpanch text-lg font-black uppercase text-primary">Sold Out</p>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
