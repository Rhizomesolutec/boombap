"use client";

import Link from "next/link";
import MotionReveal from "../../../components/ui/MotionReveal";
import ScrambleText from "../../../components/ui/ScrambleText";

export default function RefundPolicyContent() {
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
            <ScrambleText text="Refund Policy" />
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
                  Ticket Cancellation
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  All ticket cancellations must be made through the official <strong>BOOMBAP</strong> website and dashboard. Please note that ticket cancellation requests are subject to approval and may not be available for all shows or ticketing tiers.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.1} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">02.</span>
                  Refund Process
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  Refunds, if approved or applicable, will be processed automatically to the original payment method within 7-10 business days after the approval of the cancellation request. <strong>Please note that transaction fee charges would not be refunded/ reversed under any circumstances for any refund/ reversal /chargeback and any other reasons.</strong>
                </p>
              </MotionReveal>

              <MotionReveal delay={0.15} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">03.</span>
                  Non-Refundable Events & Transaction Fees
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  Certain ticket tiers (e.g., Early Bird, Phase 1, or VIP packages) or specifically marked events may be completely non-refundable. <strong>Transaction fees charged would be borne by the cardholder for any payment. Fees once paid are non-refundable for any reason or under any clause of the Terms & Conditions or Refund Policy.</strong>
                </p>
              </MotionReveal>

              <MotionReveal delay={0.2} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">04.</span>
                  Event Cancellations
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  If an event is cancelled by the organizers (BOOMBAP / Devil Inside Records), a full refund will be automatically issued to all ticket holders through our payment processor.
                </p>
              </MotionReveal>

              <MotionReveal delay={0.25} className="border border-white/8 bg-white/2 p-6 md:p-8">
                <h2 className="font-sarpanch text-xl font-black uppercase text-white flex items-center gap-3">
                  <span className="text-primary font-mono text-sm">05.</span>
                  Contact Us
                </h2>
                <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
                  For any questions or support regarding ticket cancellations, transactions, or refund requests, please contact our support team at{" "}
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
