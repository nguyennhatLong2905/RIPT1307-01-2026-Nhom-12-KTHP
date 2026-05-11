"use client";

import { useState, useMemo } from "react";
import { Search, Eye, RotateCcw, Ticket } from "lucide-react";
import { bookingsData, statusConfig, Booking, BookingStatus } from "./booking-data";
import BookingDetailPanel from "./booking-detail-panel";

const STATUS_OPTIONS: { value: "" | BookingStatus; label: string }[] = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "Đã thanh toán", label: "Đã thanh toán" },
  { value: "Chờ thanh toán", label: "Chờ thanh toán" },
  { value: "Đã hủy", label: "Đã hủy" },
];

const inputCls =
  "w-full rounded-xl border border-[#1F2532] bg-[#0D1117] px-3 py-2 text-sm text-white outline-none transition-all focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 placeholder:text-[#8B949E]";

function ActionBtn({
  icon: Icon, tip, color, onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tip: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      title={tip}
      onClick={onClick}
      className="rounded-lg p-2 transition-all duration-200"
      style={{ color: "#8B949E" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = color;
        e.currentTarget.style.background = color + "18";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#8B949E";
        e.currentTarget.style.background = "transparent";
      }}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>(bookingsData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | BookingStatus>("");
  const [selected, setSelected] = useState<Booking | null>(null);

  const counts = useMemo(() => {
    const paid = bookings.filter((b) => b.status === "Đã thanh toán").length;
    const pending = bookings.filter((b) => b.status === "Chờ thanh toán").length;
    const cancelled = bookings.filter((b) => b.status === "Đã hủy").length;
    return { all: bookings.length, paid, pending, cancelled };
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchStatus = statusFilter === "" || b.status === statusFilter;
      const matchSearch =
        !q ||
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.includes(q);
      return matchStatus && matchSearch;
    });
  }, [bookings, search, statusFilter]);

  function handleReset() {
    setSearch("");
    setStatusFilter("");
  }

  function handleStatusChange(id: string, status: BookingStatus) {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
  }

  const COLS = ["Mã Vé", "Khách Hàng", "Phim", "Suất chiếu", "Ghế", "Tổng tiền", "Trạng thái", "Hành động"];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Quản lý Đặt Vé</h1>
            <p className="mt-1 text-sm" style={{ color: "#8B949E" }}>
              Tra cứu, xử lý và chăm sóc khách hàng cho tất cả đơn đặt vé.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Tổng đơn", value: counts.all, color: "#A78BFA", glow: "rgba(167,139,250,0.2)" },
            { label: "Đã thanh toán", value: counts.paid, color: "#10B981", glow: "rgba(16,185,129,0.2)" },
            { label: "Chờ thanh toán", value: counts.pending, color: "#FBBF24", glow: "rgba(251,191,36,0.2)" },
            { label: "Đã hủy", value: counts.cancelled, color: "#EF4444", glow: "rgba(239,68,68,0.2)" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
              <p className="text-2xl font-bold" style={{ color: s.color, textShadow: `0 0 20px ${s.glow}` }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: "#8B949E" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="rounded-2xl p-4" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-4 w-4" style={{ color: "#8B949E" }} />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo Mã vé, SĐT hoặc Tên khách hàng..."
                className={inputCls + " pl-11"}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "" | BookingStatus)}
              className="rounded-xl border border-[#1F2532] bg-[#0D1117] px-3 py-2 text-sm text-white outline-none transition-all focus:border-violet-500/60 cursor-pointer lg:w-52"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-200"
                style={{ background: "linear-gradient(90deg,#7C3AED,#2DD4BF)", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 30px rgba(124,58,237,0.5)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.3)"; }}
              >
                <Search className="h-4 w-4" /> Tìm kiếm
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200"
                style={{ background: "transparent", border: "1px solid #1F2532", color: "#8B949E" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#8B949E"; e.currentTarget.style.color = "#FFFFFF"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1F2532"; e.currentTarget.style.color = "#8B949E"; }}
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #1F2532" }}>
                  {COLS.map((h) => (
                    <th key={h} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider whitespace-nowrap" style={{ color: "#8B949E" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={COLS.length} className="px-5 py-16 text-center text-sm" style={{ color: "#8B949E" }}>
                      <div className="flex flex-col items-center gap-3">
                        <Ticket className="h-10 w-10 opacity-20" />
                        <span>Không tìm thấy đơn đặt vé nào.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => {
                    const st = statusConfig[b.status];
                    return (
                      <tr
                        key={b.id}
                        className="cursor-pointer transition-colors duration-150"
                        style={{ borderBottom: "1px solid #1F2532" }}
                        onClick={() => setSelected(b)}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.05)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <td className="px-5 py-3 whitespace-nowrap font-mono text-xs font-semibold" style={{ color: "#A78BFA" }}>{b.id}</td>
                        <td className="px-5 py-3">
                          <p className="font-medium text-white">{b.customerName}</p>
                          <p className="text-xs mt-0.5" style={{ color: "#8B949E" }}>{b.customerPhone}</p>
                        </td>
                        <td className="px-5 py-3 max-w-[160px]">
                          <p className="truncate font-medium" style={{ color: "#C9D1D9" }}>{b.movieTitle}</p>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-xs" style={{ color: "#C9D1D9" }}>
                          {b.showDate}<br />
                          <span style={{ color: "#8B949E" }}>{b.showtime}</span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-1">
                            {b.seats.map((s) => (
                              <span key={s} className="rounded-md px-1.5 py-0.5 text-xs font-semibold" style={{ background: "rgba(124,58,237,0.15)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.3)" }}>{s}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap font-semibold" style={{ color: "#2DD4BF" }}>
                          {b.totalAmount.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap" style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}40` }}>
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.color, boxShadow: `0 0 6px ${st.glow}` }} />
                            {b.status}
                          </span>
                        </td>
                        <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                          <ActionBtn icon={Eye} tip="Xem chi tiết" color="#2DD4BF" onClick={() => setSelected(b)} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid #1F2532" }}>
              <p className="text-xs" style={{ color: "#8B949E" }}>
                Hiển thị <span className="text-white font-semibold">{filtered.length}</span> / {bookings.length} đơn hàng
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selected && (
        <BookingDetailPanel
          booking={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}
