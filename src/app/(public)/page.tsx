import HeroSection from "../../components/home/HeroSection";
import MarqueeStrip from "../../components/home/BoomBapStrip";
import AboutLanding from "../../components/home/About";
import MerchSection from "../../components/home/MerchSection";
import ContactSection from "../../components/home/ContactSection";
import Experience from "../../components/home/Experience";
import Gallery from "../../components/home/Gallery";
import MHeroSection from "@/src/components/home/MHeroSection";
import Image from "next/image";
import MotionReveal from "@/src/components/ui/MotionReveal";

export default function Home() {


  return (
    <main className="relative isolate bg-black">

      {/* ─── SECTION 0: HERO ─── */}
      <div className="sticky top-0 z-0 h-svh overflow-hidden">
        {/* <HeroSection /> */}
        <MHeroSection />
      </div>

      <div className="relative z-10 bg-black">
        {/* ─── SECTION 1: ABOUT ─── */}

        <AboutLanding />

        <section className="relative overflow-hidden bg-black border-t border-b border-white/10 w-full">
          <style>{`
            .sab6-filter {
              filter: url(#remove-white-filter);
            }
            .sab6-image-panel {
              clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
            }
            @media (max-width: 767px) {
              .sab6-image-panel {
                clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
              }
            }
            .sab6-image-panel::after {
              content: "";
              position: absolute;
              inset: 0;
              background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px);
              pointer-events: none;
              z-index: 2;
            }
          `}</style>
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <filter id="remove-white-filter">
              <feColorMatrix
                type="matrix"
                values="
                  1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  -4 -4 -4 6 0
                "
              />
            </filter>
          </svg>

          <div className="relative z-10 w-full flex flex-col md:flex-row min-h-[600px] md:min-h-[750px]">
            {/* Left side: Premium artwork gallery (SAB6 profile) as background-cover panel */}
            <div className="sab6-image-panel w-full md:w-[50%] lg:w-[52%] h-[75vw] md:h-auto relative flex-shrink-0">
              <Image
                src="/SAB6/SAB6 profile.jpg"
                alt="SAB6 Artist Profile"
                fill
                sizes="(min-width: 768px) 52vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-tr from-black/70 via-transparent to-black/50 z-1" />
            </div>

            {/* Right side: Event headings, description, and socials */}
            <div className="w-full md:w-[50%] lg:w-[48%] flex flex-col justify-center p-8 sm:p-12 md:p-16 lg:p-24 gap-6 items-start">
              <div className="flex flex-col gap-1.5 w-full">
                {/* Show Name Image (Main Title) - smaller */}
                <div className="relative w-full max-w-[220px] aspect-[4/1] overflow-hidden">
                  <Image
                    src="/SAB6/Show Name.jpg"
                    alt="SAB6 Show Name"
                    fill
                    className="object-contain object-left sab6-filter"
                  />
                </div>

                {/* SAB6 logo image - large like first section */}
                <div className="relative w-full max-w-[480px] aspect-[3/1] overflow-hidden -ml-1">
                  <Image
                    src="/SAB6 logo.jpeg"
                    alt="SAB6 Logo"
                    fill
                    className="object-contain object-left"
                  />
                </div>
              </div>

              {/* Date image card */}
              <div className="relative w-full max-w-[320px] aspect-[4/1]">
                <Image
                  src="/SAB6/Date.jpg"
                  alt="Date & Time"
                  fill
                  className="object-contain object-left sab6-filter"
                />
              </div>

              {/* Experience header image */}
              <div className="relative w-full max-w-[200px] aspect-[5/1] opacity-75">
                <Image
                  src="/SAB6/Experience.jpg"
                  alt="The Experience"
                  fill
                  className="object-contain object-left sab6-filter"
                />
              </div>

              <p className="text-base leading-relaxed text-white/60 max-w-lg mt-2" style={{ fontFamily: "var(--font-selincah, 'Selincah', sans-serif)" }}>
                Step into the underground. A raw audio-visual exhibition featuring exclusive sets, heavy visual projections, and a gathering of the local hip-hop community. Don't miss the first official showcase.
              </p>

              {/* CTA & Social Channels */}
              <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-8 w-full">
                {/* Register Now Image styled as button */}
                <a
                  href="/tickets#SAB6"
                  className="group relative block w-52 aspect-[3/1] border border-black bg-neutral-950/80 rounded-xl p-3 transition-all duration-300 hover:scale-[1.03] hover:border-[#DE1818]/30 shadow-lg hover:shadow-2xl overflow-hidden"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src="/SAB6/Register now.jpg"
                      alt="Register Now"
                      fill
                      className="object-contain transition-opacity duration-300 group-hover:opacity-90 sab6-filter"
                    />
                  </div>
                </a>

                {/* Social media connections */}
                <div className="flex flex-col gap-2">
                  <span className="font-proxima text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">Connect</span>
                  <div className="flex items-center gap-3">
                    {[
                      { img: "/SAB6/Instagram.jpg", url: "https://instagram.com" },
                      { img: "/SAB6/Whatsapp.jpg", url: "https://whatsapp.com" },
                      { img: "/SAB6/Youtube.jpg", url: "https://youtube.com" }
                    ].map((soc, idx) => (
                      <a
                        key={idx}
                        href={soc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-[#DE1818] transition-all duration-300 hover:scale-110"
                      >
                        <Image
                          src={soc.img}
                          alt="Social channel"
                          fill
                          className="object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 2: THE EXPERIENCE ─── */}
        <Experience />

        {/* ─── SECTION 3: LATEST ENERGY ─── */}
        <Gallery />

        {/* ─── SECTION 4: MERCH ─── */}
        <MerchSection />

        {/* ─── SECTION 5: CONTACT ─── */}
        <ContactSection />

        {/* ─── SECTION 6: MARQUEE STRIP ─── */}
        <MarqueeStrip />
      </div>

    </main>
  );
}
