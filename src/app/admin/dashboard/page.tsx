"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/src/components/ui/Icon";
import { formatPrice, getRelativeTime } from "@/src/lib/utils";

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
  label, value, sub, trend, trendPositive, icon, accent, loading
}: {
  label: string; value: string; sub?: string;
  trend?: string; trendPositive?: boolean; icon: string; accent?: string; loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-sm border border-white/[0.07] bg-[#111111] p-5 flex flex-col gap-4 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="h-9 w-9 rounded-sm bg-white/5" />
        </div>
        <div>
          <div className="h-3.5 w-20 bg-white/5 rounded-sm mb-2" />
          <div className="h-6 w-24 bg-white/10 rounded-sm mb-1" />
          <div className="h-3 w-32 bg-white/5 rounded-sm" />
        </div>
      </div>
    );
  }

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

const STATUS_STYLES: Record<string, string> = {
  paid:    "bg-[#A0EF46]/10 text-[#A0EF46] border border-[#A0EF46]/20",
  pending: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  failed:  "bg-red-500/10 text-red-400 border border-red-500/20",
};

interface Order {
  id: number;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  ticket_tier: string;
  ticket_tier_name: string;
  quantity: number;
  amount_paise: number;
  razorpay_order_id: string;
  status: "paid" | "pending" | "failed";
  created_at: string;
}

interface StatsSummary {
  total_tiers: number;
  total_sold: number;
  total_pending: number;
  total_failed: number;
  total_revenue_paise: number;
  total_revenue_rupees: number;
  total_capacity: number;
  tickets_remaining: number;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"all" | "paid" | "pending" | "failed">("all");
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsRes = await fetch("/api/tickets/stats");
      if (!statsRes.ok) throw new Error("Failed to load statistics.");
      const statsData = await statsRes.json();
      setSummary(statsData.summary);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    setOrdersLoading(true);
    try {
      const statusParam = activeTab !== "all" ? `&status=${activeTab}` : "";
      const res = await fetch(`/api/orders?limit=6${statusParam}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders ?? []);
      }
    } catch (err) {
      console.error("Dashboard: failed to load recent orders", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchRecentOrders();
  }, [activeTab]);

  const handleExport = () => {
    if (orders.length === 0) return;
    const headers = ["Order ID", "Customer", "Email", "Phone", "Tier", "Qty", "Amount (INR)", "Status", "Date"];
    const rows = orders.map((o) => [
      o.razorpay_order_id || o.id,
      o.buyer_name,
      o.buyer_email,
      o.buyer_phone,
      o.ticket_tier_name,
      o.quantity,
      o.amount_paise / 100,
      o.status,
      new Date(o.created_at).toISOString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((e) => e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `boombap_orders_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute calculated values
  const totalPaidRevenue = summary ? formatPrice(summary.total_revenue_paise) : "₹0";
  const totalSold = summary ? summary.total_sold : 0;
  const totalCapacity = summary ? summary.total_capacity : 0;
  const totalAttempts = summary ? (summary.total_sold + summary.total_pending + summary.total_failed) : 0;
  const totalPending = summary ? summary.total_pending : 0;
  const totalFailed = summary ? summary.total_failed : 0;
  const remainingTickets = summary ? summary.tickets_remaining : 0;
  const capacityPercentage = (summary && totalCapacity > 0)
    ? `${((totalSold / totalCapacity) * 100).toFixed(1)}%`
    : "0.0%";

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
            onClick={handleExport}
            disabled={orders.length === 0}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white border border-white/8 hover:border-white/20 px-3 py-1.5 rounded-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Icon d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" size={13} />
            Export
          </button>
        </div>
      </div>

      {/* ── Error Banner ───────────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center gap-3">
          <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={14} />
          {error}
          <button onClick={fetchDashboardData} className="ml-auto text-xs underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* ── Stat cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Total Revenue" value={totalPaidRevenue} sub={`${totalSold} tickets sold`}
          trend="+18%" trendPositive icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          accent="green"
          loading={loading}
        />
        <StatCard
          label="Tickets Sold" value={String(totalSold)} sub={`of ${totalCapacity} available`}
          trend={`+${totalSold} overall`} trendPositive icon="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          accent="purple"
          loading={loading}
        />
        <StatCard
          label="Total Sessions" value={String(totalAttempts)} sub={`${totalPending} pending verification`}
          trend={`-${totalFailed} failed`} trendPositive={false} icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          loading={loading}
        />
        <StatCard
          label="Capacity Filled" value={capacityPercentage} sub={`${remainingTickets} remaining`}
          icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          loading={loading}
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
                className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-sm transition-all cursor-pointer
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
              {ordersLoading ? (
                Array(5).fill(0).map((_, idx) => (
                  <tr key={idx} className="border-b border-white/4 last:border-0 animate-pulse">
                    <td className="px-5 py-4"><div className="h-3 w-20 bg-white/5 rounded-sm" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-32 bg-white/10 rounded-sm" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-16 bg-white/5 rounded-sm" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-6 bg-white/5 rounded-sm" /></td>
                    <td className="px-5 py-4"><div className="h-3.5 w-12 bg-white/10 rounded-sm" /></td>
                    <td className="px-5 py-4"><div className="h-5 w-16 bg-white/5 rounded-sm" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-12 bg-white/5 rounded-sm" /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-white/30">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <tr
                    key={order.id}
                    className={`border-b border-white/4 hover:bg-white/2.5 transition-colors
                      ${i === orders.length - 1 ? "border-0" : ""}`}
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-white/50">{order.razorpay_order_id || order.id}</td>
                    <td className="px-5 py-3.5 text-white font-medium">{order.buyer_name}</td>
                    <td className="px-5 py-3.5 text-white/50">{order.ticket_tier_name}</td>
                    <td className="px-5 py-3.5 text-white/50">{order.quantity}</td>
                    <td className="px-5 py-3.5 text-white font-semibold">{formatPrice(order.amount_paise)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-semibold capitalize ${STATUS_STYLES[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-white/30 text-xs">{getRelativeTime(order.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-white/5">
          {ordersLoading ? (
            Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="px-4 py-3.5 space-y-2 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-20 bg-white/5 rounded-sm" />
                  <div className="h-4 w-12 bg-white/5 rounded-sm" />
                </div>
                <div className="h-3.5 w-32 bg-white/10 rounded-sm" />
                <div className="h-3 w-40 bg-white/5 rounded-sm" />
              </div>
            ))
          ) : orders.length === 0 ? (
            <div className="px-4 py-8 text-center text-white/30">
              No orders found.
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="px-4 py-3.5 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[11px] text-white/35">{order.razorpay_order_id || order.id}</span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-semibold capitalize ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-white">{order.buyer_name}</p>
                  <p className="text-xs text-white/30 mt-0.5">{order.ticket_tier_name} × {order.quantity} · {getRelativeTime(order.created_at)}</p>
                </div>
                <span className="text-base font-black text-white shrink-0">{formatPrice(order.amount_paise)}</span>
              </div>
            ))
          )}
        </div>

        {/* Table footer */}
        <div className="px-5 py-3 border-t border-white/6 flex items-center justify-between">
          <p className="text-xs text-white/25">Showing {orders.length} orders</p>
          <Link href="/admin/orders" className="text-xs text-primary hover:underline">View all →</Link>
        </div>
      </div>
    </div>
  );
}
