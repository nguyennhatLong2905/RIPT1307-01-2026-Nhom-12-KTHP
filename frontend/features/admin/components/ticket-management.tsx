"use client";

import React, { useState, useEffect } from "react";
import { Search, Ticket, Calendar, MapPin, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { adminService } from "../services/admin-service";
import { Booking } from "@/types";

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
};
const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
};
const onFocus = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)");
const onBlur = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)");

export default function TicketManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const itemsPerPage = 10;

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      setBookings(await adminService.getBookings());
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try { await adminService.deleteBooking(id); fetchBookings(); setDeleteConfirmId(null); }
    catch { alert("Failed to delete booking."); }
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      b.showtime.movie.title.toLowerCase().includes(search.toLowerCase()) ||
      b.seatNumbers.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Tickets</h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
          Track all ticket transactions and revenue
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        {/* Search */}
        <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.25)" }} />
            <input
              type="text"
              placeholder="Search by customer, movie, seat..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 pl-8 pr-4 text-sm text-white/85 outline-none rounded-xl transition-all placeholder:text-white/20"
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            {filteredBookings.length} bookings
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Customer", "Movie / Venue", "Seats", "Date", "Amount", "Actions"].map((h) => (
                  <th
                    key={h}
                    className={`py-3 text-xs font-bold uppercase tracking-[0.15em] ${
                      h === "Actions" ? "px-8 text-center" : 
                      h === "Customer" || h === "Movie / Venue" ? "pl-24 pr-8 text-left" : "px-8 text-left"
                    }`}
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Loading...</td>
                </tr>
              ) : paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>No bookings found</td>
                </tr>
              ) : paginatedBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                   <td className="px-8 py-3 text-left">
                    <div className="flex items-center justify-start gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}
                      >
                        {booking.user.fullName?.charAt(0) || "U"}
                      </div>
                      <div className="text-left">
                        <div className="text-white/85 font-medium text-sm">{booking.user.fullName}</div>
                        <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>@{booking.user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-3 text-left">
                    <div className="font-medium text-white/80 text-sm">{booking.showtime.movie.title}</div>
                    <div className="flex items-center justify-start gap-1 text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                      <MapPin size={9} />
                      {booking.showtime.room.cinema?.name
                        ? `${booking.showtime.room.cinema.name} · ${booking.showtime.room.name}`
                        : booking.showtime.room.name}
                    </div>
                  </td>
                  <td className="px-8 py-3 text-left">
                    <div className="flex items-center justify-start gap-1.5 text-sm" style={{ color: "#c9a84c" }}>
                      <Ticket size={11} />
                      <span className="font-mono">{booking.seatNumbers}</span>
                    </div>
                  </td>
                  <td className="px-8 py-3 text-left">
                    <div className="flex items-center justify-start gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                      <Calendar size={11} style={{ color: "rgba(255,255,255,0.2)" }} />
                      {new Date(booking.bookingDate).toLocaleDateString("en-US")}
                    </div>
                  </td>
                  <td className="px-8 py-3 text-left">
                    <span className="text-sm font-bold" style={{ color: "#c9a84c" }}>
                      {booking.totalAmount.toLocaleString()} đ
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="relative inline-block">
                      <button
                        onClick={() => setDeleteConfirmId(deleteConfirmId === booking.id ? null : booking.id)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: deleteConfirmId === booking.id ? "#ef4444" : "rgba(239,68,68,0.6)", background: deleteConfirmId === booking.id ? "rgba(239,68,68,0.12)" : "transparent" }}
                        onMouseEnter={e => { if (deleteConfirmId !== booking.id) { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; } }}
                        onMouseLeave={e => { if (deleteConfirmId !== booking.id) { e.currentTarget.style.color = "rgba(239,68,68,0.6)"; e.currentTarget.style.background = "transparent"; } }}
                      >
                        <Trash2 size={14} />
                      </button>

                      {deleteConfirmId === booking.id && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 p-2 rounded-xl border flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200" style={{ background: "#1a1a1a", borderColor: "rgba(239,68,68,0.3)", backdropFilter: "blur(20px)", minWidth: "140px" }}>
                          <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider ml-1">Delete?</span>
                          <div className="flex gap-1 ml-auto">
                            <button onClick={() => handleCancel(booking.id)} className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all bg-[#ef4444] text-white hover:bg-[#dc2626]">Yes</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60">No</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="w-7 h-7 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: currentPage === page ? "#c9a84c" : "transparent",
                  color: currentPage === page ? "#000" : "rgba(255,255,255,0.45)",
                }}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
