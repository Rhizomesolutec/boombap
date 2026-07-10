export default function AdminEventsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-5 max-w-auto">
      <div>
        <h1 className="text-xl font-black uppercase tracking-wide text-white">Events</h1>
        <p className="text-xs text-white/35 mt-0.5">Manage event details shown across the site.</p>
      </div>

      <div className="rounded-sm border border-white/[0.07] bg-[#111111] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-black text-white">BOOMBAP Vol.1</p>
            <p className="mt-1 text-sm text-white/40">Live event overview and ticketing are active.</p>
          </div>
          <span className="w-fit rounded-sm bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            Published
          </span>
        </div>
      </div>
    </div>
  );
}
