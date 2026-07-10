import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | BOOMBAP Vol.02 Coming Soon",
  description: "BOOMBAP Vol.02 coming soon.",
};

export default function EventsPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-center text-white">
      <section>
        <p className="mb-4 font-proxima text-[10px] font-bold uppercase tracking-[0.42em] text-primary">
          BOOMBAP
        </p>
        <h1 className="font-sarpanch text-[clamp(4rem,15vw,12rem)] font-black uppercase leading-[0.78]">
          VOL.02
          <br />
          Coming Soon
        </h1>
      </section>
    </main>
  );
}
