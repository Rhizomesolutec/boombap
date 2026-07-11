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
      theme: { color: "#DE1818" },

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
    const FALLBACK_TIER = {
      id: 'sab6-show',
      name: 'SAB6 SHOW',
      price: 6600,
      description: 'Get in early for an exclusive experience.',
      perks: ['General Admission', 'Early Access', 'Exclusive Merch'],
      available: true,
      quantity_limit: 100,
      tickets_remaining: 100,
      max_per_order: 4
    };

    async function loadTiers() {
      try {
        const res = await fetch('/api/tickets');
        const json = await res.json();
        const list: TicketTier[] = res.ok && Array.isArray(json.tiers) && json.tiers.length > 0
          ? json.tiers
          : [FALLBACK_TIER as any];
        setTiers(list);
        setSelectedTierId(list[0].id);
      } catch {
        setTiers([FALLBACK_TIER as any]);
        setSelectedTierId(FALLBACK_TIER.id);
      } finally {
        setLoading(false);
      }
    }

    loadTiers();
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
      <section id="hero-section" className="relative isolate min-h-[72vh] overflow-hidden border-b border-white/10 px-6 pb-16 pt-36 md:px-10 md:pb-24 md:pt-44">
        <style>{`
          #hero-section {
            --color-primary: #DE1818;
          }
          #hero-section .boombap-button {
            background: #DE1818 !important;
            border-color: rgba(222, 24, 24, 0.82) !important;
          }
          #hero-section .boombap-button:hover {
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: 3px 3px 0 #DE1818, 7px 7px 0 #7246c1 !important;
          }
          #hero-section .boombap-button--ghost {
            background: rgba(0, 0, 0, 0.42) !important;
            border-color: rgba(255, 255, 255, 0.28) !important;
            color: #ffffff !important;
            box-shadow: 5px 5px 0 rgba(222, 24, 24, 0.28), 10px 10px 0 rgba(114, 70, 193, 0.18) !important;
          }
        `}</style>
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
              src="/SAB6-logo.jpeg"
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

      <section className="relative overflow-hidden bg-black border-t border-b border-white/10 w-full">
        <style>{`
          .sab6-filter {
            filter: url(#remove-white-filter);
          }
          .sab6-image-panel {
            clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
          }
          @media (max-width: 767px) {
            .sab6-image-panel {
              clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
            }
          }
          .sab6-image-panel::after {
            content: "";
            position: absolute;
            inset: 0;
            background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px);
            pointer-events: none;
            z-index: 2;
          }
        `}</style>
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

        <div className="relative z-10 w-full flex flex-col md:flex-row min-h-[600px] md:min-h-[750px]">
          {/* Left side: Premium artwork gallery (SAB6 profile) as background-cover panel */}
          <div className="sab6-image-panel w-full md:w-[50%] lg:w-[52%] h-[75vw] md:h-auto relative flex-shrink-0">
            <Image
              src="/SAB6/SAB6 profile.jpg"
              alt="SAB6 Artist Profile"
              fill
              sizes="(min-width: 768px) 52vw, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-tr from-black/70 via-transparent to-black/50 z-1" />
          </div>

          {/* Right side: Event headings, description, and socials */}
          <div className="w-full md:w-[50%] lg:w-[48%] flex flex-col justify-center p-8 sm:p-12 md:p-16 lg:p-24 gap-6 items-start">
            <div className="flex flex-col gap-1.5 w-full">
              {/* Show Name Image (Main Title) - smaller */}
              <div className="relative w-full max-w-[220px] aspect-[4/1] overflow-hidden">
                <Image
                  src="/SAB6/Show Name.jpg"
                  alt="SAB6 Show Name"
                  fill
                  className="object-contain object-left sab6-filter"
                />
              </div>

              {/* SAB6 logo image - large like first section */}
              <div className="relative w-full max-w-[480px] aspect-[3/1] overflow-hidden -ml-1">
                <Image
                  src="/SAB6-logo.jpeg"
                  alt="SAB6 Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>

            <div className="relative w-full max-w-[320px] aspect-[4/1]">
              <Image
                src="/SAB6/Date.jpg"
                alt="Date & Time"
                fill
                className="object-contain object-left sab6-filter"
              />
            </div>

            {/* Experience header image */}
            <div className="relative w-full max-w-[200px] aspect-[5/1] opacity-75">
              <Image
                src="/SAB6/Experience.jpg"
                alt="The Experience"
                fill
                className="object-contain object-left sab6-filter"
              />
            </div>

            <p className="text-base leading-relaxed text-white/60 max-w-lg mt-2" style={{ fontFamily: "var(--font-selincah, 'Selincah', sans-serif)" }}>
              Step into the underground. A raw audio-visual exhibition featuring exclusive sets, heavy visual projections, and a gathering of the local hip-hop community. Don't miss the first official showcase.
            </p>

            {/* CTA & Social Channels */}
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-8 w-full">
              {/* Register Now Image styled as button */}
              <a
                href="#SAB6"
                className="group relative block w-52 aspect-[3/1] border border-black bg-neutral-950/80 rounded-xl p-3 transition-all duration-300 hover:scale-[1.03] hover:border-[#DE1818]/30 shadow-lg hover:shadow-2xl overflow-hidden"
              >
                <div className="relative w-full h-full">
                  <Image
                    src="/SAB6/Register now.jpg"
                    alt="Register Now"
                    fill
                    className="object-contain transition-opacity duration-300 group-hover:opacity-90 sab6-filter"
                  />
                </div>
              </a>

              {/* Social media connections */}
              <div className="flex flex-col gap-2">
                <span className="font-proxima text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">Connect</span>
                <div className="flex items-center gap-3">
                  {[
                    { img: "/SAB6/Instagram.jpg", url: "https://instagram.com" },
                    { img: "/SAB6/Whatsapp.jpg", url: "https://whatsapp.com" },
                    { img: "/SAB6/Youtube.jpg", url: "https://youtube.com" }
                  ].map((soc, idx) => (
                    <a
                      key={idx}
                      href={soc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-[#DE1818] transition-all duration-300 hover:scale-110"
                    >
                      <Image
                        src={soc.img}
                        alt="Social channel"
                        fill
                        className="object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticket selection + booking form ── */}
      <section
        id="SAB6"
        className="relative overflow-hidden bg-black px-6 py-20 md:px-10 md:py-28"
      >
        <style>{`
          #SAB6 {
            --color-primary: #DE1818;
          }
          #SAB6 .boombap-button {
            background: #DE1818 !important;
            border-color: rgba(222, 24, 24, 0.82) !important;
          }
          #SAB6 .boombap-button:hover {
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: 3px 3px 0 #DE1818, 7px 7px 0 #7246c1 !important;
          }
        `}</style>

        {/* Watermark */}
        <div className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 opacity-[0.04] select-none z-10">
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
                        group w-[85%] text-left border p-6 transition-all duration-200 md:p-7 min-h-[480px] flex flex-col justify-center gap-6 relative overflow-hidden
                        ${active
                          ? "border-primary bg-primary/8 shadow-[6px_6px_0_rgba(222,24,24,0.28)]"
                          : "border-white/10 bg-white/2.5 hover:border-white/22 hover:bg-white/4"
                        }
                        ${isSoldOut ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                      `}
                    >
                      {/* Apply SAB6 background to all ticket tiers */}
                      {true && (
                        <div className="absolute inset-0 z-0 pointer-events-none">
                          <Image
                            src="/SAB6/Ticket image.jpg"
                            alt="SAB6 Show Card Background"
                            fill
                            className="object-cover opacity-25 group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/55" />
                        </div>
                      )}
                      <div className="relative z-10 flex items-start justify-between gap-4">
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

                      <p className="mt-4 font-proxima text-sm leading-relaxed text-white/52 relative z-10">
                        {tier.description}
                      </p>

                      <ul className="mt-5 flex flex-wrap gap-2 relative z-10">
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

      {/* ── VOL 02 BENGALURU SECTION (COMING SOON) ── */}
      <section className="relative w-full bg-black overflow-hidden border-t border-white/10">
        <style>{`
          .vol2-image-panel {
            clip-path: polygon(0 0, 100% 0, 88% 100%, 0 100%);
          }
          @media (max-width: 767px) {
            .vol2-image-panel {
              clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
            }
          }
          .vol2-image-panel::after {
            content: "";
            position: absolute;
            inset: 0;
            background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px);
            pointer-events: none;
            z-index: 2;
          }
          .vol2-ticker-inner {
            display: flex;
            gap: 0;
            white-space: nowrap;
            animation: vol2-tick 18s linear infinite;
          }
          @keyframes vol2-tick {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .vol2-ticker-item {
            display: inline-flex;
            align-items: center;
            gap: 20px;
            padding: 0 32px;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: rgba(0,0,0,0.75);
          }
          .vol2-ticker-dot {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: rgba(0,0,0,0.4);
            flex-shrink: 0;
          }
        `}</style>

        <div className="relative z-10 w-full min-h-screen flex flex-col md:flex-row">
          {/* ═══ IMAGE PANEL ═══ */}
          <div className="vol2-image-panel w-full md:w-[52%] h-[55vw] md:h-auto md:min-h-screen relative flex-shrink-0">
            <Image
              src="/boombap-experience.jpg"
              alt="Vol. 02 Experience"
              fill
              sizes="(min-width: 768px) 52vw, 100vw"
              className="object-cover opacity-45 grayscale blur-[0.5px]"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-tr from-black/82 via-black/20 to-black/60 z-1" />

            {/* Coming Soon Badge in Center of Image */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
              <span className="font-sarpanch text-[10px] font-bold uppercase tracking-[0.42em] text-primary bg-black/85 px-3 py-1.5 border border-primary/30 mb-3 shadow-[0_0_15px_rgba(160,239,70,0.15)]">
                Vol. 02 Bengaluru
              </span>
              <h3 className="font-sarpanch text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-widest">
                COMING SOON
              </h3>
              <p className="mt-2 font-proxima text-xs text-white/50 tracking-wider">
                STAY TUNED FOR UPDATES
              </p>
            </div>

            {/* Corner badge */}
            <div className="absolute bottom-10 left-8 z-10 flex flex-col gap-1">
              <span className="font-proxima text-[8px] font-bold uppercase tracking-[0.35em] text-white/35">Location</span>
              <span className="font-sarpanch text-sm font-bold uppercase tracking-[0.08em] text-white/70">Bengaluru, IN</span>
            </div>

            {/* Vol stamp on image */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontFamily: "var(--font-sarpanch, 'Sarpanch', sans-serif)",
                fontSize: "clamp(80px, 14vw, 180px)",
                fontWeight: 900,
                lineHeight: 1,
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,0.08)",
                whiteSpace: "nowrap",
                userSelect: "none",
                pointerEvents: "none",
                zIndex: 3,
                letterSpacing: "-0.03em",
              }}
            >
              VOL.02
            </div>

            {/* Ticker bar anchored to image bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-20 h-8 bg-primary flex items-center overflow-hidden">
              <div className="vol2-ticker-inner">
                {[...Array(2)].map((_, i) => (
                  <span key={i} style={{ display: "inline-flex" }}>
                    {["Live Underground Sets", "Audio-Visual Installations", "Limited Access", "Bengaluru 2025", "Community of Sound"].map((item, j) => (
                      <span key={j} className="vol2-ticker-item">
                        {item}
                        <span className="vol2-ticker-dot" />
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ═══ CONTENT PANEL ═══ */}
          <div className="relative flex-1 flex flex-col justify-center p-10 md:p-16 lg:p-20 bg-black">
            {/* Huge ghost numeral behind content */}
            <span className="absolute right-[-0.05em] top-1/2 -translate-y-1/2 font-sarpanch text-[160px] md:text-[22vw] lg:text-[300px] font-black text-transparent select-none pointer-events-none z-0" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.06)", whiteSpace: "nowrap" }}>
              02
            </span>

            {/* Pill */}
            <div className="relative z-10 self-start border border-white/12 px-3.5 py-1 font-proxima text-[9px] font-bold uppercase tracking-[0.35em] text-white/45 mb-6">
              The Experience
            </div>

            {/* Main heading */}
            <h2 className="relative z-10 font-sarpanch text-4xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-14">
              Vol. 02
              <span className="block text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.5)" }}>Bengaluru</span>
            </h2>

            {/* Features */}
            <div className="relative z-10 border-t border-white/7 mb-14">
              {[
                {
                  num: "01",
                  title: "Masters of Underground",
                  body: "Live sets from international artists at the edge of the underground.",
                },
                {
                  num: "02",
                  title: "Immersive AV Art",
                  body: "Audio-visual installations that dissolve the line between sound and space.",
                },
                {
                  num: "03",
                  title: "Sound & Soul",
                  body: "A gathering of people who feel music as much as they hear it.",
                },
              ].map(({ num, title, body }) => (
                <div key={num} className="grid grid-cols-[56px_1fr] gap-5 py-6 border-b border-white/7 transition-colors hover:bg-white/[0.02]">
                  <span className="font-sarpanch text-xs font-bold text-primary tracking-widest pt-0.5">{num}</span>
                  <p className="font-proxima text-sm text-white/65 leading-relaxed">
                    <strong className="block text-base font-semibold text-white/92 mb-1">{title}</strong>
                    {body}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA (Coming Soon) */}
            <div className="relative z-10 flex items-center gap-6">
              <span className="font-sarpanch text-xs font-black text-primary border border-primary/40 bg-primary/8 px-6 py-3 tracking-widest">
                COMING SOON
              </span>
              <span className="w-12 h-[1px] bg-white/7" />
              <span className="font-proxima text-[10px] tracking-[0.25em] uppercase text-white/25">
                We will update later
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── VOL 02 BLURRED TICKET VIEW + BOOKING (COMING SOON) ── */}
      <section className="relative overflow-hidden bg-black px-6 py-20 md:px-10 md:py-28 border-t border-white/10">
        {/* Watermark background */}
        <div className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 opacity-[0.02] select-none">
          <span className="kinetic-title text-[120px] font-black tracking-widest text-white whitespace-nowrap">
            VOL 2 TICKETS
          </span>
        </div>

        {/* Blurred Ticket Booking Section */}
        <div className="relative z-10 mx-auto max-w-7xl filter blur-[4px] opacity-25 select-none pointer-events-none">
          <div className="mb-10">
            <span className="font-proxima text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              Select Your Ticket
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            {/* Left side: dummy cards */}
            <div className="flex flex-col gap-4">
              {[
                {
                  id: "vol2-ga",
                  name: "VOL. 02 - GA PHASE 1",
                  price: "₹1,299",
                  description: "Standard general admission access for the Vol. 02 experience in Bengaluru.",
                  perks: ["General Admission Entry", "Access to Stages & Bars"]
                },
                {
                  id: "vol2-vip",
                  name: "VOL. 02 - VIP PASS",
                  price: "₹2,499",
                  description: "Premium access pass including fast-track entry and exclusive visual zone access.",
                  perks: ["VIP Skip the Line", "Exclusive Vol. 02 Merch", "Private Lounge Access"]
                }
              ].map((tier) => (
                <div
                  key={tier.id}
                  className="w-[85%] border border-white/10 bg-white/2.5 p-6 md:p-7 min-h-[300px] flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center border border-white/25">
                        <span className="h-2 w-2 bg-transparent" />
                      </span>
                      <div>
                        <span className="font-proxima text-[9px] font-black uppercase tracking-[0.32em] text-white/40">
                          Unavailable
                        </span>
                        <h3 className="mt-1 font-sarpanch text-xl font-black uppercase text-white">
                          {tier.name}
                        </h3>
                      </div>
                    </div>
                    <span className="font-sarpanch text-xl font-black text-white">
                      {tier.price}
                    </span>
                  </div>
                  <p className="mt-4 font-proxima text-sm leading-relaxed text-white/52">
                    {tier.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="border border-white/12 px-2.5 py-1 font-proxima text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Right side: dummy booking form */}
            <div className="border border-white/12 bg-white/2.5 p-6 md:p-8">
              <div className="mb-7 flex items-center justify-between border-b border-white/8 pb-6">
                <div>
                  <span className="font-proxima text-[9px] font-black uppercase tracking-[0.34em] text-primary">
                    Your Booking · VOL 02
                  </span>
                  <h2 className="mt-2 font-sarpanch text-2xl font-black uppercase text-white">
                    VOL. 02 Ticket
                  </h2>
                </div>
                <span className="font-sarpanch text-3xl font-black text-primary">
                  ₹1,299
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-11 bg-white/5 border border-white/10" />
                <div className="h-11 bg-white/5 border border-white/10" />
                <div className="h-11 bg-white/5 border border-white/10" />
                <div className="h-20 bg-white/2 border border-white/10" />
                <div className="h-11 bg-primary/20 border border-primary/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Overlay in Center */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-md border border-white/10 bg-black/75 backdrop-blur-md p-8 md:p-10 shadow-2xl relative">
            {/* Tech line detail */}
            <div className="absolute top-0 left-0 w-8 h-[2px] bg-primary" />
            <div className="absolute top-0 left-0 w-[2px] h-8 bg-primary" />
            <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-primary" />
            <div className="absolute bottom-0 right-0 w-[2px] h-8 bg-primary" />

            <span className="font-proxima text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
              Vol. 02 Bengaluru
            </span>
            <h2 className="mt-4 font-sarpanch text-2xl md:text-3xl font-black uppercase text-white leading-tight">
              TICKETS COMING SOON
            </h2>
            <p className="mt-4 font-proxima text-sm leading-relaxed text-white/60">
              Ticket prices and booking features for Vol. 02 will release soon.
              Sign up for notifications to be first to hear about booking open dates.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter email for updates"
                disabled
                className="w-full border border-white/14 bg-white/4 px-4 py-3 font-proxima text-xs text-white/50 placeholder:text-white/20 outline-none"
              />
              <button
                type="button"
                disabled
                className="boombap-button whitespace-nowrap !min-h-0 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Notify Me
              </button>
            </div>

            <p className="mt-5 text-[9px] font-proxima tracking-[0.18em] text-white/24 uppercase">
              We will update the ticket prices later
            </p>
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
