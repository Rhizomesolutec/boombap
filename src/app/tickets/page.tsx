import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import MotionReveal from "../../components/ui/MotionReveal";

export const metadata: Metadata = {
  title: "Tickets | BOOMBAP Vol.02",
  description: "Tickets for the upcoming BOOMBAP Vol.02 event in Mumbai.",
};

const eventDetails = [
  { label: "Event", value: "BOOMBAP Vol.02" },
  { label: "City", value: "Mumbai" },
  { label: "Date", value: "Announcing soon" },
  { label: "Venue", value: "Announcing soon" },
];

const ticketNotes = [
  "One upcoming BOOMBAP event is live on this page.",
  "Ticket link, venue, lineup, and timing will be updated here.",
  "Vol.02 continues the community-first sound of the first drop.",
];

export default function TicketsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <section className="relative isolate min-h-screen overflow-hidden border-b border-white/10 px-6 pb-20 pt-36 md:px-10 md:pb-28 md:pt-40">
        <Image
          src="/crowd-section.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover opacity-22 grayscale"
        />
        <div className="absolute inset-0 -z-20 bg-linear-to-r from-black via-black/88 to-black/54" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black via-transparent to-black/70" />
        {/* <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.045]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 8px)",
          }}
        /> */}

        <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1fr_27rem] lg:items-end">
          <div>
            <MotionReveal
              as="span"
              className="mb-5 block font-proxima text-[10px] font-bold uppercase tracking-[0.42em] text-primary"
            >
              Tickets / One Upcoming Event
            </MotionReveal>

            <MotionReveal
              as="h1"
              delay={0.1}
              className="kinetic-title font-sarpanch text-[clamp(4.25rem,15vw,11rem)] font-black uppercase leading-[0.78] text-white"
            >
              VOL.02
            </MotionReveal>

            <MotionReveal
              delay={0.2}
              className="mt-8 max-w-2xl border-l border-primary/70 pl-5 md:pl-7"
            >
              <p className="font-proxima text-xl leading-relaxed text-white/72 md:text-2xl">
                The next BOOMBAP night is the only upcoming event right now. No
                clutter, no extra listings, just the Vol.02 ticket drop when it
                opens.
              </p>
            </MotionReveal>

            <MotionReveal delay={0.3} className="mt-10 flex flex-wrap gap-4">
              <a href="#ticket-drop" className="boombap-button">
                View Ticket Status
              </a>
              <Link href="/" className="boombap-button boombap-button--ghost">
                Back Home
              </Link>
            </MotionReveal>
          </div>

          <MotionReveal
            delay={0.25}
            className="relative overflow-hidden border border-primary/35 bg-black/72 p-6 shadow-[10px_10px_0_rgba(160,239,70,0.18)] backdrop-blur md:p-7"
          >
            <div className="mb-8 flex items-start justify-between gap-5 border-b border-white/10 pb-6">
              <div>
                <span className="font-proxima text-[9px] font-black uppercase tracking-[0.34em] text-primary">
                  Now Queued
                </span>
                <h2 className="mt-3 font-sarpanch text-4xl font-black uppercase leading-none text-white">
                  BOOMBAP
                  <br />
                  Vol.02
                </h2>
              </div>
              <span className="border border-white/15 px-3 py-2 font-proxima text-[9px] font-black uppercase tracking-[0.24em] text-white/54">
                TBA
              </span>
            </div>

            <dl className="grid gap-4">
              {eventDetails.map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-white/8 pb-4"
                >
                  <dt className="font-proxima text-[9px] font-bold uppercase tracking-[0.28em] text-white/35">
                    {item.label}
                  </dt>
                  <dd className="font-sarpanch text-lg font-black uppercase text-white">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </MotionReveal>
        </div>
      </section>

      <section
        id="ticket-drop"
        className="relative overflow-hidden bg-black px-6 py-20 md:px-10 md:py-28"
      >
        <div className="absolute left-1/2 top-8 -translate-x-1/2 opacity-5">
          <span className="kinetic-title text-watermark whitespace-nowrap">
            TICKETS
          </span>
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <MotionReveal className="flex flex-col justify-between border border-white/10 bg-white/[0.025] p-7 md:p-9">
            <div>
              <span className="mb-5 inline-flex border border-primary/55 px-3 py-2 font-proxima text-[9px] font-bold uppercase tracking-[0.34em] text-primary">
                Ticket Status
              </span>
              <h2 className="font-sarpanch text-4xl font-black uppercase leading-tight text-white md:text-6xl">
                Drop opens
                <br />
                soon
              </h2>
              <p className="mt-6 max-w-md font-proxima text-base leading-relaxed text-white/58">
                This page is ready for the Vol.02 sale. Add the official
                ticketing link when the drop goes live.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a href="mailto:hello@boombap.in" className="boombap-button">
                Get Updates
              </a>
              <a href="#" className="boombap-button boombap-button--ghost">
                Ticket Link TBA
              </a>
            </div>
          </MotionReveal>

          <div className="grid gap-6 md:grid-cols-3">
            {ticketNotes.map((note, index) => (
              <MotionReveal
                key={note}
                delay={index * 0.08}
                className="min-h-56 border border-white/10 bg-white/[0.025] p-6"
              >
                <span className="font-sarpanch text-sm font-black text-primary">
                  0{index + 1}.
                </span>
                <p className="mt-8 font-proxima text-lg leading-relaxed text-white/66">
                  {note}
                </p>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
