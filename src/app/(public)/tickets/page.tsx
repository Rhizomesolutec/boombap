"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { TicketTier } from "../../../lib/supabase";
import MotionReveal from "../../../components/ui/MotionReveal";
import ScrambleText from "../../../components/ui/ScrambleText";

// Utility: paise → readable rupee string
function formatPrice(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

// ─── Razorpay type shim (the script injects window.Razorpay) ─────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

// Load the Razorpay checkout script once on demand
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Booking form ─────────────────────────────────────────────────────────────
type BookingStatus = "idle" | "loading" | "success" | "error";

function BookingForm({ selectedTier }: { selectedTier: TicketTier }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qty, setQty] = useState(1);
  const [status, setStatus] = useState<BookingStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [agreed, setAgreed] = useState(false);

  const remaining = selectedTier.tickets_remaining !== undefined ? selectedTier.tickets_remaining : selectedTier.quantity_limit;
  const maxAllowed = Math.min(selectedTier.max_per_order ?? 4, remaining);

  useEffect(() => {
    setQty((q) => Math.min(maxAllowed, Math.max(1, q)));
  }, [maxAllowed]);

  const totalPaise = selectedTier.price * qty;

  const handlePay = useCallback(async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    if (!agreed) {
      setErrorMsg("You must agree to the Terms & Conditions and policies to proceed.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    // ── 1. Load Razorpay script ───────────────────────────────────────────────
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setStatus("error");
      setErrorMsg("Failed to load payment gateway. Check your connection.");
      return;
    }

    // ── 2. Create server-side Razorpay order ─────────────────────────────────
    const orderRes = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyer_name: name.trim(),
        buyer_email: email.trim().toLowerCase(),
        buyer_phone: phone.trim(),
        ticket_tier: selectedTier.id,
        quantity: qty,
        amount_paise: totalPaise,
      }),
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok || orderData.error) {
      setStatus("error");
      setErrorMsg(orderData.error || "Could not create order. Try again.");
      return;
    }

    // ── 3. Open Razorpay modal ────────────────────────────────────────────────
    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "BOOMBAP",
      description: `${selectedTier.name} × ${qty}`,
      image: "/favicon.ico",
      order_id: orderData.orderId,
      prefill: { name: name.trim(), email: email.trim(), contact: phone.trim() },
      theme: { color: "#A0EF46" },

      // ── 4. On successful payment ──────────────────────────────────────────
      handler: async function (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) {
        // Verify signature server-side before showing success
        const verifyRes = await fetch("/api/orders/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMsg("Payment received but verification failed. Contact us.");
        }
      },

      modal: {
        ondismiss: () => {
          // User closed the modal without paying
          if (status === "loading") setStatus("idle");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (resp: { error: { description: string } }) => {
      setStatus("error");
      setErrorMsg(resp.error?.description || "Payment failed. Try again.");
    });
    rzp.open();

    // Reset loading state — modal is now in control
    setStatus("idle");
  }, [name, email, phone, qty, selectedTier, totalPaise, status, agreed]);

  // ── Success screen ──────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-6 py-14 text-center"
      >
        <span className="flex h-16 w-16 items-center justify-center border border-primary/60 bg-primary/10 text-primary text-3xl">
          ✓
        </span>
        <h3 className="font-sarpanch text-3xl font-black uppercase text-white">
          You&apos;re In
        </h3>
        <p className="max-w-xs font-proxima text-base leading-relaxed text-white/60">
          Booking confirmed. A receipt has been sent to{" "}
          <span className="text-white">{email}</span>.
          <br />
          See you at the show.
        </p>
        <Link href="/" className="boombap-button mt-2">
          <ScrambleText text="Back Home" />
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Order summary strip */}
      <div className="flex items-center justify-between border border-white/10 bg-white/3 px-4 py-3">
        <div>
          <span className="font-proxima text-[9px] font-bold uppercase tracking-[0.3em] text-white/38">
            Order Summary
          </span>
          <p className="mt-1 font-sarpanch text-base font-black uppercase text-white">
            {selectedTier.name} ({selectedTier.id}) × {qty}
          </p>
        </div>
        <span className="font-sarpanch text-2xl font-black text-primary">
          {formatPrice(totalPaise)}
        </span>
      </div>

      {/* Quantity stepper */}
      <div>
        <label className="mb-2 block font-proxima text-[9px] font-bold uppercase tracking-[0.32em] text-white/40">
          Quantity
        </label>
        <div className="flex items-center gap-0">
          <button
            id="qty-decrease"
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center border border-white/14 bg-white/4 font-sarpanch text-white transition hover:bg-white/10"
          >
            −
          </button>
          <span className="flex h-11 w-14 items-center justify-center border-y border-white/14 bg-white/2 font-sarpanch text-lg font-black text-white">
            {qty}
          </span>
          <button
            id="qty-increase"
            type="button"
            onClick={() => {
              setQty((q) => Math.min(maxAllowed, q + 1));
            }}
            className="flex h-11 w-11 items-center justify-center border border-white/14 bg-white/4 font-sarpanch text-white transition hover:bg-white/10"
          >
            +
          </button>
          <span className="ml-3 font-proxima text-[10px] text-white/30">
            max {maxAllowed} per order
          </span>
        </div>
      </div>

      {/* Buyer details */}
      {[
        { id: "buyer-name", label: "Full Name *", type: "text", value: name, set: setName, placeholder: "Aditya Kumar" },
        { id: "buyer-email", label: "Email Address *", type: "email", value: email, set: setEmail, placeholder: "you@email.com" },
        { id: "buyer-phone", label: "Phone Number *", type: "tel", value: phone, set: setPhone, placeholder: "+91 98765 43210" },
      ].map(({ id, label, type, value, set, placeholder }) => (
        <div key={id} className="flex flex-col gap-1.5">
          <label
            htmlFor={id}
            className="font-proxima text-[9px] font-bold uppercase tracking-[0.32em] text-white/40"
          >
            {label}
          </label>
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => set(e.target.value)}
            placeholder={placeholder}
            className="
              w-full border border-white/14 bg-white/4 px-4 py-3.5
              font-proxima text-sm text-white placeholder:text-white/22
              outline-none transition-all
              focus:border-primary/60 focus:bg-white/7
            "
          />
        </div>
      ))}

      {/* Checkbox agreement */}
      <div className="flex items-start gap-3 border border-white/8 bg-white/2 p-4">
        <input
          id="agree-terms"
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 bg-black text-primary focus:ring-primary focus:ring-offset-black accent-primary cursor-pointer"
        />
        <label htmlFor="agree-terms" className="font-proxima text-xs leading-relaxed text-white/70 select-none cursor-pointer">
          I agree to the{" "}
          <span className="text-primary font-bold hover:underline">
            Terms & Conditions
          </span>
          ,{" "}
          <span className="text-primary font-bold hover:underline">
            Privacy Policy
          </span>
          , and{" "}
          <span className="text-primary font-bold hover:underline">
            Cancellation & Refund Policy
          </span>
          . I acknowledge that transaction fees are borne by the cardholder and are non-refundable.
        </label>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {errorMsg && (
          <motion.p
            key={errorMsg}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-proxima text-sm text-red-400"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Pay button */}
      <button
        id="pay-button"
        type="button"
        onClick={handlePay}
        disabled={status === "loading" || !agreed}
        className="boombap-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 animate-spin rounded-full border border-black/40 border-t-black" />
            Processing…
          </span>
        ) : (
          <ScrambleText text={`Pay ${formatPrice(totalPaise)}`} />
        )}
      </button>

      <p className="text-center font-proxima text-[10px] leading-relaxed text-white/24">
        Secured by Razorpay · UPI, Cards, Net Banking accepted
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TicketsPage() {
  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<string>("");

  useEffect(() => {
    // Hardcoded single ticket tier
    const list = [
      {
        id: 'early-vip',
        name: 'EARLY VIP',
        price: 6600, // 66 Rupees
        description: 'Get in early for an exclusive experience.',
        perks: ['General Admission', 'Early Access', 'Exclusive Merch'],
        available: true,
        quantity_limit: 100,
        tickets_remaining: 100,
        max_per_order: 4
      }
    ];
    setTiers(list as any);
    setSelectedTierId(list[0].id);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black text-white">
        <section className="relative isolate min-h-[72vh] overflow-hidden border-b border-white/10 px-6 pb-16 pt-36 md:px-10 md:pb-24 md:pt-44 animate-pulse">
          <div className="absolute inset-0 -z-20 bg-linear-to-r from-black via-black/90 to-black/50" />
          <div className="mx-auto flex max-w-7xl flex-col justify-end gap-4">
            <div className="h-4 w-40 bg-white/10 rounded" />
            <div className="h-20 w-80 bg-white/10 rounded" />
            <div className="h-6 w-96 bg-white/10 rounded" />
          </div>
        </section>
        <section className="relative overflow-hidden bg-black px-6 py-20 md:px-10 md:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="flex flex-col gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="border border-white/10 bg-white/2.5 p-6 h-40 animate-pulse rounded-sm" />
                ))}
              </div>
              <div className="border border-white/12 bg-white/2.5 p-6 h-96 animate-pulse rounded-sm" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md border border-red-500/30 bg-red-500/5 p-8 rounded-sm">
          <span className="text-3xl text-red-500">⚠</span>
          <h2 className="mt-4 font-sarpanch text-xl font-black uppercase text-white">Failed to load booking</h2>
          <p className="mt-2 font-proxima text-sm text-white/50">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="boombap-button mt-6"
          >
            <ScrambleText text="Try Again" />
          </button>
        </div>
      </main>
    );
  }

  if (tiers.length === 0) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md border border-white/10 bg-white/2.5 p-8 rounded-sm">
          <h2 className="font-sarpanch text-xl font-black uppercase text-white">Tickets Coming Soon</h2>
          <p className="mt-2 font-proxima text-sm text-white/50">Ticket sales for BOOMBAP Vol.1 are currently closed. Check back soon!</p>
          <Link href="/" className="boombap-button mt-6">
            <ScrambleText text="Back Home" />
          </Link>
        </div>
      </main>
    );
  }

  const selectedTier = tiers.find((t) => t.id === selectedTierId);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* ── Hero ── */}
      <section className="relative isolate min-h-[72vh] overflow-hidden border-b border-white/10 px-6 pb-16 pt-36 md:px-10 md:pb-24 md:pt-44">
        <Image
          src="/crowd-section.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover object-top opacity-25 grayscale"
        />
        <div className="absolute inset-0 -z-20 bg-linear-to-r from-black via-black/90 to-black/50" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black via-transparent to-black/60" />

        <div className="mx-auto flex max-w-7xl flex-col justify-end">
          <MotionReveal
            as="span"
            className="mb-5 block font-proxima text-[10px] font-bold uppercase tracking-[0.42em] text-primary"
          >
            Book Tickets / Upcoming Event
          </MotionReveal>

          <MotionReveal
            as="div"
            delay={0.08}
            className="relative w-[80vw] max-w-[600px] aspect-[3/1] mb-6"
          >
            <Image
              src="/SAB6 logo.jpeg"
              alt="SAB6"
              fill
              className="object-contain object-left"
              priority
            />
          </MotionReveal>

          <MotionReveal
            delay={0.16}
            className="mt-8 max-w-2xl border-l border-primary/70 pl-5 md:pl-7"
          >
            <p className="font-proxima text-xl leading-relaxed text-white/70 md:text-2xl">
              One night. One city. One lineup built for the underground.
              Select your tier and secure your spot before it sells out.
            </p>
          </MotionReveal>

          <MotionReveal delay={0.24} className="mt-10 flex flex-wrap gap-4">
            <a href="#SAB6" className="boombap-button">
              <ScrambleText text="Book Now" />
            </a>
            <Link href="/events" className="boombap-button boombap-button--ghost">
              <ScrambleText text="Event Details" />
            </Link>
          </MotionReveal>
        </div>
      </section>

      {/* ── SAB6 Section ── */}
      <section className="relative overflow-hidden bg-black px-6 py-20 md:px-10 md:py-24 border-b border-white/10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <MotionReveal delay={0.1} className="order-2 md:order-1">
              <div className="relative aspect-square w-full max-w-md mx-auto md:mx-0 border border-white/10 bg-white/2.5 flex items-center justify-center p-8 overflow-hidden">
                <Image
                  src="/sab6.png"
                  alt="SAB6"
                  fill
                  className="object-contain p-4 transition-transform duration-700 hover:scale-105"
                />
              </div>
            </MotionReveal>
            
            <MotionReveal delay={0.2} className="flex flex-col gap-6 items-start order-1 md:order-2">
              <span className="font-proxima text-[10px] font-bold uppercase tracking-[0.42em] text-primary">
                Exclusive Drop
              </span>
              <div className="relative w-[60vw] max-w-[400px] aspect-[3/1]">
                <Image
                  src="/SAB6 logo.jpeg"
                  alt="SAB6"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="font-proxima text-lg text-white/70 leading-relaxed max-w-lg">
                Exclusive SAB6 merchandise drop. Extremely limited availability. Secure yours now alongside your ticket before they run out completely.
              </p>
              <a href="#SAB6" className="boombap-button mt-4">
                <ScrambleText text="Book Now" />
              </a>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* ── Ticket selection + booking form ── */}
      <section
        id="SAB6"
        className="relative overflow-hidden bg-black px-6 py-20 md:px-10 md:py-28"
      >
        {/* Watermark */}
        <div className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 opacity-[0.04] select-none">
          <span className="kinetic-title text-watermark whitespace-nowrap">
            TICKETS
          </span>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Section label */}
          <MotionReveal className="mb-10">
            <span className="font-proxima text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              Select Your Ticket
            </span>
          </MotionReveal>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            {/* ── LEFT: tier cards ── */}
            <div className="flex flex-col gap-4">
              {tiers.map((tier, i) => {
                const active = tier.id === selectedTierId;
                const remaining = tier.tickets_remaining !== undefined ? tier.tickets_remaining : tier.quantity_limit;
                const isSoldOut = !tier.available || remaining <= 0;
                return (
                  <MotionReveal key={tier.id} delay={i * 0.07}>
                    <button
                      id={`tier-${tier.id}`}
                      type="button"
                      onClick={() => setSelectedTierId(tier.id)}
                      disabled={isSoldOut}
                      className={`
                        group w-[85%] text-left border p-6 transition-all duration-200 md:p-7 min-h-[480px] flex flex-col justify-center gap-6
                        ${active
                          ? "border-primary bg-primary/8 shadow-[6px_6px_0_rgba(160,239,70,0.28)]"
                          : "border-white/10 bg-white/2.5 hover:border-white/22 hover:bg-white/4"
                        }
                        ${isSoldOut ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                      `}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {/* Radio dot */}
                          <span
                            className={`
                              mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border
                              transition-colors
                              ${active ? "border-primary" : "border-white/25"}
                            `}
                          >
                            {active && (
                              <span className="h-2 w-2 bg-primary" />
                            )}
                          </span>
                          <div>
                            <span className="font-proxima text-[9px] font-black uppercase tracking-[0.32em] text-white/40">
                              {isSoldOut ? "Sold Out" : "Available"}
                            </span>
                            <div className="mt-1 font-proxima text-[10px] font-bold uppercase tracking-[0.25em] text-primary/80">
                              {tier.id}
                            </div>
                            <h3 className="mt-0.5 font-sarpanch text-2xl font-black uppercase text-white">
                              {tier.name}
                            </h3>
                          </div>
                        </div>
                        <span
                          className={`font-sarpanch text-2xl font-black ${active ? "text-primary" : "text-white"}`}
                        >
                          {formatPrice(tier.price)}
                        </span>
                      </div>

                      <p className="mt-4 font-proxima text-sm leading-relaxed text-white/52">
                        {tier.description}
                      </p>

                      <ul className="mt-5 flex flex-wrap gap-2">
                        {tier.perks.map((perk) => (
                          <li
                            key={perk}
                            className={`
                              border px-2.5 py-1 font-proxima text-[10px] font-bold uppercase tracking-[0.2em]
                              ${active ? "border-primary/40 text-primary/80" : "border-white/12 text-white/40"}
                            `}
                          >
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </button>
                  </MotionReveal>
                );
              })}
            </div>

            {/* ── RIGHT: booking form ── */}
            {selectedTier && (
              <MotionReveal
                delay={0.12}
                className="sticky top-28 border border-white/12 bg-white/2.5 p-6 md:p-8"
              >
                {/* Form header */}
                <div className="mb-7 flex items-center justify-between border-b border-white/8 pb-6">
                  <div>
                    <span className="font-proxima text-[9px] font-black uppercase tracking-[0.34em] text-primary">
                      Your Booking · {selectedTier.id}
                    </span>
                    <h2 className="mt-2 font-sarpanch text-2xl font-black uppercase text-white">
                      {selectedTier.name} Ticket
                    </h2>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={selectedTierId}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="font-sarpanch text-3xl font-black text-primary"
                    >
                      {formatPrice(selectedTier.price)}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <BookingForm selectedTier={selectedTier} />
              </MotionReveal>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ / fine print ── */}
      <section className="border-t border-white/8 bg-black px-6 py-16 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <MotionReveal>
            <span className="font-proxima text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              Good to Know
            </span>
          </MotionReveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "No Refunds",
                copy: "All ticket sales are final. Tickets are non-transferable unless stated otherwise.",
              },
              {
                n: "02",
                title: "ID at the Door",
                copy: "Bring a valid government ID. Your booking email is your entry pass.",
              },
              {
                n: "03",
                title: "Doors Policy",
                copy: "Doors open 30 minutes before showtime. Late entry at event staff discretion.",
              },
            ].map((item, i) => (
              <MotionReveal
                key={item.n}
                delay={i * 0.07}
                className="border border-white/10 bg-white/2 p-6"
              >
                <span className="font-sarpanch text-sm font-black text-primary">
                  {item.n}.
                </span>
                <h4 className="mt-4 font-sarpanch text-xl font-black uppercase text-white">
                  {item.title}
                </h4>
                <p className="mt-3 font-proxima text-sm leading-relaxed text-white/52">
                  {item.copy}
                </p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
