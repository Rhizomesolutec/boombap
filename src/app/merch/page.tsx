import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merch | BOOMBAP",
  description: "BOOMBAP Vol.02 merch kit coming soon and Vol.01 stickers sold out.",
};

const stickerImages = [
  "/stickers/sticker1.png",
  "/stickers/sticker2.png",
  "/stickers/sticker3.png",
  "/stickers/sticker4.png",
  "/stickers/sticker5.png",
  "/stickers/sticker6.png",
  "/stickers/sticker7.png",
  "/stickers/sticker8.png",
];

export default function MerchPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-32 text-white md:px-10 md:py-40">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="mb-4 font-proxima text-[10px] font-bold uppercase tracking-[0.42em] text-primary">
            Merch
          </p>
          <h1 className="font-sarpanch text-[clamp(4rem,13vw,10rem)] font-black uppercase leading-[0.78]">
            BOOMBAP<br />Goods
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="relative min-h-[32rem] overflow-hidden border border-primary/30 bg-white/[0.03] p-7 md:p-9">
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
                <h2 className="mb-5 font-sarpanch text-4xl font-black uppercase leading-none md:text-6xl">
                  VOL.02<br />MERCH KIT
                </h2>
                <p className="max-w-md font-proxima text-base leading-relaxed text-white/62 md:text-lg">
                  Tee, patch, sticker sheet, and event wristband packed for the next BOOMBAP drop.
                </p>
              </div>
              <p className="mt-12 font-proxima text-[10px] uppercase tracking-[0.32em] text-white/35">
                Drop details soon
              </p>
            </div>
          </article>

          <article className="overflow-hidden border border-white/10 bg-white/[0.025]">
            <div className="relative grid aspect-[4/3] grid-cols-4 gap-3 bg-[#08080b] p-5 sm:p-7">
              {stickerImages.map((src, index) => (
                <div key={src} className="relative overflow-hidden border border-white/10 bg-black/55">
                  <Image
                    src={src}
                    alt={`BOOMBAP Vol.01 sticker ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 12vw, 24vw"
                    className="object-contain p-3"
                  />
                </div>
              ))}
              <span className="absolute left-4 top-4 border border-black/20 bg-primary px-3 py-2 font-proxima text-[8px] font-black uppercase tracking-[0.28em] text-black">
                Sold Out
              </span>
            </div>
            <div className="flex items-end justify-between gap-4 p-6 md:p-7">
              <div>
                <h2 className="font-sarpanch text-3xl font-black uppercase text-white">
                  VOL.01 Stickers
                </h2>
                <p className="mt-2 font-proxima text-xs uppercase tracking-[0.24em] text-white/35">
                  Archive sticker pack
                </p>
              </div>
              <p className="font-sarpanch text-xl font-black uppercase text-primary">Sold Out</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
