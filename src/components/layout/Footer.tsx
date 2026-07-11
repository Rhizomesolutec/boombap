"use client";

import Image from "next/image";
import Link from "next/link";
import ScrambleText from "../ui/ScrambleText";

const links = [
  { label: "Events", href: "/events" },
  { label: "Tickets", href: "/tickets" },
  { label: "Merch", href: "/merch" },
  { label: "Recaps", href: "/vol1-recap" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
];

const socials = [
  {
    name: "Instagram",
    href: "https://instagram.com/boombap.in",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    )
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
        <path d="m10 15 5-3-5-3v6z" />
      </svg>
    )
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-secondary/20 bg-black text-white">

      {/* Main footer links / info */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <div className="flex flex-col items-start text-left">
            <Link href="/" className="mb-6 inline-flex items-center gap-4 justify-start">
              <Image
                src="/bmbp-green-logo.png"
                alt="BOOMBAP"
                width={64}
                height={64}
                className="h-14 w-14 object-contain"
              />
              <div className="text-left">
                <p className="font-sarpanch text-2xl font-black uppercase leading-none text-white">
                  <ScrambleText text="BOOMBAP" />
                </p>
              </div>
            </Link>

            <p className="max-w-md font-proxima text-base leading-relaxed text-white/55">
              Underground rap culture, live nights, merch drops, and raw community energy.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-5 text-white/45 justify-start">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-300 hover:text-secondary hover:scale-110"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <nav aria-label="Footer navigation" className="flex flex-col gap-3 items-start md:items-center">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-proxima text-xs font-bold uppercase tracking-[0.24em] text-white/55 transition-colors hover:text-secondary"
                >
                  <ScrambleText text={link.label} />
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 items-start md:items-end">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-proxima text-xs font-bold uppercase tracking-[0.24em] text-white/55 transition-colors hover:text-secondary"
                >
                  <ScrambleText text={link.label} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── CINEMATIC WORDMARK ─── */}
      {/* <div className="relative w-full h-[40vh] sm:h-[55vh] md:h-[85vh] flex flex-col overflow-hidden select-none bg-black" aria-hidden="true">

        <video
          src="/dj.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(1.1) contrast(1.1)" }}
        />

        <div
          className="relative h-[50%] w-full flex items-end justify-center overflow-hidden pb-2"
          style={{ mixBlendMode: "multiply", backgroundColor: "black" }}
        >
          <span
            className="w-full font-sarpanch font-black uppercase text-primary text-center leading-[0.75] tracking-tighter"
            style={{ fontSize: "min(32vw, 46vh)", display: "block" }}
          >
            BOOM
          </span>
        </div>

        <div
          className="relative h-[calc(50%+2px)] w-full flex items-start justify-center overflow-hidden pt-2 -mt-[1px]"
          style={{ mixBlendMode: "multiply", backgroundColor: "black" }}
        >
          <span
            className="font-sarpanch font-black uppercase text-secondary text-center leading-[0.75] tracking-tighter"
            style={{ fontSize: "min(32vw, 46vh)", display: "block", width: "100%" }}
          >
            BAP
          </span>
        </div>
      </div> */}

      {/* ─── BOTTOM BAR ─── */}
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mt-8 border-t border-secondary/20 pt-6 pb-8 text-right">
          <p className="font-proxima text-[10px] uppercase tracking-[0.22em] text-white/30">
            © {new Date().getFullYear()} BOOMBAP
          </p>
        </div>
      </div>
    </footer>
  );
}
