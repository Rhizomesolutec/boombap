"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ScrambleText from "../ui/ScrambleText";
import Image from "next/image";

const navLinks = [
  { label: "Events", href: "/events" },
  { label: "Tickets", href: "/tickets" },
  { label: "Merch", href: "/merch" },
  { label: "Vol.01 Recap", href: "/vol1-recap" },
  { label: "Culture", href: "/#culture" },
];

const socials = ["Instagram", "Facebook", "Twitter", "YouTube"];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHeroHeader, setIsHeroHeader] = useState(pathname === "/");

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const updateHeaderColor = () => {
      setIsHeroHeader(pathname === "/" && window.scrollY < window.innerHeight);
    };

    updateHeaderColor();
    window.addEventListener("scroll", updateHeaderColor, { passive: true });
    window.addEventListener("resize", updateHeaderColor);

    return () => {
      window.removeEventListener("scroll", updateHeaderColor);
      window.removeEventListener("resize", updateHeaderColor);
    };
  }, [pathname]);

  return (
    <>
      {/* ─── HEADER BAR ─── */}
      <header
        className="fixed top-0 left-0 w-full z-50 bg-transparent"
      >
        <div className="mx-auto flex h-20 w-full items-center justify-between px-5 sm:px-6 md:h-28 md:px-16">
          {/* LEFT — Logo */}
          <Link href="/" className="relative z-50 flex items-center justify-center group ">
            <Image
              src={isHeroHeader ? "/bmbp-black-logo.png" : "/bmbp-violet-logo.png"}
              alt="BOOMBAP Logo"
              width={128}
              height={128}
              priority
              className={`h-24 w-24 md:h-32 md:w-32 object-contain transition-all duration-500 group-hover:scale-110 ${menuOpen ? "invert" : ""
                }`}
            />

          {/* LEFT — Wordmark */}
          {/* <Link
            href="/"
            className={`relative z-50 flex items-center font-sarpanch text-lg font-black uppercase leading-none transition-colors duration-300 hover:text-secondary sm:text-xl md:text-2xl ${menuOpen ? "text-primary" : isHeroHeader ? "text-black" : "text-secondary"
              }`}
          >
            <ScrambleText text="boombap.com" /> */}
          </Link>

          {/* RIGHT — Burger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="group relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-[6px] md:h-12 md:w-12"
          >
            {/* Top bar */}
            <span
              className={`block h-[2px] w-7 origin-center transition-all duration-500 ease-in-out md:w-8 ${menuOpen ? "rotate-45 translate-y-[8px] bg-primary" : isHeroHeader ? "bg-black group-hover:bg-secondary" : "bg-secondary group-hover:bg-primary"
                }`}
            />
            {/* Middle bar */}
            <span
              className={`block h-[2px] transition-all duration-300 ease-in-out ${menuOpen ? "w-0 opacity-0 bg-primary" : isHeroHeader ? "w-5 bg-black group-hover:bg-secondary" : "w-5 bg-secondary group-hover:bg-primary"
                }`}
            />
            {/* Bottom bar */}
            <span
              className={`block h-[2px] w-7 origin-center transition-all duration-500 ease-in-out md:w-8 ${menuOpen ? "-rotate-45 translate-y-[-8px] bg-primary" : isHeroHeader ? "bg-black group-hover:bg-secondary" : "bg-secondary group-hover:bg-primary"
                }`}
            />
          </button>
        </div>
      </header>

      {/* ─── FULLSCREEN MENU OVERLAY ─── */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-700 ease-in-out ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Background layers */}
        <div className="absolute inset-0 bg-black" />
        {/* Violet accent slice */}
        <div
          className={`absolute top-0 right-0 h-full w-[45vw] bg-secondary transition-transform duration-700 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          style={{ transitionDelay: menuOpen ? "0ms" : "200ms" }}
        />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "200px",
          }}
        />

        {/* Menu Content */}
        <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-16 pt-32 pb-12">

          {/* NAV LINKS */}
          <nav className="flex flex-col gap-2">
            {navLinks.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`group flex items-baseline gap-4 transition-all duration-500 ease-out ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: menuOpen ? `${120 + i * 80}ms` : "0ms" }}
              >
                {/* Index number */}
                <span className="text-primary text-xs font-mono w-6 shrink-0">
                  0{i + 1}
                </span>
                {/* Link text */}
                <span
                  className="text-white text-[9vw] md:text-[5vw] font-black uppercase leading-none font-sarpanch
                             transition-colors duration-200 group-hover:text-secondary"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  <ScrambleText text={link.label} />
                </span>
                {/* Arrow */}
                <span
                  className="text-white text-2xl ml-2 opacity-0 -translate-x-2
                             group-hover:opacity-100 group-hover:translate-x-0
                             transition-all duration-200"
                >
                  →
                </span>
              </Link>
            ))}
          </nav>

          {/* BOTTOM ROW */}
          <div
            className={`flex flex-col md:flex-row md:items-end justify-between gap-6
                        transition-all duration-500 ease-out ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            style={{ transitionDelay: menuOpen ? "600ms" : "0ms" }}
          >
            {/* Socials */}
            <div className="flex gap-6 flex-wrap">
              {socials.map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-white/50 text-xs tracking-[0.2em] uppercase hover:text-secondary
                             transition-colors duration-200 font-medium font-proxima"
                >
                  <ScrambleText text={s} />
                </a>
              ))}
            </div>

            {/* Tickets CTA */}
            <Link
              href="/tickets"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-3 bg-primary text-black
                         px-8 py-4 font-black uppercase tracking-widest text-sm
                         hover:bg-secondary hover:text-white transition-colors duration-200 self-start md:self-auto font-sarpanch"
              style={{ letterSpacing: "0.2em", fontSize: "1rem" }}
            >
              <ScrambleText text="Get Tickets" />
              <span className="text-base">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
