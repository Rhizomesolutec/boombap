"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Events", href: "/tickets" },
  { label: "Tickets", href: "/tickets" },
  { label: "Merch", href: "/#merch" },
  { label: "Vol.01 Recap", href: "/#gallery" },
  { label: "Culture", href: "/#culture" },
];

const socials = ["Instagram", "Facebook", "Twitter", "YouTube"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* ─── HEADER BAR ─── */}
      <header
        className="fixed top-0 left-0 w-full z-50 bg-transparent"
      >
        <div className="max-w-100% mx-auto flex items-center justify-between px-6 md:px-16">

          {/* LEFT — Logo */}
          <Link href="/" className="relative z-50 flex items-center justify-center group">
            <Image
              src="/bmbp-green-logo.png"
              alt="BOOMBAP Logo"
              width={128}
              height={128}
              priority
              className={`h-24 w-24 md:h-32 md:w-32 object-contain transition-all duration-500 group-hover:scale-110 ${menuOpen ? "invert" : ""
                }`}
            />
          </Link>

          {/* RIGHT — Burger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="relative z-50 w-12 h-12 flex flex-col justify-center items-center gap-[6px] group"
          >
            {/* Top bar */}
            <span
              className={`block w-8 h-[2px] bg-primary origin-center transition-all duration-500 ease-in-out ${menuOpen ? "rotate-45 translate-y-[8px]" : ""
                }`}
            />
            {/* Middle bar */}
            <span
              className={`block h-[2px] bg-white transition-all duration-300 ease-in-out ${menuOpen ? "w-0 opacity-0" : "w-5"
                }`}
            />
            {/* Bottom bar */}
            <span
              className={`block w-8 h-[2px] bg-primary origin-center transition-all duration-500 ease-in-out ${menuOpen ? "-rotate-45 translate-y-[-8px]" : ""
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
                             transition-colors duration-200 group-hover:text-primary"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {link.label}
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
                  className="text-white/50 text-xs tracking-[0.2em] uppercase hover:text-primary
                             transition-colors duration-200 font-medium font-proxima"
                >
                  {s}
                </a>
              ))}
            </div>

            {/* Tickets CTA */}
            <Link
              href="/tickets"
              onClick={() => setMenuOpen(false)}
              className="inline-flex items-center gap-3 bg-primary text-black
                         px-8 py-4 font-black uppercase tracking-widest text-sm
                         hover:bg-white hover:text-black transition-colors duration-200 self-start md:self-auto font-sarpanch"
              style={{ letterSpacing: "0.2em", fontSize: "1rem" }}
            >
              Get Tickets
              <span className="text-base">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
