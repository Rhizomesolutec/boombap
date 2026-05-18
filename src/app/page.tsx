import HeroSection from "../components/home/HeroSection";
import MarqueeStrip from "../components/home/BoomBapStrip";
import AboutLanding from "../components/home/About";
import MerchSection from "../components/home/MerchSection";
import Experience from "../components/home/Experience";
import Gallery from "../components/home/Gallery";

export default function Home() {


  return (
    <main className="bg-transparent">

      {/* ─── SECTION 0: HERO ─── */}
      <HeroSection />

      {/* ─── SECTION 1: ABOUT ─── */}

      <AboutLanding />

      {/* ─── SECTION 2: THE EXPERIENCE ─── */}
      <Experience />

      {/* ─── SECTION 3: LATEST ENERGY ─── */}
      <Gallery />

      {/* ─── SECTION 4: MERCH ─── */}
      <MerchSection />

      {/* ─── SECTION 5: MARQUEE STRIP ─── */}
      <MarqueeStrip />

    </main>
  );
}
