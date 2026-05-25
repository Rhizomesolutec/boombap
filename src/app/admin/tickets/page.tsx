"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tier = {
  id: string;
  name: string;
  price: number;
  description: string;
  perks: string[];
  available: boolean;
  quantity_limit: number;
  sort_order?: number;
  max_per_order?: number;
  // injected from stats
  total_sold?: number;
  tickets_remaining?: number;
  sold_percentage?: number;
  total_revenue_rupees?: number;
};

// ─── Icon ─────────────────────────────────────────────────────────────────────
function Icon({ d, size = 16, className = "" }: { d: string; size?: number; className?: string }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" className={className}
    >
      <path d={d} />
    </svg>
  );
}

// ─── Inline toggle switch ─────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      aria-checked={checked}
      role="switch"
      className={`relative flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none
        ${checked ? "bg-primary" : "bg-white/12"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`absolute h-3.5 w-3.5 rounded-full bg-black transition-transform duration-200
          ${checked ? "translate-x-[18px]" : "translate-x-1"}`}
      />
    </button>
  );
}

// ─── Blank form state ─────────────────────────────────────────────────────────
const BLANK_FORM = {
  id: "",
  name: "",
  price: "",
  description: "",
  perks: "",
  quantity_limit: "",
  sort_order: "0",
  max_per_order: "4",
  available: true,
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminTicketsPage() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create/Edit modal
  const [showCreate, setShowCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete confirm
  const [deleting, setDeleting] = useState<string | null>(null); // tier id being deleted

  // Toggling
  const [toggling, setToggling] = useState<string | null>(null);

  // ── Load tiers from stats API ─────────────────────────────────────────────
  const fetchTiers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tickets/stats");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load tiers");
      setTiers(json.tiers ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  console.log("tiers", tiers);

  useEffect(() => { fetchTiers(); }, [fetchTiers]);

  // ── Toggle availability ───────────────────────────────────────────────────
  const handleToggle = async (id: string) => {
    setToggling(id);
    try {
      const res = await fetch(`/api/tickets/${id}/toggle`, { method: "PATCH" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Toggle failed");
      // Optimistic update
      setTiers((prev) =>
        prev.map((t) => (t.id === id ? { ...t, available: json.available } : t))
      );
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setToggling(null);
    }
  };

  // ── Create/Edit tier ───────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const perks = form.perks
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    const payload = {
      id: form.id.trim().toLowerCase().replace(/\s+/g, "-"),
      name: form.name.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      perks,
      available: form.available,
      quantity_limit: Number(form.quantity_limit),
      sort_order: Number(form.sort_order),
      max_per_order: Number(form.max_per_order || 4),
    };

    try {
      const url = isEdit ? `/api/tickets/${payload.id}` : "/api/tickets";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `${isEdit ? "Update" : "Create"} failed`);
      await fetchTiers();
      setShowCreate(false);
      setIsEdit(false);
      setForm(BLANK_FORM);
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const pct = (t: Tier) =>
    t.quantity_limit > 0
      ? Math.min(100, Math.round(((t.total_sold ?? 0) / t.quantity_limit) * 100))
      : 0;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-auto space-y-6">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/6 pb-5">
        <div>
          <h1 className="text-xl font-black uppercase tracking-wide text-white">Tickets</h1>
          <p className="text-xs text-white/35 mt-0.5">Manage ticket tiers for BOOMBAP Vol.1</p>
        </div>
        <button
          id="create-ticket-btn"
          type="button"
          onClick={() => { setShowCreate(true); setIsEdit(false); setFormError(null); setForm(BLANK_FORM); }}
          className="flex items-center justify-center gap-2 bg-primary text-black text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm hover:bg-[#b8f566] transition-colors self-start sm:self-auto"
        >
          <Icon d="M12 4v16m8-8H4" />
          New Tier
        </button>
      </div>

      {/* ── Error banner ─────────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center gap-3">
          <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={14} />
          {error}
          <button onClick={fetchTiers} className="ml-auto text-xs underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* ── Loading skeleton ──────────────────────────────────────────────── */}
      {loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-sm border border-white/[0.07] bg-[#111111] p-5 animate-pulse space-y-3">
              <div className="h-3 w-1/3 rounded bg-white/6" />
              <div className="h-7 w-1/4 rounded bg-white/6" />
              <div className="h-2 w-full rounded-full bg-white/6" />
            </div>
          ))}
        </div>
      )}

      {/* ── Tier cards ───────────────────────────────────────────────────── */}
      {!loading && tiers.length === 0 && !error && (
        <div className="rounded-sm border border-dashed border-white/12 bg-white/2 py-16 text-center">
          <Icon d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" size={28} className="mx-auto text-white/20 mb-3" />
          <p className="text-sm text-white/30">No ticket tiers yet.</p>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="mt-4 text-xs text-primary hover:underline"
          >
            Create the first tier →
          </button>
        </div>
      )}

      {!loading && tiers.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {tiers.map((tier) => {
            const soldPct = pct(tier);
            return (
              <div
                key={tier.id}
                className="rounded-sm border border-white/[0.07] bg-[#111111] p-5 flex flex-col gap-4 hover:border-white/[0.14] transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">{tier.id}</p>
                    <h3 className="mt-0.5 text-lg font-black text-white uppercase">{tier.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-white/40">
                      {tier.available ? "On sale" : "Paused"}
                    </span>
                    <Toggle
                      checked={tier.available}
                      onChange={() => handleToggle(tier.id)}
                      disabled={toggling === tier.id}
                    />
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: "Price", value: `₹${(tier.price / 100).toLocaleString("en-IN")}` },
                    { label: "Sold", value: `${tier.total_sold ?? 0} / ${tier.quantity_limit}` },
                    { label: "Revenue", value: `₹${(tier.total_revenue_rupees ?? 0).toLocaleString("en-IN")}` },
                    { label: "Max/Order", value: `${tier.max_per_order ?? 4}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-sm bg-white/3 border border-white/6 px-3 py-2">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">{label}</p>
                      <p className="mt-0.5 text-sm font-black text-white">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${soldPct}%`,
                        background: soldPct >= 80 ? "#ef4444" : soldPct >= 50 ? "#f59e0b" : "#A0EF46",
                      }}
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between text-[10px] text-white/25">
                    <span>{soldPct}% sold</span>
                    <span>{tier.tickets_remaining ?? tier.quantity_limit} remaining</span>
                  </div>
                </div>

                {/* Perks */}
                {tier.perks?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tier.perks.map((p) => (
                      <span key={p} className="border border-white/8 px-2 py-0.5 text-[10px] text-white/40 rounded-sm">
                        {p}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                {tier.description && (
                  <p className="text-xs text-white/35 leading-relaxed">{tier.description}</p>
                )}

                {/* Card Actions */}
                <div className="mt-2 flex items-center justify-end gap-2 border-t border-white/4 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormError(null);
                      setForm({
                        id: tier.id,
                        name: tier.name,
                        price: tier.price.toString(),
                        description: tier.description ?? "",
                        perks: tier.perks?.join("\n") ?? "",
                        available: tier.available,
                        quantity_limit: tier.quantity_limit.toString(),
                        sort_order: (tier.sort_order ?? 0).toString(),
                        max_per_order: (tier.max_per_order ?? 4).toString(),
                      });
                      setIsEdit(true);
                      setShowCreate(true);
                    }}
                    className="flex items-center gap-1.5 rounded-sm border border-white/8 hover:border-white/20 bg-white/2 hover:bg-white/6 px-3 py-1.5 text-xs text-white/60 hover:text-white transition-all cursor-pointer"
                  >
                    <Icon d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" size={13} />
                    Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create Tier Modal ─────────────────────────────────────────────── */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-sm border border-white/10 bg-[#0d0d0d] shadow-2xl overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/7">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Admin</p>
                <h2 className="text-base font-black uppercase text-white mt-0.5">
                  {isEdit ? "Edit Ticket Tier" : "Create Ticket Tier"}
                </h2>
              </div>
              <button
                id="close-create-modal"
                type="button"
                onClick={() => setShowCreate(false)}
                className="text-white/30 hover:text-white transition-colors"
              >
                <Icon d="M6 18L18 6M6 6l12 12" />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh]">
              <div className="px-6 py-5 space-y-4">

                {/* ID + Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="tier-id" className="block text-[9px] font-bold uppercase tracking-[0.3em] text-white/35 mb-1.5">
                      Tier Slug <span className="text-primary">*</span>
                    </label>
                    <input
                      id="tier-id"
                      type="text"
                      required
                      disabled={isEdit}
                      placeholder="general"
                      value={form.id}
                      onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                      className="w-full border border-white/10 bg-white/4 px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <p className="mt-1 text-[9px] text-white/25">
                      {isEdit ? "Slug cannot be changed after creation" : "lowercase, no spaces (e.g. general, vip)"}
                    </p>
                  </div>
                  <div>
                    <label htmlFor="tier-name" className="block text-[9px] font-bold uppercase tracking-[0.3em] text-white/35 mb-1.5">
                      Display Name <span className="text-primary">*</span>
                    </label>
                    <input
                      id="tier-name"
                      type="text"
                      required
                      placeholder="General Admission"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full border border-white/10 bg-white/4 px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-colors rounded-sm"
                    />
                  </div>
                </div>

                {/* Price + Capacity */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="tier-price" className="block text-[9px] font-bold uppercase tracking-[0.3em] text-white/35 mb-1.5">
                      Price (paise) <span className="text-primary">*</span>
                    </label>
                    <input
                      id="tier-price"
                      type="number"
                      required
                      min={0}
                      placeholder="10000"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      className="w-full border border-white/10 bg-white/4 px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-colors rounded-sm"
                    />
                    <p className="mt-1 text-[9px] text-white/25">
                      {form.price ? `₹${(Number(form.price) / 100).toLocaleString("en-IN")}` : "₹0"}
                    </p>
                  </div>
                  <div>
                    <label htmlFor="tier-capacity" className="block text-[9px] font-bold uppercase tracking-[0.3em] text-white/35 mb-1.5">
                      Capacity <span className="text-primary">*</span>
                    </label>
                    <input
                      id="tier-capacity"
                      type="number"
                      required
                      min={1}
                      placeholder="200"
                      value={form.quantity_limit}
                      onChange={(e) => setForm((f) => ({ ...f, quantity_limit: e.target.value }))}
                      className="w-full border border-white/10 bg-white/4 px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-colors rounded-sm"
                    />
                    <p className="mt-1 text-[9px] text-white/25">max tickets for this tier</p>
                  </div>
                </div>

                {/* Sort order & Max Per Order */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="tier-sort" className="block text-[9px] font-bold uppercase tracking-[0.3em] text-white/35 mb-1.5">
                      Sort Order
                    </label>
                    <input
                      id="tier-sort"
                      type="number"
                      min={0}
                      value={form.sort_order}
                      onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
                      className="w-full border border-white/10 bg-white/4 px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-colors rounded-sm"
                    />
                    <p className="mt-1 text-[9px] text-white/25">lower = shown first</p>
                  </div>
                  <div>
                    <label htmlFor="tier-max-per-order" className="block text-[9px] font-bold uppercase tracking-[0.3em] text-white/35 mb-1.5">
                      Max Per Order <span className="text-primary">*</span>
                    </label>
                    <input
                      id="tier-max-per-order"
                      type="number"
                      required
                      min={1}
                      placeholder="4"
                      value={form.max_per_order}
                      onChange={(e) => setForm((f) => ({ ...f, max_per_order: e.target.value }))}
                      className="w-full border border-white/10 bg-white/4 px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-colors rounded-sm"
                    />
                    <p className="mt-1 text-[9px] text-white/25">limit per transaction</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="tier-desc" className="block text-[9px] font-bold uppercase tracking-[0.3em] text-white/35 mb-1.5">
                    Description
                  </label>
                  <textarea
                    id="tier-desc"
                    rows={2}
                    placeholder="Full access to the night. Standing floor."
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full border border-white/10 bg-white/4 px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-colors rounded-sm resize-none"
                  />
                </div>

                {/* Perks */}
                <div>
                  <label htmlFor="tier-perks" className="block text-[9px] font-bold uppercase tracking-[0.3em] text-white/35 mb-1.5">
                    Perks <span className="text-white/20 normal-case tracking-normal">(one per line)</span>
                  </label>
                  <textarea
                    id="tier-perks"
                    rows={3}
                    placeholder={"Entry to the event\nAccess to all performances\nVIP lounge"}
                    value={form.perks}
                    onChange={(e) => setForm((f) => ({ ...f, perks: e.target.value }))}
                    className="w-full border border-white/10 bg-white/4 px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary/50 transition-colors rounded-sm resize-none font-mono"
                  />
                </div>

                {/* Available toggle */}
                <div className="flex items-center justify-between border border-white/7 rounded-sm px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold text-white">Available for purchase</p>
                    <p className="text-[10px] text-white/30 mt-0.5">Buyers can see and book this tier</p>
                  </div>
                  <Toggle
                    checked={form.available}
                    onChange={() => setForm((f) => ({ ...f, available: !f.available }))}
                  />
                </div>

                {/* Form error */}
                {formError && (
                  <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                    {formError}
                  </p>
                )}
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/7">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="text-xs text-white/40 border border-white/8 px-4 py-2 rounded-sm hover:bg-white/4 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="submit-create-tier"
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary text-black text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-sm hover:bg-[#b8f566] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <span className="h-3 w-3 rounded-full border border-black/30 border-t-black animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Icon d="M5 13l4 4L19 7" size={13} />
                      {isEdit ? "Save Changes" : "Create Tier"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}