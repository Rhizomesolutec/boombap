import HeroSection from "../../components/home/HeroSection";
import MarqueeStrip from "../../components/home/BoomBapStrip";
import AboutLanding from "../../components/home/About";
import MerchSection from "../../components/home/MerchSection";
import ContactSection from "../../components/home/ContactSection";
import Experience from "../../components/home/Experience";
import Gallery from "../../components/home/Gallery";
import MHeroSection from "@/src/components/home/MHeroSection";

export default function Home() {


  return (
    <main className="relative isolate bg-black">

      {/* ─── SECTION 0: HERO ─── */}
      <div className="sticky top-0 z-0 h-svh overflow-hidden">
        {/* <HeroSection /> */}
        <MHeroSection/>
      </div>

      <div className="relative z-10 bg-black">
        {/* ─── SECTION 1: ABOUT ─── */}

        <AboutLanding />

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
