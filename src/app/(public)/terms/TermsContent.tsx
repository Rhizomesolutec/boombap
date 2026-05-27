"use client";

import Link from "next/link";
import MotionReveal from "../../../components/ui/MotionReveal";
import ScrambleText from "../../../components/ui/ScrambleText";

export default function TermsContent() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Subtle Lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--color-secondary) 0 1px, transparent 1px 7px)",
        }}
      />

      {/* Header / Hero */}
      <section className="relative border-b border-white/10 px-6 pb-12 pt-36 md:px-10 md:pb-16 md:pt-44">
        {/* Decorative Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl">
          <MotionReveal
            as="span"
            className="mb-4 block font-proxima text-[10px] font-bold uppercase tracking-[0.42em] text-primary"
          >
            Legal / Guidelines
          </MotionReveal>

          <MotionReveal
            as="h1"
            className="font-sarpanch text-4xl font-black uppercase leading-[0.9] text-white sm:text-5xl md:text-6xl"
          >
            <ScrambleText text="Terms & Conditions" />
          </MotionReveal>

          <p className="mt-6 font-proxima text-sm uppercase tracking-[0.18em] leading-relaxed text-white/50">
            Last Updated: May 2026
          </p>
        </div>
      </section>

      {/* Document Content */}
      <section className="relative px-6 py-16 md:px-10 md:py-24">
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-[200px_1fr]">
            
            {/* Sidebar nav / back button */}
            <aside className="md:sticky md:top-32 h-fit flex flex-col gap-6">
              <Link
                href="/"
                className="boombap-button boombap-button--ghost w-fit justify-start text-xs"
              >
                <ScrambleText text="← Return Home" />
              </Link>

              <div className="hidden md:flex flex-col gap-3 border-l border-white/10 pl-4">
                <span className="font-proxima text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Node Status
                </span>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 bg-primary rounded-full animate-pulse" />
                  <span className="font-mono text-[10px] text-primary uppercase tracking-wider">
                    Secure Node
                  </span>
                </div>
              </div>
            </aside>

            {/* Articles */}
            <div className="flex flex-col gap-10 font-proxima text-base leading-relaxed text-white/70">
              
              <MotionReveal delay={0.05} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">01.</span>
                  Introduction
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  Welcome to <strong>BOOMBAP (organized by Devil Inside Records)</strong>. These terms and conditions outline the rules and regulations for the use of our website, services, ticket bookings, and attendance at our live shows.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.1} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">02.</span>
                  User Agreement
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  By accessing this website, purchasing tickets, or participating in our live cyphers/events, you accept these terms and conditions in full. Do not continue to use BOOMBAP website or services if you do not accept all of the terms and conditions stated on this page.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.15} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">03.</span>
                  Intellectual Property Rights
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  Other than the content you own, under these terms, BOOMBAP / Devil Inside Records and/or its licensors own all the intellectual property rights and materials contained in this website, including designs, text, audio recordings, video assets, and branding materials.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.2} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">04.</span>
                  Restrictions
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  You are specifically restricted from all of the following: publishing any website material in any other media; selling, sublicensing and/or otherwise commercializing any website material; and publicly performing and/or showing any website material without permission.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.25} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">05.</span>
                  Limitation of Liability
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  In no event shall BOOMBAP / Devil Inside Records, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this website or attendance at events.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.3} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">06.</span>
                  Changes to Terms
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  We reserve the right to revise these terms and conditions at any time as we see fit. By using this website, you are expected to review such terms on a regular basis to remain updated on all current rules and guidelines.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.35} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">07.</span>
                  Payments & Transaction Fees
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  Transaction fees charged by payment gateways/banks for any transaction or booking will be borne entirely by the cardholder. Furthermore, transaction fee charges will not be refunded or reversed under any circumstances for any refund, reversal, chargeback, or other reasons. Fees once paid are non-refundable for any reason or under any clause of the Terms & Conditions or refund policies.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.4} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">08.</span>
                  Contact Us
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  If you have any questions or queries regarding these Terms and Conditions, feel free to reach out to us at{" "}
                  <a href="mailto:info@devilinsiderecords.in" className="text-primary font-bold hover:underline transition-all">
                    info@devilinsiderecords.in
                  </a>
                  .
                </p>
              </MotionReveal>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
