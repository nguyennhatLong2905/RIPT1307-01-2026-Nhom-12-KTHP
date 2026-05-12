"use client";
import { useState, useCallback } from "react";
import { Bell, Search, User, ChevronDown, Plus, CalendarClock, AlertTriangle, Film, Move, X, Edit2, Trash2 } from "lucide-react";
import { CINEMAS, ROOMS, MOCK_SHOWTIMES, GRID_START_HOUR, GRID_END_HOUR, GRID_START_MINS, minsToHHMM, pct, widthPct, Showtime } from "./showtime-types";
import { ShowtimeFormModal, RescheduleModal, DeleteConfirmModal, AutoScheduleModal } from "./showtime-modals";

const MOVIES_META: Record<string, { color: string; colorHex: string }> = {
  "Avengers: Endgame": { color: "red",    colorHex: "#EF4444" },
  "Dune: Part Two":    { color: "blue",   colorHex: "#3B82F6" },
  "Lật Mặt 7":         { color: "purple", colorHex: "#A855F7" },
  "Mai":               { color: "orange", colorHex: "#F97316" },
};

const C: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  red:    { bg: "rgba(239,68,68,.18)",  border: "#EF4444", glow: "rgba(239,68,68,.35)",  text: "#FCA5A5" },
  blue:   { bg: "rgba(59,130,246,.18)", border: "#3B82F6", glow: "rgba(59,130,246,.35)", text: "#93C5FD" },
  purple: { bg: "rgba(168,85,247,.18)", border: "#A855F7", glow: "rgba(168,85,247,.35)", text: "#D8B4FE" },
  orange: { bg: "rgba(249,115,22,.18)", border: "#F97316", glow: "rgba(249,115,22,.35)", text: "#FDBA74" },
};

const HOURS: number[] = [];
for (let h = GRID_START_HOUR; h <= GRID_END_HOUR; h++) HOURS.push(h);

let _idCounter = 100;
function genId() { return `s${++_idCounter}`; }

function detectConflicts(list: Showtime[]): Showtime[] {
  return list.map(st => {
    const stEnd = st.startMinutes + st.durationMinutes + st.cleaningMinutes;
    const hasOverlap = list.some(other =>
      other.id !== st.id &&
      other.room === st.room &&
      other.status !== "dragging" &&
      st.startMinutes < other.startMinutes + other.durationMinutes + other.cleaningMinutes &&
      stEnd > other.startMinutes
    );
    if (st.status === "dragging") return st;
    return { ...st, status: hasOverlap ? "conflict" : "normal" };
  });
}

// ── Block ──────────────────────────────────────────────────────────────────
function Block({ st, selected, onClick }: { st: Showtime; selected: boolean; onClick: () => void }) {
  const c = C[st.color] ?? C.blue;
  const left   = pct(st.startMinutes);
  const totalW = widthPct(st.durationMinutes + st.cleaningMinutes);
  const mainW  = widthPct(st.durationMinutes);
  const cleanW = widthPct(st.cleaningMinutes);
  const endM   = st.startMinutes + st.durationMinutes;
  const isDrag = st.status === "dragging";
  const isCon  = st.status === "conflict";
  return (
    <div className="absolute top-1 bottom-1 flex cursor-pointer" style={{ left: `${left}%`, width: `${totalW}%` }} onClick={onClick}>
      <div className="relative flex flex-col justify-center overflow-hidden rounded-l-lg px-2 py-1 transition-all duration-200"
        style={{
          width: `${(mainW / totalW) * 100}%`,
          background: isDrag ? "rgba(59,130,246,.10)" : c.bg,
          borderTop:    `1px solid ${isCon ? "#EF4444" : c.border}`,
          borderBottom: `1px solid ${isCon ? "#EF4444" : c.border}`,
          borderLeft:   `1px solid ${isCon ? "#EF4444" : c.border}`,
          borderRight:  "none",
          opacity: isDrag ? 0.6 : 1,
          boxShadow: selected ? `0 0 0 2px ${c.border},0 4px 20px ${c.glow}` : isCon ? "0 0 0 2px #EF4444" : "none",
          outline: isDrag ? "2px dashed #3B82F6" : "none",
        }}>
        {isDrag && <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 z-10"><Move size={14} className="text-blue-400" /><span className="text-[10px] text-blue-300 font-semibold">Dời lịch →</span></div>}
        {isCon && <div className="absolute top-1 right-1"><AlertTriangle size={11} className="text-red-400" /></div>}
        <p className="truncate text-[11px] font-bold" style={{ color: isDrag ? "#93C5FD" : c.text }}>{st.movieTitle}</p>
        <p className="truncate text-[10px] opacity-80" style={{ color: c.text }}>{minsToHHMM(st.startMinutes)} – {minsToHHMM(endM)}</p>
        <p className="truncate text-[9px] opacity-60" style={{ color: c.text }}>{st.durationMinutes}m · {st.language}</p>
      </div>
      <div className="flex items-center justify-center overflow-hidden rounded-r-lg"
        style={{ width: `${(cleanW / totalW) * 100}%`, background: "rgba(139,148,158,.12)", border: "1px solid rgba(139,148,158,.3)", borderLeft: "1px dashed rgba(139,148,158,.4)" }}>
        <span className="text-[8px] text-[#8B949E] truncate px-1">🧹 {st.cleaningMinutes}m</span>
      </div>
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ st, onClose, onEdit, onReschedule, onDelete }: {
  st: Showtime; onClose: () => void;
  onEdit: () => void; onReschedule: () => void; onDelete: () => void;
}) {
  const c    = C[st.color] ?? C.blue;
  const endM = st.startMinutes + st.durationMinutes;
  const isCon = st.status === "conflict";
  return (
    <div className="flex h-full flex-col" style={{ background: "#0D1117", borderLeft: "1px solid #1F2532" }}>
      <div className="flex items-center justify-between border-b border-[#1F2532] px-4 py-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#8B949E]">Chi Tiết Suất Chiếu</h3>
        <button onClick={onClose} className="rounded-lg p-1 text-[#8B949E] hover:text-white hover:bg-white/5 transition-all"><X size={14} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex gap-3 items-start">
          <div className="h-16 w-11 shrink-0 rounded-lg border border-[#1F2532] flex items-center justify-center" style={{ background: c.bg }}>
            <Film size={20} style={{ color: c.border }} />
          </div>
          <div>
            <p className="text-xs text-[#8B949E] uppercase tracking-wider">Phim</p>
            <p className="mt-0.5 font-bold text-white text-sm">{st.movieTitle}</p>
            <span className="mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}40` }}>{st.format} · {st.language}</span>
          </div>
        </div>
        {[["Phòng", st.room], ["Thời gian", `${minsToHHMM(st.startMinutes)} – ${minsToHHMM(endM)}`], ["Thời lượng", `${st.durationMinutes}m + ${st.cleaningMinutes}m dọn phòng`]].map(([l, v]) => (
          <div key={l} className="flex items-center justify-between border-b border-[#1F2532] pb-2">
            <span className="text-xs text-[#8B949E]">{l}</span>
            <span className="text-xs font-semibold text-white">{v}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-b border-[#1F2532] pb-2">
          <span className="text-xs text-[#8B949E]">Trạng thái</span>
          {isCon
            ? <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/30"><AlertTriangle size={9} /> Xung đột</span>
            : <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/15 px-2 py-0.5 text-[10px] font-semibold text-teal-400 border border-teal-500/30">✓ Bình thường</span>}
        </div>
        <div className="space-y-2 pt-1">
          <button onClick={onReschedule} className="w-full rounded-xl py-2 text-sm font-semibold text-white transition-all" style={{ background: "linear-gradient(90deg,#2563EB,#3B82F6)", boxShadow: "0 4px 14px rgba(59,130,246,.35)" }}>
            <Move size={13} className="inline mr-2" />Dời lịch
          </button>
          <button onClick={onDelete} className="w-full rounded-xl py-2 text-sm font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all">
            <Trash2 size={13} className="inline mr-2" />Hủy suất
          </button>
          <button onClick={onEdit} className="w-full rounded-xl py-2 text-sm font-semibold text-[#C9D1D9] border border-[#1F2532] hover:bg-white/5 transition-all">
            <Edit2 size={13} className="inline mr-2" />Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
type ModalKind = "create" | "edit" | "reschedule" | "delete" | "auto" | null;

export default function ShowtimeCalendar() {
  const [cinema,     setCinema]     = useState(CINEMAS[0]);
  const [date,       setDate]       = useState("2026-05-12");
  const [ddOpen,     setDdOpen]     = useState(false);
  const [showtimes,  setShowtimes]  = useState<Showtime[]>(() => detectConflicts(MOCK_SHOWTIMES));
  const [selected,   setSelected]   = useState<Showtime | null>(showtimes.find(s => s.id === "s10") ?? null);
  const [modal,      setModal]      = useState<ModalKind>(null);
  const [conflictOk, setConflictOk] = useState(false);

  const update = useCallback((list: Showtime[]) => {
    const next = detectConflicts(list);
    setShowtimes(next);
    setSelected(prev => prev ? (next.find(s => s.id === prev.id) ?? null) : null);
  }, []);

  // ── handlers ──
  function handleCreate(data: { movieTitle: string; room: string; startTime: string; language: string; format: string; cleaningMinutes: number; duration: number; color: string }) {
    const [h, m] = data.startTime.split(":").map(Number);
    const meta = MOVIES_META[data.movieTitle] ?? { color: data.color, colorHex: "#3B82F6" };
    const st: Showtime = {
      id: genId(), cinemaId: cinema.id, movieTitle: data.movieTitle, room: data.room,
      startMinutes: h * 60 + m, durationMinutes: data.duration,
      cleaningMinutes: data.cleaningMinutes, language: data.language,
      format: data.format, color: meta.color, colorHex: meta.colorHex, status: "normal",
    };
    update([...showtimes, st]);
    setModal(null);
  }

  function handleEdit(data: { movieTitle: string; room: string; startTime: string; language: string; format: string; cleaningMinutes: number; duration: number; color: string }) {
    if (!selected) return;
    const [h, m] = data.startTime.split(":").map(Number);
    const meta = MOVIES_META[data.movieTitle] ?? { color: data.color, colorHex: "#3B82F6" };
    update(showtimes.map(s => s.id !== selected.id ? s : {
      ...s, cinemaId: cinema.id, movieTitle: data.movieTitle, room: data.room,
      startMinutes: h * 60 + m, durationMinutes: data.duration,
      cleaningMinutes: data.cleaningMinutes, language: data.language,
      format: data.format, color: meta.color, colorHex: meta.colorHex,
    }));
    setModal(null);
  }

  function handleReschedule(newStart: number, newRoom: string) {
    if (!selected) return;
    update(showtimes.map(s => s.id !== selected.id ? s : { ...s, startMinutes: newStart, room: newRoom }));
    setModal(null);
  }

  function handleDelete() {
    if (!selected) return;
    update(showtimes.filter(s => s.id !== selected.id));
    setSelected(null);
    setModal(null);
  }

  function handleAuto(cfg: { movie: string; rooms: string[]; startHour: number; slots: number; interval: number }) {
    const meta = MOVIES_META[cfg.movie] ?? { color: "blue", colorHex: "#3B82F6" };
    const dur = { "Avengers: Endgame": 181, "Dune: Part Two": 166, "Lật Mặt 7": 120, "Mai": 130 }[cfg.movie] ?? 120;
    const news: Showtime[] = cfg.rooms.flatMap(room =>
      Array.from({ length: cfg.slots }, (_, i) => ({
        id: genId(), cinemaId: cinema.id, movieTitle: cfg.movie, room,
        startMinutes: cfg.startHour * 60 + i * (dur + cfg.interval),
        durationMinutes: dur, cleaningMinutes: 15,
        language: "2D Lồng Tiếng", format: "2D",
        color: meta.color, colorHex: meta.colorHex, status: "normal" as const,
      }))
    );
    update([...showtimes, ...news]);
    setModal(null);
  }

  const hasConflict = (room: string) => showtimes.filter(s => s.room === room && s.status === "conflict").length > 0;

  return (
    <div className="flex h-full flex-col bg-[#0D1117] text-white overflow-hidden">

      {/* Controls */}
      <div className="shrink-0 flex flex-wrap items-center gap-3 border-b border-[#1F2532] bg-[#161B22] px-6 py-3">
        <div className="relative">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#8B949E]">Cụm Rạp</p>
          <button onClick={() => setDdOpen(v => !v)} className="flex items-center gap-2 rounded-xl border border-[#1F2532] bg-[#0D1117] px-3 py-1.5 text-sm text-white hover:border-violet-500/50 transition-all">
            {cinema.name}<ChevronDown size={13} className="text-[#8B949E]" />
          </button>
          {ddOpen && (
            <div className="absolute top-full mt-1 z-50 w-48 rounded-xl border border-[#1F2532] bg-[#161B22] shadow-2xl overflow-hidden">
              {CINEMAS.map(c => (
                <button key={c.id} onClick={() => { setCinema(c); setDdOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-[#C9D1D9] hover:bg-violet-500/10 hover:text-white transition-colors">{c.name}</button>
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#8B949E]">Ngày</p>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="rounded-xl border border-[#1F2532] bg-[#0D1117] px-3 py-1.5 text-sm text-white outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15 transition-all" />
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={() => setModal("create")} className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(90deg,#2563EB,#3B82F6)", boxShadow: "0 4px 14px rgba(59,130,246,.3)" }}>
            <Plus size={14} /> TẠO SUẤT MỚI
          </button>
          <button onClick={() => setModal("auto")} className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(90deg,#059669,#10B981)", boxShadow: "0 4px 14px rgba(16,185,129,.3)" }}>
            <CalendarClock size={14} /> LỊCH TỰ ĐỘNG
          </button>
        </div>
      </div>

      {/* Grid + Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="min-w-[900px]">
            {/* Time axis */}
            <div className="sticky top-0 z-20 flex border-b border-[#1F2532] bg-[#0D1117]">
              <div className="w-14 shrink-0 border-r border-[#1F2532]" />
              <div className="relative flex-1 h-8">
                {HOURS.map(h => {
                  const pos = ((h - GRID_START_HOUR) / (GRID_END_HOUR - GRID_START_HOUR)) * 100;
                  return (
                    <div key={h} className="absolute top-0 flex flex-col items-center" style={{ left: `${pos}%` }}>
                      <span className="mt-1.5 text-[10px] text-[#8B949E] -translate-x-1/2 select-none">{h < 24 ? `${h}:00` : `${h - 24}:00`}</span>
                      <div className="absolute bottom-0 w-px h-2 bg-[#1F2532]" />
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Rows */}
            {ROOMS.map(room => {
              const roomSts = showtimes.filter(s => s.room === room.id);
              const conflict = hasConflict(room.id);
              return (
                <div key={room.id} className="flex border-b border-[#1F2532]" style={{ height: 72 }}>
                  <div className="w-14 shrink-0 flex items-center justify-center border-r border-[#1F2532]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold"
                      style={{ background: conflict ? "rgba(239,68,68,.15)" : "rgba(124,58,237,.15)", border: `1px solid ${conflict ? "rgba(239,68,68,.4)" : "rgba(124,58,237,.3)"}`, color: conflict ? "#FCA5A5" : "#A78BFA" }}>
                      {room.label}
                    </div>
                  </div>
                  <div className="relative flex-1 overflow-visible"
                    style={{ background: "repeating-linear-gradient(90deg,transparent 0%,transparent calc(100%/17 - 1px),rgba(31,37,50,.5) calc(100%/17 - 1px),rgba(31,37,50,.5) calc(100%/17))" }}>
                    <div className="absolute top-0 bottom-0 w-px z-10 pointer-events-none" style={{ left: `${pct(1 * 60 + 50 + GRID_START_MINS)}%`, background: "rgba(45,212,191,.6)" }}>
                      <div className="absolute top-0 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-teal-400" />
                    </div>
                    {roomSts.map(st => (
                      <Block key={st.id} st={st} selected={selected?.id === st.id}
                        onClick={() => setSelected(prev => prev?.id === st.id ? null : st)} />
                    ))}
                    {conflict && !conflictOk && room.id === showtimes.find(s => s.status === "conflict")?.room && (
                      <div className="absolute z-20 flex items-center gap-2 rounded-xl border border-red-500/40 bg-[#1a0a0a] px-3 py-2 shadow-lg"
                        style={{ bottom: "-38px", left: "35%", transform: "translateX(-50%)", minWidth: 220 }}>
                        <AlertTriangle size={13} className="shrink-0 text-red-400" />
                        <span className="text-[11px] text-red-300 font-medium">Giải quyết xung đột?</span>
                        <button onClick={() => selected && setModal("reschedule")} className="ml-auto rounded-md bg-red-500/20 px-2 py-0.5 text-[10px] text-red-300 hover:bg-red-500/40 transition-colors">Xử lý</button>
                        <button onClick={() => setConflictOk(true)} className="text-[#8B949E] hover:text-white"><X size={11} /></button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail sidebar */}
        <div className={`shrink-0 transition-all duration-300 overflow-hidden ${selected ? "w-64" : "w-0"}`}>
          {selected && (
            <Sidebar st={selected} onClose={() => setSelected(null)}
              onEdit={() => setModal("edit")}
              onReschedule={() => setModal("reschedule")}
              onDelete={() => setModal("delete")} />
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="shrink-0 flex flex-wrap items-center gap-4 border-t border-[#1F2532] bg-[#161B22] px-6 py-2">
        {[["#EF4444","Avengers: Endgame"],["#3B82F6","Dune: Part Two"],["#A855F7","Lật Mặt 7"],["#F97316","Mai"]].map(([color, label]) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
            <span className="text-[11px] text-[#8B949E]">{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-4">
          <div className="h-2.5 w-2.5 rounded-sm bg-[#8B949E]/30 border border-dashed border-[#8B949E]/50" />
          <span className="text-[11px] text-[#8B949E]">Dọn phòng</span>
        </div>
        <div className="flex items-center gap-1.5"><AlertTriangle size={10} className="text-red-400" /><span className="text-[11px] text-[#8B949E]">Xung đột</span></div>
        <div className="flex items-center gap-1.5"><Move size={10} className="text-blue-400" /><span className="text-[11px] text-[#8B949E]">Đang dời</span></div>
      </div>

      {/* Modals */}
      {modal === "create" && <ShowtimeFormModal mode="create" onClose={() => setModal(null)} onSave={handleCreate} />}
      {modal === "edit"   && selected && <ShowtimeFormModal mode="edit" showtime={selected} onClose={() => setModal(null)} onSave={handleEdit} />}
      {modal === "reschedule" && selected && <RescheduleModal showtime={selected} onClose={() => setModal(null)} onSave={handleReschedule} />}
      {modal === "delete" && selected && <DeleteConfirmModal showtime={selected} onClose={() => setModal(null)} onConfirm={handleDelete} />}
      {modal === "auto"   && <AutoScheduleModal onClose={() => setModal(null)} onApply={handleAuto} />}
    </div>
  );
}
