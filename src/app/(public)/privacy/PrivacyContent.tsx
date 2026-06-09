"use client";

import Link from "next/link";
import MotionReveal from "../../../components/ui/MotionReveal";
import ScrambleText from "../../../components/ui/ScrambleText";

export default function PrivacyContent() {
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
            <ScrambleText text="Privacy Policy" />
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
                  This Privacy Policy describes how <strong>BOOMBAP</strong> collects, uses, and protects your personal information when you use our website, buy event tickets, and interact with our services.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.1} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">02.</span>
                  Information We Collect
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  We may collect personal information such as your name, email address, phone number, and transaction details when you register, book tickets, or contact us. Payment processing details are managed by our secure payment gateway providers (e.g., Razorpay) and are not stored directly on our servers.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.15} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">03.</span>
                  How We Use Your Information
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  Your information is utilized to process event ticket bookings, verify entry details at the door, provide customer support, improve our services, and communicate important updates regarding events and merch releases.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.2} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">04.</span>
                  Data Security
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  We implement industry-standard security measures and secure connection protocols to protect your personal data from unauthorized access, alteration, loss, or disclosure.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.25} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">05.</span>
                  Sharing of Information
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  We do not sell or rent your personal information to third parties. Information is only shared with trusted service providers to run our operations (such as processing payments or issuing tickets) or when required by legal obligations.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.3} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">06.</span>
                  Changes to This Policy
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  We may update this Privacy Policy from time to time to match operational, legal, or regulatory modifications. Updates will be reflected on this page with an adjusted date.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.35} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">07.</span>
                  Contact Us
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  If you have any questions about this Privacy Policy, please reach out to us at{" "}
                  <a href="mailto:[EMAIL_ADDRESS]" className="text-primary font-bold hover:underline transition-all">
                    [EMAIL_ADDRESS]
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
