"use client";

import { useState } from "react";
import { X, User, Phone, Mail, Film, MapPin, CreditCard, Calendar, Ticket, RefreshCw, RotateCcw, AlertTriangle, Check } from "lucide-react";
import { Booking, statusConfig, SHOWTIMES_OPTIONS } from "./booking-data";

interface Props {
  booking: Booking;
  onClose: () => void;
  onStatusChange: (id: string, status: Booking["status"]) => void;
}

const inputCls = "w-full rounded-xl border border-[#1F2532] bg-[#0D1117] px-3 py-2 text-sm text-white outline-none transition-all focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15";
const selectCls = inputCls + " cursor-pointer";

function InfoRow({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)" }}>
        <Icon className="h-3.5 w-3.5" style={{ color: "#A78BFA" }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider" style={{ color: "#8B949E" }}>{label}</p>
        <p className="text-sm font-medium truncate" style={{ color: accent ?? "#C9D1D9" }}>{value}</p>
      </div>
    </div>
  );
}

export default function BookingDetailPanel({ booking, onClose, onStatusChange }: Props) {
  const stCfg = statusConfig[booking.status];
  const [showReschedule, setShowReschedule] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(SHOWTIMES_OPTIONS[0]);
  const [refundMethod, setRefundMethod] = useState<"wallet" | "gateway">("wallet");
  const [rescheduled, setRescheduled] = useState(false);
  const [refunded, setRefunded] = useState(false);

  function handleReschedule() {
    setRescheduled(true);
    setTimeout(() => { setShowReschedule(false); setRescheduled(false); }, 1200);
  }

  function handleRefund() {
    onStatusChange(booking.id, "Đã hủy");
    setRefunded(true);
    setTimeout(() => { setShowRefund(false); setRefunded(false); onClose(); }, 1200);
  }

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-xl overflow-y-auto" style={{ background: "#0D1117", borderLeft: "1px solid #1F2532", boxShadow: "-8px 0 40px rgba(0,0,0,0.6)", animation: "slideInRight 0.3s ease-out" }}>
        <style>{`@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4" style={{ background: "rgba(13,17,23,0.95)", borderBottom: "1px solid #1F2532", backdropFilter: "blur(8px)" }}>
          <div>
            <h2 className="text-base font-bold text-white">Chi tiết Đặt Vé</h2>
            <p className="text-xs mt-0.5" style={{ color: "#8B949E" }}>{booking.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: stCfg.bg, color: stCfg.color, border: `1px solid ${stCfg.color}40` }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: stCfg.color, boxShadow: `0 0 6px ${stCfg.glow}` }} />
              {booking.status}
            </span>
            <button onClick={onClose} className="rounded-lg p-2 transition-colors duration-200" style={{ color: "#8B949E" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,58,237,0.15)"; e.currentTarget.style.color = "#fff"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8B949E"; }}>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-6">
          {/* Movie Info */}
          <div className="rounded-2xl p-4" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#8B949E" }}>Thông tin Phim</p>
            <div className="flex gap-4">
              <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-xl" style={{ border: "1px solid #1F2532" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={booking.moviePoster} alt={booking.movieTitle} className="h-full w-full object-cover" onError={e => { e.currentTarget.style.display = "none"; }} />
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(124,58,237,0.2)" }}>
                  <Film className="h-6 w-6" style={{ color: "#A78BFA" }} />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <p className="font-bold text-white">{booking.movieTitle}</p>
                <InfoRow icon={Calendar} label="Ngày chiếu" value={`${booking.showDate} - ${booking.showtime}`} />
                <InfoRow icon={MapPin} label="Phòng" value={booking.room} />
                <InfoRow icon={Ticket} label="Ghế" value={booking.seats.join(", ")} accent="#A78BFA" />
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-2xl p-4" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#8B949E" }}>Thông tin Khách hàng</p>
            <div className="space-y-3">
              <InfoRow icon={User} label="Họ tên" value={booking.customerName} accent="#FFFFFF" />
              <InfoRow icon={Phone} label="Số điện thoại" value={booking.customerPhone} />
              <InfoRow icon={Mail} label="Email" value={booking.customerEmail} />
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-2xl p-4" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#8B949E" }}>Thanh toán</p>
            <div className="space-y-3">
              <InfoRow icon={CreditCard} label="Phương thức" value={booking.paymentMethod} />
              <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "#0D1117", border: "1px solid #1F2532" }}>
                <span className="text-sm" style={{ color: "#8B949E" }}>Tổng tiền</span>
                <span className="text-lg font-bold" style={{ color: "#2DD4BF" }}>{booking.totalAmount.toLocaleString("vi-VN")}đ</span>
              </div>
              <p className="text-xs" style={{ color: "#8B949E" }}>Đặt lúc: <span style={{ color: "#C9D1D9" }}>{booking.bookedAt}</span></p>
              {booking.notes && (
                <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.25)", color: "#FBBF24" }}>
                  📝 {booking.notes}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {booking.status !== "Đã hủy" && (
            <div className="rounded-2xl p-4 space-y-3" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#8B949E" }}>Chăm sóc khách hàng</p>
              <button onClick={() => setShowReschedule(true)} className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200" style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.3)" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.22)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(59,130,246,0.12)"; }}>
                <RefreshCw className="h-4 w-4" /> Đổi vé / Suất chiếu
              </button>
              <button onClick={() => setShowRefund(true)} className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-200" style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.3)" }} onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.2)"; }} onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}>
                <RotateCcw className="h-4 w-4" /> Hoàn tiền
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {showReschedule && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setShowReschedule(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-2xl" style={{ background: "#0D1117", border: "1px solid #1F2532", animation: "scaleIn .18s ease-out" }} onClick={e => e.stopPropagation()}>
            <style>{`@keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>
            <div className="flex items-center justify-between border-b border-[#1F2532] px-6 py-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">Đổi Suất Chiếu</h3>
              <button onClick={() => setShowReschedule(false)} className="rounded-lg p-1.5 text-[#8B949E] hover:text-white transition-all"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="rounded-xl p-3 text-xs space-y-1" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
                <p className="text-[#8B949E] uppercase tracking-wider font-semibold mb-1">Hiện tại</p>
                <p className="text-white font-semibold">{booking.movieTitle}</p>
                <p style={{ color: "#8B949E" }}>{booking.room} · {booking.showDate} {booking.showtime}</p>
                <p style={{ color: "#A78BFA" }}>Ghế: {booking.seats.join(", ")}</p>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#8B949E" }}>Chọn suất chiếu mới</label>
                <select className={selectCls} value={`${selectedShowtime.date}|${selectedShowtime.time}|${selectedShowtime.room}`} onChange={e => { const [d, t, r] = e.target.value.split("|"); setSelectedShowtime({ date: d, time: t, room: r }); }}>
                  {SHOWTIMES_OPTIONS.map((s, i) => <option key={i} value={`${s.date}|${s.time}|${s.room}`}>{s.date} · {s.time} · {s.room}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowReschedule(false)} className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-[#1F2532] text-[#8B949E] hover:text-white transition-all">Hủy</button>
                <button onClick={handleReschedule} className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-all" style={{ background: "linear-gradient(90deg,#2563EB,#3B82F6)", boxShadow: "0 4px 14px rgba(59,130,246,.3)" }}>
                  {rescheduled ? <><Check className="h-4 w-4" /> Đã đổi!</> : "Xác nhận đổi vé"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund AlertDialog */}
      {showRefund && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setShowRefund(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-2xl" style={{ background: "#0D1117", border: "1px solid rgba(239,68,68,0.4)", animation: "scaleIn .18s ease-out" }} onClick={e => e.stopPropagation()}>
            <div className="p-6 space-y-5">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}>
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-base">Xác nhận Hoàn tiền</p>
                  <p className="text-sm mt-1" style={{ color: "#8B949E" }}>Mã vé: <span className="text-white">{booking.id}</span></p>
                  <p className="text-lg font-bold mt-1" style={{ color: "#F87171" }}>{booking.totalAmount.toLocaleString("vi-VN")}đ</p>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#8B949E" }}>Hoàn tiền vào</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["wallet", "gateway"] as const).map(m => (
                    <button key={m} onClick={() => setRefundMethod(m)} className="rounded-xl py-2.5 text-sm font-semibold border transition-all" style={{ background: refundMethod === m ? "rgba(239,68,68,0.15)" : "transparent", borderColor: refundMethod === m ? "rgba(239,68,68,0.5)" : "#1F2532", color: refundMethod === m ? "#F87171" : "#8B949E" }}>
                      {m === "wallet" ? "💳 Ví điện tử" : "🏦 Cổng thanh toán"}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-center" style={{ color: "#8B949E" }}>Hành động này không thể hoàn tác. Đơn hàng sẽ chuyển sang trạng thái <span className="text-red-400 font-semibold">Đã hủy</span>.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowRefund(false)} className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-[#1F2532] text-[#8B949E] hover:text-white transition-all">Không, giữ lại</button>
                <button onClick={handleRefund} className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all" style={{ boxShadow: "0 4px 14px rgba(239,68,68,.35)" }}>
                  {refunded ? <><Check className="h-4 w-4" /> Đã hoàn!</> : "Xác nhận hoàn tiền"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
