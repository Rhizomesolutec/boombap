"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MotionReveal from "../ui/MotionReveal";
import ScrambleText from "../ui/ScrambleText";

type SubjectType = "General" | "Booking" | "Collab" | "Cypher";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<SubjectType>("General");
  const [message, setMessage] = useState("");
  
  // simulated submission state: "idle" | "connecting" | "encrypting" | "sending" | "success" | "error"
  const [submitState, setSubmitState] = useState<"idle" | "connecting" | "encrypting" | "sending" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Fill out all required coordinates.");
      return;
    }
    setErrorMsg("");
    
    // Start simulation sequence
    setSubmitState("connecting");
  };

  useEffect(() => {
    if (submitState === "connecting") {
      const timer = setTimeout(() => setSubmitState("encrypting"), 900);
      return () => clearTimeout(timer);
    }
    if (submitState === "encrypting") {
      const timer = setTimeout(() => setSubmitState("sending"), 1200);
      return () => clearTimeout(timer);
    }
    if (submitState === "sending") {
      const timer = setTimeout(() => {
        setSubmitState("success");
        // Reset form
        setName("");
        setEmail("");
        setMessage("");
        setSubject("General");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [submitState]);

  return (
    <section id="contact" className="relative w-full overflow-hidden border-t border-white/5 bg-black py-24 md:py-32">
      {/* Watermark background */}
      <div className="pointer-events-none absolute left-1/2 top-24 md:top-32 z-0 -translate-x-1/2 opacity-5 select-none">
        <span className="kinetic-title text-watermark whitespace-nowrap">SIGNAL</span>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          
          {/* LEFT COLUMN: Transmission details & metadata */}
          <MotionReveal className="flex flex-col justify-between gap-10">
            <div>
              <span className="mb-4 block font-proxima text-[10px] font-bold uppercase tracking-[0.4em] text-primary">
                Transmission / Channel
              </span>
              <h2 className="font-sarpanch text-5xl font-black leading-tight text-white md:text-6xl">
                TRANSMIT<br />YOUR SIGNAL
              </h2>
              <p className="mt-6 max-w-md font-proxima text-lg leading-relaxed text-white/55">
                Hit us up for booking inquiries, artist collaborations, cypher submissions, or raw community feedback.
              </p>

              {/* Status Box */}
              <div className="mt-8 inline-flex items-center gap-3 border border-secondary/25 bg-secondary/[0.03] px-4 py-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                <span className="font-proxima text-[10px] uppercase tracking-[0.3em] text-white/50">
                  Receiver Online · Bengaluru, IN
                </span>
              </div>
            </div>

            {/* Coordinates / Details */}
            <div className="grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-2">
              <div>
                <span className="block font-proxima text-[9px] font-black uppercase tracking-[0.35em] text-primary">
                  Hotlines
                </span>
                <div className="mt-3 flex flex-col gap-2 font-sarpanch text-base font-bold text-white">
                  <a href="mailto:sound@boombap.in" className="transition-colors hover:text-primary">
                    sound@boombap.in
                  </a>
                  <a href="mailto:collab@boombap.in" className="transition-colors hover:text-primary">
                    collab@boombap.in
                  </a>
                </div>
              </div>

              <div>
                <span className="block font-proxima text-[9px] font-black uppercase tracking-[0.35em] text-primary">
                  Coordinates
                </span>
                <p className="mt-3 font-proxima text-sm uppercase tracking-[0.18em] leading-relaxed text-white/60">
                  Bengaluru, India<br />
                  Vol.02 Active Node
                </p>
              </div>
            </div>
          </MotionReveal>

          {/* RIGHT COLUMN: Form and simulated terminal readout */}
          <MotionReveal delay={0.12} className="relative">
            <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8">
              
              <AnimatePresence mode="wait">
                {submitState === "idle" && (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Name field */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-name" className="font-proxima text-[9px] font-bold uppercase tracking-[0.32em] text-white/40">
                        Identifier *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name / Crew"
                        required
                        className="w-full border border-white/14 bg-white/4 px-4 py-3.5 font-proxima text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-primary/60 focus:bg-white/7"
                      />
                    </div>

                    {/* Email field */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-email" className="font-proxima text-[9px] font-bold uppercase tracking-[0.32em] text-white/40">
                        Return Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.com"
                        required
                        className="w-full border border-white/14 bg-white/4 px-4 py-3.5 font-proxima text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-primary/60 focus:bg-white/7"
                      />
                    </div>

                    {/* Subject Pill selector */}
                    <div className="flex flex-col gap-1.5">
                      <span className="font-proxima text-[9px] font-bold uppercase tracking-[0.32em] text-white/40">
                        Topic Category
                      </span>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {(["General", "Booking", "Collab", "Cypher"] as SubjectType[]).map((subj) => (
                          <button
                            key={subj}
                            type="button"
                            onClick={() => setSubject(subj)}
                            className={`border px-2 py-2.5 text-center font-proxima text-[10px] font-bold uppercase tracking-[0.18em] transition-all ${
                              subject === subj
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-white/10 bg-white/2 text-white/50 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            {subj}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message field */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contact-message" className="font-proxima text-[9px] font-bold uppercase tracking-[0.32em] text-white/40">
                        Message *
                      </label>
                      <textarea
                        id="contact-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Transmit your message here..."
                        required
                        rows={4}
                        className="w-full resize-none border border-white/14 bg-white/4 px-4 py-3.5 font-proxima text-sm text-white placeholder:text-white/20 outline-none transition-all focus:border-primary/60 focus:bg-white/7"
                      />
                    </div>

                    {errorMsg && (
                      <p className="font-proxima text-xs text-red-400">{errorMsg}</p>
                    )}

                    <button type="submit" className="boombap-button mt-2 w-full">
                      <ScrambleText text="TRANSMIT SIGNAL" />
                    </button>
                  </motion.form>
                )}

                {/* Simulated Transmission Progress */}
                {submitState !== "idle" && submitState !== "success" && (
                  <motion.div
                    key="submitting-state"
                    className="flex min-h-[22rem] flex-col justify-between font-mono text-xs text-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex flex-col gap-3">
                      <p className="text-white/30">&gt; INITIALIZING OUTBOUND TRANSMISSION...</p>
                      
                      {submitState !== "connecting" && (
                        <p className="text-white/50">&gt; SECURING HANDSHAKE WITH BOOMBAP NODES... [OK]</p>
                      )}
                      
                      {(submitState === "encrypting" || submitState === "sending") && (
                        <p className="text-white/70">
                          &gt; ENCRYPTING CORRESPONDENCE...<br />
                          <span className="text-secondary">AES-256-GCM / VOL2_NODES_KEY</span>
                        </p>
                      )}
                      
                      {submitState === "sending" && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-primary animate-pulse"
                        >
                          &gt; DISPATCHING SIGNAL PACKETS TO MAINFRAME...
                        </motion.p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 border-t border-white/10 pt-4 text-white/40">
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border border-primary border-t-transparent"></span>
                      <span className="uppercase tracking-widest text-[9px]">
                        {submitState === "connecting" && "Establishing Channel..."}
                        {submitState === "encrypting" && "Encrypting Signal..."}
                        {submitState === "sending" && "Transmitting..."}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Success State */}
                {submitState === "success" && (
                  <motion.div
                    key="success-state"
                    className="flex min-h-[22rem] flex-col items-center justify-center gap-6 text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="flex h-16 w-16 items-center justify-center border border-primary/50 bg-primary/10 text-primary text-3xl">
                      ⚡
                    </div>
                    <h3 className="font-sarpanch text-2xl font-black uppercase text-white">
                      SIGNAL RECEIVED
                    </h3>
                    <p className="max-w-xs font-proxima text-sm leading-relaxed text-white/50">
                      Your transmission has successfully reached the BOOMBAP mainframe. We will return signal shortly.
                    </p>
                    <button
                      onClick={() => setSubmitState("idle")}
                      className="boombap-button mt-4"
                    >
                      <ScrambleText text="SEND NEW SIGNAL" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </MotionReveal>

        </div>
      </div>
    </section>
  );
}
