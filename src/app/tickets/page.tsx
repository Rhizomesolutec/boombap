"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import MotionReveal from "../../components/ui/MotionReveal";
import ScrambleText from "../../components/ui/ScrambleText";
import type { TicketTier } from "../../lib/supabase";

// ─── Ticket tiers — edit price/perks here when the event is confirmed ─────────
const TICKET_TIERS: TicketTier[] = [
  {
    id: "general",
    name: "General",
    price: 100,           // 1 in paise
    description: "Full access to the night. Standing floor.",
    perks: ["Entry to the event", "Access to all performances"],
    available: true,
    quantity_limit: 4,
  },
];

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

  const totalPaise = selectedTier.price * qty;

  const handlePay = useCallback(async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg("Please fill in all fields.");
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
  }, [name, email, phone, qty, selectedTier, totalPaise, status]);

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
      <div className="flex items-center justify-between border border-white/10 bg-white/[0.03] px-4 py-3">
        <div>
          <span className="font-proxima text-[9px] font-bold uppercase tracking-[0.3em] text-white/38">
            Order Summary
          </span>
          <p className="mt-1 font-sarpanch text-lg font-black uppercase text-white">
            {selectedTier.name} × {qty}
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
            className="flex h-11 w-11 items-center justify-center border border-white/14 bg-white/[0.04] font-sarpanch text-white transition hover:bg-white/10"
          >
            −
          </button>
          <span className="flex h-11 w-14 items-center justify-center border-y border-white/14 bg-white/[0.02] font-sarpanch text-lg font-black text-white">
            {qty}
          </span>
          <button
            id="qty-increase"
            type="button"
            onClick={() =>
              setQty((q) => Math.min(selectedTier.quantity_limit, q + 1))
            }
            className="flex h-11 w-11 items-center justify-center border border-white/14 bg-white/[0.04] font-sarpanch text-white transition hover:bg-white/10"
          >
            +
          </button>
          <span className="ml-3 font-proxima text-[10px] text-white/30">
            max {selectedTier.quantity_limit} per order
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
              w-full border border-white/14 bg-white/[0.04] px-4 py-3.5
              font-proxima text-sm text-white placeholder:text-white/22
              outline-none transition-all
              focus:border-primary/60 focus:bg-white/[0.07]
            "
          />
        </div>
      ))}

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
        disabled={status === "loading"}
        className="boombap-button w-full disabled:opacity-60 disabled:cursor-not-allowed"
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
  const [selectedTierId, setSelectedTierId] = useState("general");
  const selectedTier = TICKET_TIERS.find((t) => t.id === selectedTierId)!;

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
            as="h1"
            delay={0.08}
            className="kinetic-title font-sarpanch text-[clamp(4rem,14vw,10rem)] font-black uppercase leading-[0.82] text-white"
          >
            BOOMBAP
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
            <a href="#book" className="boombap-button">
              <ScrambleText text="Book Now" />
            </a>
            <Link href="/events" className="boombap-button boombap-button--ghost">
              <ScrambleText text="Event Details" />
            </Link>
          </MotionReveal>
        </div>
      </section>

      {/* ── Ticket selection + booking form ── */}
      <section
        id="book"
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
              {TICKET_TIERS.map((tier, i) => {
                const active = tier.id === selectedTierId;
                return (
                  <MotionReveal key={tier.id} delay={i * 0.07}>
                    <button
                      id={`tier-${tier.id}`}
                      type="button"
                      onClick={() => setSelectedTierId(tier.id)}
                      disabled={!tier.available}
                      className={`
                        group w-full text-left border p-6 transition-all duration-200 md:p-7
                        ${active
                          ? "border-primary bg-primary/8 shadow-[6px_6px_0_rgba(160,239,70,0.28)]"
                          : "border-white/10 bg-white/[0.025] hover:border-white/22 hover:bg-white/[0.04]"
                        }
                        ${!tier.available ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
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
                              {!tier.available ? "Sold Out" : "Available"}
                            </span>
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
            <MotionReveal
              delay={0.12}
              className="sticky top-28 border border-white/12 bg-white/[0.025] p-6 md:p-8"
            >
              {/* Form header */}
              <div className="mb-7 flex items-center justify-between border-b border-white/8 pb-6">
                <div>
                  <span className="font-proxima text-[9px] font-black uppercase tracking-[0.34em] text-primary">
                    Your Booking
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
                className="border border-white/10 bg-white/[0.02] p-6"
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
