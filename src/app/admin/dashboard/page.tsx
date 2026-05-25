"use client";

import { useState } from "react";

// ── Inline icon ───────────────────────────────────────────────────────────────
function Icon({ d, size = 18, className = "" }: { d: string; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <path d={d} />
    </svg>
  );
}

// ── Trend badge ───────────────────────────────────────────────────────────────
function Trend({ value, positive }: { value: string; positive: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-sm
      ${positive ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-400"}`}>
      <Icon d={positive ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} size={10} />
      {value}
    </span>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, trend, trendPositive, icon, accent,
}: {
  label: string; value: string; sub?: string;
  trend?: string; trendPositive?: boolean; icon: string; accent?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-sm border border-white/[0.07] bg-[#111111] p-5 flex flex-col gap-4 hover:border-white/[0.14] transition-colors group">
      {/* Glow */}
      <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
        ${accent === "green" ? "bg-primary/20" : accent === "purple" ? "bg-secondary/20" : "bg-white/5"}`} />

      <div className="flex items-start justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-sm
          ${accent === "green" ? "bg-primary/10 text-primary"
            : accent === "purple" ? "bg-secondary/10 text-secondary"
            : "bg-white/6 text-white/50"}`}>
          <Icon d={icon} size={16} />
        </div>
        {trend && <Trend value={trend} positive={trendPositive ?? true} />}
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35 mb-1">{label}</p>
        <p className="text-2xl font-black text-white leading-none">{value}</p>
        {sub && <p className="mt-1 text-xs text-white/30">{sub}</p>}
      </div>
    </div>
  );
}

// ── Recent orders ─────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
  { id: "ORD-0041", name: "Aditya Kumar", tier: "General", qty: 2, amount: "₹200", status: "paid",    time: "2m ago" },
  { id: "ORD-0040", name: "Priya Sharma", tier: "General", qty: 1, amount: "₹100", status: "paid",    time: "18m ago" },
  { id: "ORD-0039", name: "Rohan Verma",  tier: "General", qty: 4, amount: "₹400", status: "pending", time: "34m ago" },
  { id: "ORD-0038", name: "Sneha Iyer",   tier: "General", qty: 1, amount: "₹100", status: "paid",    time: "1h ago" },
  { id: "ORD-0037", name: "Karan Mehta",  tier: "General", qty: 2, amount: "₹200", status: "failed",  time: "2h ago" },
  { id: "ORD-0036", name: "Ananya Nair",  tier: "General", qty: 3, amount: "₹300", status: "paid",    time: "3h ago" },
];

const STATUS_STYLES: Record<string, string> = {
  paid:    "bg-[#A0EF46]/10 text-[#A0EF46]",
  pending: "bg-amber-500/10 text-amber-400",
  failed:  "bg-red-500/10 text-red-400",
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"all" | "paid" | "pending" | "failed">("all");

  const filtered = activeTab === "all"
    ? MOCK_ORDERS
    : MOCK_ORDERS.filter((o) => o.status === activeTab);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-auto">

      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-black uppercase tracking-wide text-white">Dashboard</h1>
          <p className="text-xs text-white/35 mt-0.5">BOOMBAP Vol.1 — Live event overview</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Live
          </span>
          <button
            id="dashboard-export"
            type="button"
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white border border-white/8 hover:border-white/20 px-3 py-1.5 rounded-sm transition-all"
          >
            <Icon d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" size={13} />
            Export
          </button>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Total Revenue" value="₹4,100" sub="41 tickets sold"
          trend="+18%" trendPositive icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          accent="green"
        />
        <StatCard
          label="Tickets Sold" value="41" sub="of 200 available"
          trend="+6 today" trendPositive icon="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          accent="purple"
        />
        <StatCard
          label="Total Orders" value="38" sub="3 pending verification"
          trend="-2 failed" trendPositive={false} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
        <StatCard
          label="Capacity" value="20.5%" sub="159 seats remaining"
          icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </div>

      {/* ── Recent orders table ──────────────────────────────────────────────── */}
      <div className="rounded-sm border border-white/7 bg-[#111111] overflow-hidden">
        {/* Table header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-white/6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">Recent Orders</p>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-white/3 border border-white/6 rounded-sm p-0.5">
            {(["all", "paid", "pending", "failed"] as const).map((tab) => (
              <button
                key={tab}
                id={`orders-filter-${tab}`}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-sm transition-all
                  ${activeTab === tab
                    ? "bg-white/8 text-white"
                    : "text-white/30 hover:text-white/60"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {["Order ID", "Customer", "Tier", "Qty", "Amount", "Status", "Time"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((order, i) => (
                <tr
                  key={order.id}
                  className={`border-b border-white/4 hover:bg-white/2.5 transition-colors
                    ${i === filtered.length - 1 ? "border-0" : ""}`}
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-white/50">{order.id}</td>
                  <td className="px-5 py-3.5 text-white font-medium">{order.name}</td>
                  <td className="px-5 py-3.5 text-white/50">{order.tier}</td>
                  <td className="px-5 py-3.5 text-white/50">{order.qty}</td>
                  <td className="px-5 py-3.5 text-white font-semibold">{order.amount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-semibold capitalize ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-white/30 text-xs">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-white/5">
          {filtered.map((order) => (
            <div key={order.id} className="px-4 py-3.5 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[11px] text-white/35">{order.id}</span>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-semibold capitalize ${STATUS_STYLES[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-white">{order.name}</p>
                <p className="text-xs text-white/30 mt-0.5">{order.tier} × {order.qty} · {order.time}</p>
              </div>
              <span className="text-base font-black text-white shrink-0">{order.amount}</span>
            </div>
          ))}
        </div>

        {/* Table footer */}
        <div className="px-5 py-3 border-t border-white/6 flex items-center justify-between">
          <p className="text-xs text-white/25">Showing {filtered.length} of {MOCK_ORDERS.length} orders</p>
          <a href="/admin/orders" className="text-xs text-primary hover:underline">View all →</a>
        </div>
      </div>
    </div>
  );
}
