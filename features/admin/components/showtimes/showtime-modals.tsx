"use client";

import { useState, useEffect } from "react";
import { X, Film, Clock, Trash2, Move, CalendarClock, AlertTriangle } from "lucide-react";
import { Showtime, ROOMS, minsToHHMM } from "./showtime-types";

// ── helpers ──────────────────────────────────────────────────────────────────
function toHHMM(mins: number) {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function fromHHMM(s: string) {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + (m || 0);
}

const MOVIES = [
  { title: "Avengers: Endgame", duration: 181, color: "red"    },
  { title: "Dune: Part Two",    duration: 166, color: "blue"   },
  { title: "Lật Mặt 7",         duration: 120, color: "purple" },
  { title: "Mai",               duration: 130, color: "orange" },
];
const LANGUAGES = ["2D Lồng Tiếng", "2D Phụ Đề", "3D Phụ Đề", "IMAX", "4DX"];
const FORMATS   = ["2D", "3D", "IMAX", "4DX"];

// ── shared modal shell ────────────────────────────────────────────────────────
function ModalShell({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg rounded-2xl shadow-2xl"
        style={{ background: "#0D1117", border: "1px solid #1F2532", animation: "scaleIn .18s ease-out" }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`@keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>
        <div className="flex items-center justify-between border-b border-[#1F2532] px-6 py-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-[#8B949E] hover:text-white hover:bg-white/5 transition-all">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#8B949E]">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-[#1F2532] bg-[#161B22] px-3 py-2 text-sm text-white outline-none transition-all focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15";
const selectCls = inputCls + " cursor-pointer";

// ── Create / Edit Modal ───────────────────────────────────────────────────────
interface ShowtimeFormData {
  movieTitle: string;
  room: string;
  startTime: string;   // "HH:MM"
  language: string;
  format: string;
  cleaningMinutes: number;
}

export function ShowtimeFormModal({ mode, showtime, onClose, onSave }: {
  mode: "create" | "edit";
  showtime?: Showtime | null;
  onClose: () => void;
  onSave: (data: ShowtimeFormData & { duration: number; color: string }) => void;
}) {
  const defaultMovie = MOVIES[0];
  const [form, setForm] = useState<ShowtimeFormData>({
    movieTitle:      showtime?.movieTitle      ?? defaultMovie.title,
    room:            showtime?.room            ?? ROOMS[0].id,
    startTime:       showtime ? toHHMM(showtime.startMinutes) : "09:00",
    language:        showtime?.language        ?? LANGUAGES[0],
    format:          showtime?.format          ?? FORMATS[0],
    cleaningMinutes: showtime?.cleaningMinutes ?? 15,
  });

  // Auto-fill duration from movie selection
  const selectedMovie = MOVIES.find(m => m.title === form.movieTitle) ?? defaultMovie;

  function set<K extends keyof ShowtimeFormData>(k: K, v: ShowtimeFormData[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      ...form,
      duration: showtime?.durationMinutes ?? selectedMovie.duration,
      color:    showtime?.color           ?? selectedMovie.color,
    });
  }

  return (
    <ModalShell title={mode === "create" ? "Tạo Suất Chiếu Mới" : "Chỉnh Sửa Suất Chiếu"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phim">
            <select className={selectCls} value={form.movieTitle} onChange={e => set("movieTitle", e.target.value)}>
              {MOVIES.map(m => <option key={m.title} value={m.title}>{m.title}</option>)}
            </select>
          </Field>
          <Field label="Phòng chiếu">
            <select className={selectCls} value={form.room} onChange={e => set("room", e.target.value)}>
              {ROOMS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Giờ bắt đầu">
          <input type="time" className={inputCls} value={form.startTime}
            onChange={e => set("startTime", e.target.value)} required />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Ngôn ngữ">
            <select className={selectCls} value={form.language} onChange={e => set("language", e.target.value)}>
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </Field>
          <Field label="Định dạng">
            <select className={selectCls} value={form.format} onChange={e => set("format", e.target.value)}>
              {FORMATS.map(f => <option key={f}>{f}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Thời gian dọn phòng (phút)">
          <input type="number" min={0} max={60} className={inputCls}
            value={form.cleaningMinutes}
            onChange={e => set("cleaningMinutes", Number(e.target.value))} />
        </Field>

        {/* Preview */}
        <div className="rounded-xl border border-[#1F2532] bg-[#161B22] p-3 text-xs text-[#8B949E] space-y-1">
          <p className="text-white font-semibold text-sm">{form.movieTitle}</p>
          <p>Phòng: <span className="text-white">{form.room}</span>  ·  Bắt đầu: <span className="text-white">{form.startTime}</span></p>
          <p>Thời lượng: <span className="text-white">{selectedMovie.duration}m</span>  ·  Dọn phòng: <span className="text-white">{form.cleaningMinutes}m</span></p>
          <p>Kết thúc (phim): <span className="text-teal-400">
            {toHHMM(fromHHMM(form.startTime) + selectedMovie.duration)}
          </span></p>
        </div>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-[#1F2532] text-[#8B949E] hover:text-white hover:border-[#8B949E] transition-all">
            Hủy
          </button>
          <button type="submit"
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(90deg,#7C3AED,#2DD4BF)", boxShadow: "0 4px 14px rgba(124,58,237,.35)" }}>
            {mode === "create" ? "Tạo suất chiếu" : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ── Reschedule Modal ──────────────────────────────────────────────────────────
export function RescheduleModal({ showtime, onClose, onSave }: {
  showtime: Showtime;
  onClose: () => void;
  onSave: (newStart: number, newRoom: string) => void;
}) {
  const [newTime, setNewTime] = useState(toHHMM(showtime.startMinutes));
  const [newRoom, setNewRoom] = useState(showtime.room);

  return (
    <ModalShell title="Dời Lịch Chiếu" onClose={onClose}>
      <div className="p-6 space-y-5">
        {/* Current */}
        <div className="rounded-xl border border-[#1F2532] bg-[#161B22] p-3 text-xs space-y-1">
          <p className="text-[#8B949E] uppercase tracking-wider font-semibold mb-1">Hiện tại</p>
          <p className="text-white font-semibold">{showtime.movieTitle}</p>
          <p className="text-[#8B949E]">
            {showtime.room}  ·  {minsToHHMM(showtime.startMinutes)} – {minsToHHMM(showtime.startMinutes + showtime.durationMinutes)}
          </p>
        </div>

        <Field label="Phòng mới">
          <select className={selectCls} value={newRoom} onChange={e => setNewRoom(e.target.value)}>
            {ROOMS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
        </Field>

        <Field label="Giờ bắt đầu mới">
          <input type="time" className={inputCls} value={newTime} onChange={e => setNewTime(e.target.value)} />
        </Field>

        {/* Arrow preview */}
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-lg bg-[#161B22] border border-[#1F2532] px-3 py-1.5 text-white">
            {showtime.room} · {minsToHHMM(showtime.startMinutes)}
          </span>
          <Move size={14} className="text-blue-400 shrink-0" />
          <span className="rounded-lg bg-blue-500/15 border border-blue-500/30 px-3 py-1.5 text-blue-300">
            {newRoom} · {newTime}
          </span>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-[#1F2532] text-[#8B949E] hover:text-white transition-all">
            Hủy
          </button>
          <button onClick={() => onSave(fromHHMM(newTime), newRoom)}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(90deg,#2563EB,#3B82F6)", boxShadow: "0 4px 14px rgba(59,130,246,.3)" }}>
            Xác nhận dời lịch
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────
export function DeleteConfirmModal({ showtime, onClose, onConfirm }: {
  showtime: Showtime;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalShell title="Xác Nhận Hủy Suất" onClose={onClose}>
      <div className="p-6 space-y-5">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30">
            <Trash2 size={22} className="text-red-400" />
          </div>
          <div>
            <p className="font-bold text-white">{showtime.movieTitle}</p>
            <p className="text-sm text-[#8B949E] mt-1">
              {showtime.room} · {minsToHHMM(showtime.startMinutes)} – {minsToHHMM(showtime.startMinutes + showtime.durationMinutes)}
            </p>
          </div>
          <p className="text-sm text-[#8B949E]">Bạn có chắc muốn hủy suất chiếu này? Hành động không thể hoàn tác.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-[#1F2532] text-[#8B949E] hover:text-white transition-all">
            Không, giữ lại
          </button>
          <button onClick={onConfirm}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all shadow-[0_4px_14px_rgba(239,68,68,.35)]">
            Hủy suất chiếu
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ── Auto Schedule Modal ───────────────────────────────────────────────────────
export function AutoScheduleModal({ onClose, onApply }: {
  onClose: () => void;
  onApply: (config: { movie: string; rooms: string[]; startHour: number; slots: number; interval: number }) => void;
}) {
  const [movie,     setMovie]     = useState(MOVIES[0].title);
  const [rooms,     setRooms]     = useState<string[]>(["P1"]);
  const [startHour, setStartHour] = useState(9);
  const [slots,     setSlots]     = useState(3);
  const [interval,  setInterval2] = useState(30);

  function toggleRoom(id: string) {
    setRooms(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  }

  return (
    <ModalShell title="Lịch Chiếu Tự Động" onClose={onClose}>
      <div className="p-6 space-y-4">
        <Field label="Phim">
          <select className={selectCls} value={movie} onChange={e => setMovie(e.target.value)}>
            {MOVIES.map(m => <option key={m.title} value={m.title}>{m.title}</option>)}
          </select>
        </Field>

        <Field label="Chọn phòng">
          <div className="flex flex-wrap gap-2 mt-1">
            {ROOMS.map(r => (
              <button key={r.id} type="button" onClick={() => toggleRoom(r.id)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all"
                style={{
                  background:   rooms.includes(r.id) ? "rgba(124,58,237,.2)" : "transparent",
                  borderColor:  rooms.includes(r.id) ? "rgba(124,58,237,.5)" : "#1F2532",
                  color:        rooms.includes(r.id) ? "#A78BFA" : "#8B949E",
                }}>
                {r.label}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Bắt đầu từ">
            <input type="number" min={6} max={22} className={inputCls} value={startHour}
              onChange={e => setStartHour(Number(e.target.value))} />
          </Field>
          <Field label="Số suất">
            <input type="number" min={1} max={6} className={inputCls} value={slots}
              onChange={e => setSlots(Number(e.target.value))} />
          </Field>
          <Field label="Nghỉ giữa (p)">
            <input type="number" min={0} max={120} className={inputCls} value={interval}
              onChange={e => setInterval2(Number(e.target.value))} />
          </Field>
        </div>

        <div className="rounded-xl border border-[#1F2532] bg-[#161B22] p-3 text-xs text-[#8B949E]">
          <p className="font-semibold text-white mb-1">Xem trước lịch</p>
          {rooms.length === 0
            ? <p>Chưa chọn phòng nào.</p>
            : rooms.map(r => {
                const dur = MOVIES.find(m => m.title === movie)?.duration ?? 120;
                return (
                  <p key={r} className="mt-1">
                    <span className="text-violet-400 font-semibold">{r}</span>:{" "}
                    {Array.from({ length: slots }, (_, i) => {
                      const start = startHour * 60 + i * (dur + interval);
                      return `${toHHMM(start)}`;
                    }).join(" → ")}
                  </p>
                );
              })}
        </div>

        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-[#1F2532] text-[#8B949E] hover:text-white transition-all">
            Hủy
          </button>
          <button onClick={() => onApply({ movie, rooms, startHour, slots, interval })}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(90deg,#059669,#10B981)", boxShadow: "0 4px 14px rgba(16,185,129,.3)" }}>
            Áp dụng lịch tự động
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
