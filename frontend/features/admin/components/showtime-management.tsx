"use client";

import React, { useState, useEffect, type FormEvent } from "react";
import { Plus, Search, Edit2, Trash2, Film, DoorOpen, CalendarDays, X, ChevronLeft, ChevronRight, AlertCircle, ChevronDown } from "lucide-react";
import { adminService } from "../services/admin-service";
import { Showtime, Movie, Room, ShowtimeDTO, Booking } from "@/types";

const cardStyle = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" };
const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" };
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)");
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)");
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: "rgba(201,168,76,0.65)" }}>{children}</label>;
}
const inputCls = "w-full h-10 px-3 text-sm text-white/85 outline-none rounded-xl transition-all placeholder:text-white/20";

type ShowtimeStatus = "now" | "upcoming" | "past";

const statusMeta: Record<ShowtimeStatus, { label: string; className: string; dotClassName: string }> = {
  now: { label: "Đang chiếu", className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300", dotClassName: "bg-emerald-300" },
  upcoming: { label: "Sắp chiếu", className: "border-orange-400/20 bg-orange-400/10 text-orange-300", dotClassName: "bg-orange-300" },
  past: { label: "Đã chiếu", className: "border-red-600/30 bg-red-600/15 text-red-500", dotClassName: "bg-red-500" },
};

const getMovieDuration = (showtime: Showtime, movies: Movie[]) =>
  showtime.movie.duration || movies.find((movie) => movie.id === showtime.movie.id)?.duration || 60;

const getShowtimeEndTime = (showtime: Showtime, movies: Movie[] = []) =>
  new Date(showtime.startTime).getTime() + getMovieDuration(showtime, movies) * 60 * 1000;

const getShowtimeStatus = (showtime: Showtime, now = Date.now(), movies: Movie[] = []): ShowtimeStatus => {
  const startTime = new Date(showtime.startTime).getTime();
  const endTime = getShowtimeEndTime(showtime, movies);

  if (now < startTime) return "upcoming";
  if (now < endTime) return "now";
  return "past";
};

const countShowtimeViewers = (bookings: Booking[], showtimeId: number) =>
  bookings.reduce((total, booking) => {
    if (booking.showtime?.id !== showtimeId) return total;
    const seatCount = booking.seatNumbers
      ? booking.seatNumbers.split(",").map((seat) => seat.trim()).filter(Boolean).length
      : 0;
    return total + Math.max(1, seatCount);
  }, 0);

function CustomSelect({
  name,
  value,
  onChange,
  options,
  placeholder = "Select...",
}: {
  name?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative">
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-3 text-sm text-left flex items-center justify-between outline-none rounded-xl transition-all cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: isOpen ? "1px solid rgba(201,168,76,0.4)" : "1px solid rgba(255,255,255,0.09)",
          color: selectedOption ? "#ffffff" : "rgba(255,255,255,0.25)",
        }}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          size={14}
          className="transition-transform duration-200 flex-shrink-0 ml-2"
          style={{
            color: isOpen ? "#c9a84c" : "rgba(255,255,255,0.3)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div
            className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-[#c9a84c]/15 bg-[#0d0d0d] p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl max-h-60 overflow-y-auto z-50"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(201,168,76,0.2) transparent" }}
          >
            <div className="space-y-1">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl p-2 transition-colors text-left group cursor-pointer ${
                      isSelected ? "bg-white/8" : "hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold truncate transition-colors ${
                        isSelected ? "text-[#c9a84c]" : "text-white/85 group-hover:text-[#c9a84c]"
                      }`}
                    >
                      {option.label}
                    </span>
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ShowtimeManagement() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Partial<Showtime> | null>(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const itemsPerPage = 10;

  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");

  useEffect(() => {
    setSelectedMovieId(editingShowtime?.movie?.id?.toString() || "");
    setSelectedRoomId(editingShowtime?.room?.id?.toString() || "");
  }, [editingShowtime]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [st, mv, rm, bk] = await Promise.all([adminService.getShowtimes(), adminService.getMovies(), adminService.getRooms(), adminService.getBookings()]);
      setShowtimes(st); setMovies(mv); setRooms(rm); setBookings(bk);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id: number) => {
    try { await adminService.deleteShowtime(id); fetchData(); setDeleteConfirmId(null); }
    catch { alert("Error deleting showtime."); }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMovieId || !selectedRoomId) {
      setError("Vui lòng chọn đầy đủ phim và phòng chiếu!");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const dto: ShowtimeDTO = {
      movieId: parseInt(selectedMovieId),
      roomId: parseInt(selectedRoomId),
      startTime: fd.get("startTime") as string,
      price: parseFloat(fd.get("price") as string),
    };
    setIsSaving(true); setError("");
    try {
      if (editingShowtime?.id) await adminService.updateShowtime(editingShowtime.id, dto);
      else await adminService.createShowtime(dto);
      closeDialog(); fetchData();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error saving showtime.");
    } finally { setIsSaving(false); }
  };

  const closeDialog = () => { setIsDialogOpen(false); setEditingShowtime(null); setError(""); setSelectedMovieId(""); setSelectedRoomId(""); };

  const filtered = showtimes.filter(s =>
    s.movie.title.toLowerCase().includes(search.toLowerCase()) ||
    s.room.name.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    const now = Date.now();
    const statusPriority: Record<ShowtimeStatus, number> = { now: 0, upcoming: 1, past: 2 };
    const statusA = getShowtimeStatus(a, now, movies);
    const statusB = getShowtimeStatus(b, now, movies);

    if (statusA !== statusB) return statusPriority[statusA] - statusPriority[statusB];

    const startA = new Date(a.startTime).getTime();
    const startB = new Date(b.startTime).getTime();
    const endA = getShowtimeEndTime(a, movies);
    const endB = getShowtimeEndTime(b, movies);
    const viewersA = countShowtimeViewers(bookings, a.id);
    const viewersB = countShowtimeViewers(bookings, b.id);
    const viewerDiff = viewersB - viewersA;

    if (statusA === "now") {
      if (endA !== endB) return endA - endB;
      if (startA === startB || endA === endB) return viewerDiff;
      return startA - startB;
    }

    if (statusA === "upcoming") {
      if (startA !== startB) return startA - startB;
      if (endA !== endB) return endA - endB;
      return viewerDiff;
    }

    if (endA !== endB) return endB - endA;
    if (startA === startB || endA === endB) return viewerDiff;
    return startB - startA;
  });
  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Showtimes</h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Schedule movies and set ticket prices</p>
        </div>
        <button onClick={() => { setEditingShowtime(null); setIsDialogOpen(true); }} className="flex items-center gap-2 px-4 h-9 rounded-xl text-xs font-bold text-black transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #c9a84c, #e8c76a)" }}>
          <Plus size={15} />Create Showtime
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.25)" }} />
            <input type="text" placeholder="Search movie or room..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className={`${inputCls} pl-8`} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{filtered.length} showtimes</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] table-fixed text-sm">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[23%]" />
              <col className="w-[21%]" />
              <col className="w-[12%]" />
              <col className="w-[13%]" />
              <col className="w-[9%]" />
            </colgroup>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Movie", "Room", "Start Time", "Price", "Status", "Actions"].map(h => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.18em]"
                    style={{ color: "rgba(255,255,255,0.68)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? <tr><td colSpan={6} className="py-12 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Loading...</td></tr>
                : paginated.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>No showtimes found</td></tr>
                : paginated.map(st => (
                  <tr key={st.id} className="transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td className="px-4 py-3 text-left">
                      <div className="flex max-w-[210px] items-start justify-start gap-2">
                        <Film size={13} className="mt-1 shrink-0" style={{ color: "#c9a84c" }} />
                        <span className="whitespace-normal break-words text-sm font-bold leading-relaxed text-white">{st.movie.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-left text-sm font-semibold" style={{ color: "rgba(255,255,255,0.82)" }}>
                      <div className="flex max-w-[220px] items-start justify-start gap-1.5">
                        <DoorOpen size={11} className="mt-1 shrink-0" style={{ color: "rgba(255,255,255,0.48)" }} />
                        <span className="whitespace-normal break-words leading-relaxed">{st.room.cinema?.name ? `${st.room.cinema.name} · ${st.room.name}` : st.room.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-left text-sm font-semibold" style={{ color: "rgba(255,255,255,0.82)" }}>
                      <div className="flex max-w-[190px] items-start justify-start gap-1.5">
                        <CalendarDays size={11} className="mt-1 shrink-0" style={{ color: "rgba(255,255,255,0.48)" }} />
                        <span className="whitespace-normal break-words leading-relaxed">{new Date(st.startTime).toLocaleString("en-US")}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-left text-sm font-bold" style={{ color: "#c9a84c" }}>{st.price.toLocaleString()} đ</td>
                    <td className="px-4 py-3 text-left">
                      {(() => {
                        const meta = statusMeta[getShowtimeStatus(st, Date.now(), movies)];
                        return (
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${meta.className}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClassName}`} />
                            {meta.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3 text-left">
                      <div className="flex items-center justify-start gap-1">
                        <button onClick={() => { setEditingShowtime(st); setIsDialogOpen(true); }} className="p-1.5 rounded-lg transition-colors" style={{ color: "rgba(96,165,250,0.7)" }} onMouseEnter={e => { e.currentTarget.style.color = "#60a5fa"; e.currentTarget.style.background = "rgba(96,165,250,0.08)"; }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(96,165,250,0.7)"; e.currentTarget.style.background = "transparent"; }}><Edit2 size={14} /></button>
                        <div className="relative">
                          <button onClick={() => setDeleteConfirmId(deleteConfirmId === st.id ? null : st.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: deleteConfirmId === st.id ? "#ef4444" : "rgba(239,68,68,0.6)", background: deleteConfirmId === st.id ? "rgba(239,68,68,0.12)" : "transparent" }} onMouseEnter={e => { if (deleteConfirmId !== st.id) { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; } }} onMouseLeave={e => { if (deleteConfirmId !== st.id) { e.currentTarget.style.color = "rgba(239,68,68,0.6)"; e.currentTarget.style.background = "transparent"; } }}><Trash2 size={14} /></button>
                          
                          {deleteConfirmId === st.id && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 p-2 rounded-xl border flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200" style={{ background: "#1a1a1a", borderColor: "rgba(239,68,68,0.3)", backdropFilter: "blur(20px)", minWidth: "140px" }}>
                              <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider ml-1">Delete?</span>
                              <div className="flex gap-1 ml-auto">
                                <button onClick={() => handleDelete(st.id)} className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all bg-[#ef4444] text-white hover:bg-[#dc2626]">Yes</button>
                                <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60">No</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30" style={{ color: "rgba(255,255,255,0.5)" }}><ChevronLeft size={14} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className="w-7 h-7 rounded-lg text-xs font-semibold" style={{ background: currentPage === page ? "#c9a84c" : "transparent", color: currentPage === page ? "#000" : "rgba(255,255,255,0.45)" }}>{page}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30" style={{ color: "rgba(255,255,255,0.5)" }}><ChevronRight size={14} /></button>
          </div>
        </div>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }} onClick={e => { if (e.target === e.currentTarget) closeDialog(); }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.09)" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <h2 className="text-sm font-bold text-white">{editingShowtime ? "Edit Showtime" : "Create Showtime"}</h2>
              <button onClick={closeDialog} className="p-1.5 rounded-lg" style={{ color: "rgba(255,255,255,0.4)" }} onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <Label>Select Movie</Label>
                <CustomSelect
                  name="movieId"
                  value={selectedMovieId}
                  onChange={setSelectedMovieId}
                  options={movies.map((m) => ({ value: m.id.toString(), label: m.title }))}
                  placeholder="Choose a movie..."
                />
              </div>
              <div>
                <Label>Select Room</Label>
                <CustomSelect
                  name="roomId"
                  value={selectedRoomId}
                  onChange={setSelectedRoomId}
                  options={rooms.map((r) => ({
                    value: r.id.toString(),
                    label: r.cinema?.name ? `${r.cinema.name} - ${r.name}` : r.name,
                  }))}
                  placeholder="Choose a room..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <input name="startTime" type="datetime-local" required defaultValue={editingShowtime?.startTime?.substring(0, 16)} className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label>Price (VND)</Label>
                  <input name="price" type="number" required defaultValue={editingShowtime?.price} placeholder="75000" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-3 text-xs text-red-400/80">
                  <AlertCircle size={13} className="flex-shrink-0" />{error}
                </div>
              )}
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={closeDialog} className="px-4 h-9 rounded-xl text-xs font-medium" style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.09)" }}>Cancel</button>
                <button type="submit" disabled={isSaving} className="px-5 h-9 rounded-xl text-xs font-bold text-black hover:opacity-90 disabled:opacity-40" style={{ background: "linear-gradient(135deg, #c9a84c, #e8c76a)" }}>{isSaving ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
