"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import ScrambleText from "../ui/ScrambleText";
import Image from "next/image";

const navLinks = [
  { label: "Events", href: "/events" },
  { label: "Tickets", href: "/tickets" },
  { label: "Merch", href: "/merch" },
  { label: "Vol.01 Recap", href: "/vol1-recap" },
  { label: "Culture", href: "/#culture" },
  { label: "Contact", href: "/#contact" },
];

const socials = ["Instagram", "Facebook", "Twitter", "YouTube"];

const REEL_CLIPS = [
  {
    id: "1193929856",
    src: "https://player.vimeo.com/video/1193929856?background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0",
  },
  {
    id: "1193930603",
    src: "https://player.vimeo.com/video/1193930603?background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0",
  },
  {
    id: "1193931027",
    src: "https://player.vimeo.com/video/1193931027?background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0",
  },
  {
    id: "1193920399",
    src: "https://player.vimeo.com/video/1193920399?background=1&autoplay=1&loop=1&muted=1&title=0&byline=0&portrait=0",
  },
];

const CLIP_DURATION = 6500;
const DISSOLVE_MS = 800;

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHeroHeader, setIsHeroHeader] = useState(pathname === "/");
  const [activeClip, setActiveClip] = useState(0);
  const [panelHovered, setPanelHovered] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Auto-cycle clips only while menu is open
  useEffect(() => {
    if (menuOpen) {
      intervalRef.current = setInterval(() => {
        setActiveClip((prev) => (prev + 1) % REEL_CLIPS.length);
      }, CLIP_DURATION);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [menuOpen]);

  // Hero header color logic
  useEffect(() => {
    const update = () =>
      setIsHeroHeader(pathname === "/" && window.scrollY < window.innerHeight);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  return (
    <>
      {/* ─── HEADER BAR ─── */}
      <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <div className="mx-auto flex h-20 w-full items-center justify-between px-5 sm:px-6 md:h-28 md:px-16">
          <Link href="/" className="relative z-50 flex items-center justify-center group">
            <Image
              src={pathname === "/tickets" ? "/SAB6/Show Name.jpg" : "/bmbp-green-logo.png"}
              alt="BOOMBAP Logo"
              width={128}
              height={128}
              priority
              style={pathname === "/tickets" ? { filter: "url(#remove-white-filter)" } : undefined}
              className={`h-24 w-24 md:h-32 md:w-32 object-contain transition-all duration-500 group-hover:scale-110 ${
                menuOpen && pathname !== "/tickets" ? "invert" : ""
              }`}
            />
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="group relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[6px] md:h-12 md:w-12"
          >
            <span className={`block h-[2px] w-7 origin-center transition-all duration-500 ease-in-out md:w-8 ${
              menuOpen ? "rotate-45 translate-y-[8px] bg-primary" : "bg-primary group-hover:bg-secondary"
            }`} />
            <span className={`block h-[2px] transition-all duration-300 ease-in-out ${
              menuOpen ? "w-0 opacity-0 bg-white" : "w-5 bg-white group-hover:bg-secondary"
            }`} />
            <span className={`block h-[2px] w-7 origin-center transition-all duration-500 ease-in-out md:w-8 ${
              menuOpen ? "-rotate-45 translate-y-[-8px] bg-primary" : "bg-primary group-hover:bg-secondary"
            }`} />
          </button>
        </div>
      </header>

      {/* ─── FULLSCREEN MENU OVERLAY ─── */}
      <div
        className={`fixed inset-0 z-40 flex transition-all duration-700 ease-in-out ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* ── LEFT NAV PANEL ── */}
        {/* Mobile: full width, centered. Desktop: 55vw, left-aligned */}
        <div className="relative z-10 flex flex-col justify-between w-full md:w-[55vw] bg-black px-6 md:px-16 pt-32 pb-12">

          {/* NAV LINKS — centered on mobile, left on desktop */}
          <nav className="flex flex-col gap-1 items-center md:items-start">
            {navLinks.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`group flex items-baseline gap-3 transition-all duration-500 ease-out ${
                  menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: menuOpen ? `${120 + i * 80}ms` : "0ms" }}
              >
                <span className="text-primary text-xs font-mono w-6 shrink-0 text-right">0{i + 1}</span>
                <span
                  className="text-white text-[11vw] md:text-[4.5vw] font-black uppercase leading-none font-sarpanch
                             transition-colors duration-200 group-hover:text-secondary"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  <ScrambleText text={link.label} />
                </span>
                <span className="text-white text-xl ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                  →
                </span>
              </Link>
            ))}
          </nav>

          {/* BOTTOM ROW — centered on mobile, spread on desktop */}
          <div
            className={`flex flex-col md:flex-row md:items-end justify-between gap-6 items-center transition-all duration-500 ease-out ${
              menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: menuOpen ? "600ms" : "0ms" }}
          >
            {/* Socials */}
            <div className="flex gap-5 flex-wrap justify-center md:justify-start">
              {socials.map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-white/50 text-xs tracking-[0.2em] uppercase hover:text-secondary transition-colors duration-200 font-medium font-proxima"
                >
                  <ScrambleText text={s} />
                </a>
              ))}
            </div>

            {/* Tickets CTA */}
            <Link
              href="/tickets"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-3 bg-primary text-black px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-secondary hover:text-white transition-colors duration-200 font-sarpanch"
              style={{ letterSpacing: "0.2em", fontSize: "1rem" }}
            >
              <ScrambleText text="Get Tickets" />
              <span className="text-base">↗</span>
            </Link>
          </div>
        </div>

        {/* ── RIGHT CINEMATIC REEL PANEL ── */}
        <div
          className={`hidden md:block absolute top-0 right-0 h-full w-[45vw] overflow-hidden transition-transform duration-700 ease-in-out ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ transitionDelay: menuOpen ? "0ms" : "200ms" }}
          onMouseEnter={() => setPanelHovered(true)}
          onMouseLeave={() => setPanelHovered(false)}
        >
          {/* Solid purple fallback */}
          <div className="absolute inset-0 bg-[#7F77DD]" />

          {/* Portrait Vimeo iframes — cover fill via absolute centering + oversizing */}
          {REEL_CLIPS.map((clip, i) => (
            <iframe
              key={clip.id}
              src={clip.src}
              allow="autoplay"
              className="absolute pointer-events-none border-0"
              style={{
                // Portrait 9:16 cover trick:
                // height = 100%, width = 9/16 * 100vh, then shift to center
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
                minWidth: "calc(100% * 16 / 9)",   // ensures landscape fill if needed
                minHeight: "calc(100% * 16 / 9)",  // ensures portrait fills height
                opacity: i === activeClip ? 1 : 0,
                transition: `opacity ${DISSOLVE_MS}ms ease-in-out`,
              }}
            />
          ))}

          {/* Vignette — left edge hard fade to black (blends into nav) */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 14%, transparent 32%)",
            }}
          />
          {/* Top + bottom bleed into purple */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to bottom, rgba(127,119,221,0.6) 0%, transparent 18%), linear-gradient(to top, rgba(127,119,221,0.6) 0%, transparent 18%)",
            }}
          />
          {/* Radial centre darkening */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "radial-gradient(ellipse 110% 110% at 50% 50%, transparent 30%, rgba(127,119,221,0.25) 70%, rgba(127,119,221,0.7) 100%)",
            }}
          />

          {/* Film grain — 15% opacity */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
              backgroundSize: "180px 180px",
              backgroundRepeat: "repeat",
              opacity: 0.15,
              mixBlendMode: "overlay",
            }}
          />

          {/* Ghost "VOL.01" text — 4% opacity texture */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 select-none">
            <span
              className="font-sarpanch font-black text-white leading-none"
              style={{ fontSize: "clamp(5rem, 10vw, 9rem)", opacity: 0.04, letterSpacing: "-0.04em" }}
            >
              VOL.01
            </span>
          </div>
        </div>

        {/* Full-overlay noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px",
          }}
        />
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
      </div>
    </>
  );
}
