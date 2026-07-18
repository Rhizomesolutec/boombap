"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/src/components/ui/Icon";
import { formatPrice, formatDate } from "@/src/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── TYPES ────────────────────────────────────────────────────────────────────
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
  razorpay_payment_id?: string;
  status: "paid" | "pending" | "failed";
  created_at: string;
  ticket_category: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const limit = 10;

  // Summary
  const [summary, setSummary] = useState({
    totalCount: 0,
    totalPaid: 0,
    totalPaidQty: 0,
    totalPendingCount: 0,
  });

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 450);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const offset = page * limit;
      const statusParam = statusFilter !== "all" ? `&status=${statusFilter}` : "";
      const searchParam = debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : "";

      const res = await fetch(`/api/orders?limit=${limit}&offset=${offset}${statusParam}${searchParam}`);
      if (!res.ok) throw new Error("Failed to load orders.");
      const data = await res.json();
      setOrders(data.orders ?? []);

      // Calculate total stats from search/page metrics
      const total = data.total ?? 0;
      setSummary((prev) => ({
        ...prev,
        totalCount: total,
      }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch overall statistics for KPIs once on load
  const fetchKPIs = async () => {
    try {
      const res = await fetch("/api/tickets/stats");
      if (res.ok) {
        const data = await res.json();
        const sum = data.summary;
        setSummary({
          totalCount: sum.total_sold + sum.total_pending + sum.total_failed,
          totalPaid: sum.total_revenue_rupees,
          totalPaidQty: sum.total_sold,
          totalPendingCount: sum.total_pending,
        });
      }
    } catch (e) {
      console.error("Failed to load KPIs", e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, debouncedSearch]);

  useEffect(() => {
    fetchKPIs();
  }, []);

  // ─── PDF Download ──────────────────────────────────────────────────────────
  const [downloading, setDownloading] = useState(false);

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      // Fetch ALL orders matching current filter/search (no pagination)
      const statusParam = statusFilter !== "all" ? `&status=${statusFilter}` : "";
      const searchParam = debouncedSearch ? `&search=${encodeURIComponent(debouncedSearch)}` : "";

      // Fetch orders and global stats in parallel
      const [ordersRes, statsRes] = await Promise.all([
        fetch(`/api/orders?limit=10000&offset=0${statusParam}${searchParam}`),
        fetch("/api/tickets/stats"),
      ]);
      if (!ordersRes.ok) throw new Error("Failed to fetch orders for export.");
      const data = await ordersRes.json();
      const allOrders: Order[] = data.orders ?? [];

      // Use /api/tickets/stats for KPIs — same source as the admin panel dashboard
      let kpiRevenue = "N/A";
      let kpiTickets = "N/A";
      let kpiPending = "N/A";
      let kpiTotal   = "N/A";
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        const s = statsData.summary;
        kpiRevenue = `Rs. ${s.total_revenue_rupees.toLocaleString("en-IN")}`;
        kpiTickets = String(s.total_sold);
        kpiPending = String(s.total_pending);
        kpiTotal   = String(s.total_sold + s.total_pending + s.total_failed);
      }

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const now = new Date().toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true });

      // ── Header band ──────────────────────────────────────────────────────
      doc.setFillColor(10, 10, 10);
      doc.rect(0, 0, pageW, 22, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(160, 239, 70); // lime green accent
      doc.text("BOOMBAP", 10, 10);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      doc.text("Admin · Orders Report", 10, 16);

      doc.setFontSize(7.5);
      doc.setTextColor(130, 130, 130);
      doc.text(`Generated: ${now}`, pageW - 10, 10, { align: "right" });

      const filterLabel =
        statusFilter !== "all" ? `Status: ${statusFilter.toUpperCase()}` : "Status: ALL";
      const searchLabel = debouncedSearch ? `  ·  Search: "${debouncedSearch}"` : "";
      doc.text(`${filterLabel}${searchLabel}  ·  ${allOrders.length} record(s)`, pageW - 10, 16, { align: "right" });

      // ── KPI summary row — sourced from /api/tickets/stats (matches admin panel) ──
      const kpiY = 28;
      const kpiBoxW = 55;
      const kpiBoxH = 16;
      const kpiItems = [
        { label: "Total Paid Revenue", value: kpiRevenue },
        { label: "Tickets Issued",     value: kpiTickets },
        { label: "Pending Orders",     value: kpiPending },
        { label: "Total Attempts",     value: kpiTotal   },
      ];

      kpiItems.forEach((kpi, i) => {
        const x = 10 + i * (kpiBoxW + 4);
        doc.setFillColor(20, 20, 20);
        doc.roundedRect(x, kpiY, kpiBoxW, kpiBoxH, 1.5, 1.5, "F");
        doc.setFontSize(6.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(120, 120, 120);
        doc.text(kpi.label.toUpperCase(), x + 3, kpiY + 5);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(240, 240, 240);
        doc.text(kpi.value, x + 3, kpiY + 13);
      });

      // ── Orders table ──────────────────────────────────────────────────────
      autoTable(doc, {
        startY: kpiY + kpiBoxH + 6,
        margin: { left: 10, right: 10 },
        head: [[
          "#",
          "Order ID",
          "Customer Name",
          "Email",
          "Phone",
          "Tier",
          "Qty",
          "Amount",
          "Status",
          "Date",
        ]],
        body: allOrders.map((o, idx) => [
          idx + 1,
          o.razorpay_order_id,
          o.buyer_name,
          o.buyer_email,
          o.buyer_phone,
          o.ticket_tier_name,
          o.quantity,
          `Rs. ${(o.amount_paise / 100).toLocaleString("en-IN")}`,
          o.status.toUpperCase(),
          formatDate(o.created_at),
        ]),
        styles: {
          fontSize: 7,
          cellPadding: 2.5,
          textColor: [220, 220, 220],
          lineColor: [35, 35, 35],
          lineWidth: 0.3,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [20, 20, 20],
          textColor: [100, 100, 100],
          fontStyle: "bold",
          fontSize: 6.5,
          halign: "left",
        },
        alternateRowStyles: { fillColor: [15, 15, 15] },
        bodyStyles: { fillColor: [10, 10, 10] },
        columnStyles: {
          0:  { cellWidth: 8,  halign: "center" },
          1:  { cellWidth: 38, font: "courier", fontSize: 6 },
          2:  { cellWidth: 30 },
          3:  { cellWidth: 42, font: "courier", fontSize: 6 },
          4:  { cellWidth: 22, font: "courier" },
          5:  { cellWidth: 22 },
          6:  { cellWidth: 10, halign: "center" },
          7:  { cellWidth: 22, halign: "right" },
          8:  { cellWidth: 18, halign: "center" },
          9:  { cellWidth: 30 },
        },
        didParseCell(hookData) {
          if (hookData.section === "body" && hookData.column.index === 8) {
            const val = String(hookData.cell.raw ?? "");
            if (val === "PAID")    hookData.cell.styles.textColor = [160, 239, 70];
            if (val === "PENDING") hookData.cell.styles.textColor = [251, 191, 36];
            if (val === "FAILED")  hookData.cell.styles.textColor = [248, 113, 113];
          }
        },
        // Page footer with page numbers
        didDrawPage(hookData) {
          const footerY = doc.internal.pageSize.getHeight() - 6;
          doc.setFontSize(6.5);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(80, 80, 80);
          doc.text(
            `Page ${hookData.pageNumber}`,
            pageW / 2,
            footerY,
            { align: "center" }
          );
          doc.text("BOOMBAP · Confidential", 10, footerY);
          doc.text(`boombap.in`, pageW - 10, footerY, { align: "right" });
        },
      });

      const dateStamp = new Date().toISOString().slice(0, 10);
      const filterSlug = statusFilter !== "all" ? `_${statusFilter}` : "";
      doc.save(`boombap_orders${filterSlug}_${dateStamp}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };



  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-auto space-y-6">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/6 pb-5">
        <div>
          <h1 className="text-xl font-black uppercase tracking-wide text-white">Orders</h1>
          <p className="text-xs text-white/35 mt-0.5">Track ticket sales, customer logs, and payment states</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Download PDF */}
          <button
            onClick={downloadPDF}
            disabled={downloading}
            className="flex items-center justify-center gap-2 border border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {downloading ? (
              <>
                <svg className="animate-spin" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Exporting…
              </>
            ) : (
              <>
                <Icon d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" size={13} />
                Download PDF
              </>
            )}
          </button>
          {/* Refresh */}
          <button
            onClick={() => {
              fetchOrders();
              fetchKPIs();
            }}
            className="flex items-center justify-center gap-2 border border-white/8 hover:border-white/20 bg-white/2 hover:bg-white/6 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm transition-colors cursor-pointer"
          >
            <Icon d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" size={13} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── KPI Row ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Paid Revenue",
            value: `₹${summary.totalPaid.toLocaleString("en-IN")}`,
            label: "Verified purchases",
            color: "text-primary",
          },
          {
            title: "Tickets Issued",
            value: summary.totalPaidQty,
            label: "Sold ticket count",
            color: "text-white",
          },
          {
            title: "Pending Orders",
            value: summary.totalPendingCount,
            label: "Cart checkouts ongoing",
            color: "text-amber-400",
          },
          {
            title: "Total Attempts",
            value: summary.totalCount,
            label: "All created sessions",
            color: "text-white/70",
          },
        ].map((kpi, i) => (
          <div key={i} className="rounded-sm border border-white/6 bg-[#0d0d0d] p-4 space-y-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/30">{kpi.title}</p>
            <p className={`text-xl md:text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
            <p className="text-[10px] text-white/25 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filters & Search ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d0d0d] p-4 rounded-sm border border-white/6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
            <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" size={14} />
          </span>
          <input
            type="text"
            placeholder="Search by customer name, email, or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-white/8 bg-white/2 placeholder:text-white/20 text-sm text-white outline-none focus:border-primary/50 transition-colors rounded-sm"
          />
        </div>

        {/* Tabs / Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Orders" },
            { id: "paid", label: "Paid" },
            { id: "pending", label: "Pending" },
            { id: "failed", label: "Failed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(0);
              }}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-primary text-black"
                  : "bg-white/2 border border-white/8 text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error banner ─────────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 flex items-center gap-3">
          <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={14} />
          {error}
          <button onClick={fetchOrders} className="ml-auto text-xs underline hover:no-underline">Retry</button>
        </div>
      )}

      {/* ── Table Container ──────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-sm border border-white/6 bg-[#0d0d0d]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-white/8 bg-white/1">
                <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">Order ID</th>
                <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">Customer</th>
                <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">Tier</th>
                <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">Qty</th>
                <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">Amount</th>
                <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">Date</th>
                <th className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.22em] text-white/30 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton Loader
                Array(5)
                  .fill(0)
                  .map((_, idx) => (
                    <tr key={idx} className="border-b border-white/4 last:border-0 animate-pulse">
                      <td className="px-5 py-4"><div className="h-3 w-24 bg-white/10 rounded-sm" /></td>
                      <td className="px-5 py-4">
                        <div className="h-3 w-32 bg-white/10 rounded-sm mb-1" />
                        <div className="h-2 w-40 bg-white/5 rounded-sm" />
                      </td>
                      <td className="px-5 py-4"><div className="h-3 w-20 bg-white/10 rounded-sm" /></td>
                      <td className="px-5 py-4"><div className="h-3 w-8 bg-white/10 rounded-sm" /></td>
                      <td className="px-5 py-4"><div className="h-3 w-16 bg-white/10 rounded-sm" /></td>
                      <td className="px-5 py-4"><div className="h-3 w-28 bg-white/10 rounded-sm" /></td>
                      <td className="px-5 py-4"><div className="mx-auto h-5 w-16 bg-white/10 rounded-sm" /></td>
                    </tr>
                  ))
              ) : orders.length === 0 ? (
                // Empty state
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-white/30">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Icon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" size={24} />
                      <p className="text-xs uppercase tracking-widest font-bold mt-2">No Orders Found</p>
                      <p className="text-[10px] text-white/20">Try widening your filters or modifying search terms</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="border-b border-white/4 last:border-0 hover:bg-white/2 active:bg-white/4 transition-all cursor-pointer"
                  >
                    <td className="px-5 py-3.5 font-mono text-[11px] text-white/50">{order.razorpay_order_id}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-white leading-tight">{order.buyer_name}</div>
                      <div className="text-[10px] text-white/35 mt-0.5">{order.buyer_email}</div>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-xs uppercase tracking-wide text-white/80">
                      {order.ticket_tier_name}
                    </td>
                    <td className="px-5 py-3.5 text-white/60 font-semibold">{order.quantity}</td>
                    <td className="px-5 py-3.5 font-black text-white">{formatPrice(order.amount_paise)}</td>
                    <td className="px-5 py-3.5 text-xs text-white/40">{formatDate(order.created_at)}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          order.status === "paid"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : order.status === "pending"
                            ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ────────────────────────────────────────────────────── */}
      {!loading && orders.length > 0 && (
        <div className="flex items-center justify-between border-t border-white/4 pt-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">
            Page {page + 1}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="flex items-center justify-center p-2 rounded-sm border border-white/8 hover:border-white/20 bg-white/2 hover:bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <Icon d="M15 19l-7-7 7-7" size={14} />
            </button>
            <button
              disabled={orders.length < limit}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center justify-center p-2 rounded-sm border border-white/8 hover:border-white/20 bg-white/2 hover:bg-white/5 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <Icon d="M9 5l7 7-7 7" size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Detail Modal ──────────────────────────────────────────────────── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-sm border border-white/10 bg-[#0d0d0d] shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary">Order Receipt</p>
                <h2 className="text-sm font-mono text-white/70 mt-0.5">{selectedOrder.razorpay_order_id}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-white/30 hover:text-white transition-colors cursor-pointer"
              >
                <Icon d="M6 18L18 6M6 6l12 12" />
              </button>
            </div>

            {/* Details body */}
            <div className="px-6 py-5 space-y-5 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-0.5">Buyer Name</p>
                  <p className="font-semibold text-white">{selectedOrder.buyer_name}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-0.5">Tier Booked</p>
                  <p className="font-bold text-primary uppercase text-xs tracking-wider">{selectedOrder.ticket_tier_name}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-0.5">Type</p>
                  <p className="font-bold text-primary uppercase text-xs tracking-wider">{selectedOrder.ticket_category}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-0.5">Email Address</p>
                  <p className="text-white/80 text-xs font-mono">{selectedOrder.buyer_email}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-0.5">Phone Number</p>
                  <p className="text-white/80 font-mono">{selectedOrder.buyer_phone}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-0.5">Quantity</p>
                  <p className="font-bold text-white">{selectedOrder.quantity} tickets</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-0.5">Total Amount Paid</p>
                  <p className="font-bold text-white">{formatPrice(selectedOrder.amount_paise)}</p>
                </div>
              </div>

              <div className="h-px bg-white/6" />

              <div className="space-y-2">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-0.5">Razorpay Order ID</p>
                  <p className="font-mono text-xs text-white/60">{selectedOrder.razorpay_order_id}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-0.5">Razorpay Payment ID</p>
                  <p className="font-mono text-xs text-white/60">{selectedOrder.razorpay_payment_id ?? "N/A"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-0.5">Purchased On</p>
                  <p className="text-xs text-white/60">{formatDate(selectedOrder.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/1 border-t border-white/8">
              <span
                className={`inline-flex rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  selectedOrder.status === "paid"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : selectedOrder.status === "pending"
                    ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {selectedOrder.status}
              </span>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="bg-white/6 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
