export default function NewAdminEventPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-5 max-w-[900px]">
      <div>
        <h1 className="text-xl font-black uppercase tracking-wide text-white">New Event</h1>
        <p className="text-xs text-white/35 mt-0.5">Create a new BOOMBAP event listing.</p>
      </div>

      <div className="rounded-sm border border-white/[0.07] bg-[#111111] p-5">
        <p className="text-sm text-white/45">Event creation controls can be wired here when the admin data model is ready.</p>
      </div>
    </div>
  );
}
