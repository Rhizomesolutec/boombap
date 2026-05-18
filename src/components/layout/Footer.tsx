"use client";

import Image from "next/image";
import Link from "next/link";

const links = [
  { label: "Events", href: "/tickets" },
  { label: "Tickets", href: "/tickets" },
  { label: "Merch", href: "/#merch" },
  { label: "Recaps", href: "/#gallery" },
];

const socials = ["Instagram", "YouTube", "Spotify"];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-black text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 7px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <Link href="/" className="mb-6 inline-flex items-center gap-4">
              <Image
                src="/bmbp-green-logo.png"
                alt="BOOMBAP"
                width={64}
                height={64}
                className="h-14 w-14 object-contain"
              />
              <div>
                <p className="font-sarpanch text-2xl font-black uppercase leading-none text-white">
                  BOOMBAP
                </p>
                <p className="mt-1 font-proxima text-[10px] uppercase tracking-[0.32em] text-primary">
                  Mumbai / Vol.02
                </p>
              </div>
            </Link>

            <p className="max-w-md font-proxima text-base leading-relaxed text-white/55">
              Underground rap culture, live nights, merch drops, and raw community energy.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:text-right">
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-3 md:justify-end">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-proxima text-xs font-bold uppercase tracking-[0.24em] text-white/55 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-wrap gap-x-5 gap-y-3 md:justify-end">
              {socials.map((social) => (
                <a
                  key={social}
                  href="#"
                  className="font-proxima text-xs uppercase tracking-[0.24em] text-white/35 transition-colors hover:text-white"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex w-fit items-center border border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="mr-3 h-2 w-2 bg-primary" />
            <span className="font-proxima text-[10px] uppercase tracking-[0.3em] text-white/45">
              Culture stays independent
            </span>
          </div>

          <p className="font-proxima text-xs uppercase tracking-[0.22em] text-white/30">
            © {new Date().getFullYear()} BOOMBAP
          </p>
        </div>
      </div>
    </footer>
  );
}
