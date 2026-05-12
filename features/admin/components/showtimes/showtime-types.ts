// ===== Types =====
export type ShowtimeStatus = "normal" | "conflict" | "dragging";

export interface Showtime {
  id: string;
  cinemaId: string;      // ID của cụm rạp chứa phòng chiếu này
  movieTitle: string;
  room: string;
  startMinutes: number; // minutes from 00:00
  durationMinutes: number;
  cleaningMinutes: number;
  language: string;
  format: string;
  color: string;       // bg color class base
  colorHex: string;
  status: ShowtimeStatus;
}

export interface Room {
  id: string;
  label: string;
}

export interface Cinema {
  id: string;
  name: string;
}

// ===== Constants =====
export const GRID_START_HOUR = 8;   // 08:00
export const GRID_END_HOUR   = 25;  // 01:00 next day (24+1)
export const GRID_TOTAL_MINS = (GRID_END_HOUR - GRID_START_HOUR) * 60;
export const GRID_START_MINS = GRID_START_HOUR * 60;

export const CINEMAS: Cinema[] = [
  { id: "cgv-vincom",   name: "CGV Vincom" },
  { id: "galaxy-nd",    name: "Galaxy Nguyễn Du" },
  { id: "lotte-lm",     name: "Lotte Landmark" },
];

export const ROOMS: Room[] = [
  { id: "P1", label: "P1" },
  { id: "P2", label: "P2" },
  { id: "P3", label: "P3" },
  { id: "P4", label: "P4" },
  { id: "P5", label: "P5" },
  { id: "P6", label: "P6" },
  { id: "P7", label: "P7" },
  { id: "P8", label: "P8" },
];

// Helper: hh:mm -> minutes from 00:00
function t(hh: number, mm: number) { return hh * 60 + mm; }

export const MOCK_SHOWTIMES: Showtime[] = [
  // P1
  { id: "s1",  cinemaId: "cgv-vincom", movieTitle: "Avengers: Endgame", room: "P1", startMinutes: t(9,0),  durationMinutes: 181, cleaningMinutes: 15, language: "2D Lồng Tiếng", format: "2D", color: "red",    colorHex: "#EF4444", status: "normal" },
  { id: "s2",  cinemaId: "cgv-vincom", movieTitle: "Dune: Part Two",     room: "P1", startMinutes: t(13,0), durationMinutes: 166, cleaningMinutes: 15, language: "2D Phụ Đề",    format: "2D", color: "blue",   colorHex: "#3B82F6", status: "normal" },
  { id: "s3",  cinemaId: "cgv-vincom", movieTitle: "Mai",                room: "P1", startMinutes: t(17,0), durationMinutes: 130, cleaningMinutes: 15, language: "2D Lồng Tiếng", format: "2D", color: "orange", colorHex: "#F97316", status: "normal" },

  // P2
  { id: "s4",  cinemaId: "cgv-vincom", movieTitle: "Lật Mặt 7",          room: "P2", startMinutes: t(9,30), durationMinutes: 120, cleaningMinutes: 15, language: "2D Lồng Tiếng", format: "2D", color: "purple", colorHex: "#A855F7", status: "normal" },
  { id: "s5",  cinemaId: "cgv-vincom", movieTitle: "Avengers: Endgame",  room: "P2", startMinutes: t(13,0), durationMinutes: 181, cleaningMinutes: 15, language: "2D Lồng Tiếng", format: "2D", color: "red",    colorHex: "#EF4444", status: "normal" },
  { id: "s6",  cinemaId: "cgv-vincom", movieTitle: "Mai",                room: "P2", startMinutes: t(18,0), durationMinutes: 130, cleaningMinutes: 15, language: "2D Lồng Tiếng", format: "2D", color: "orange", colorHex: "#F97316", status: "normal" },

  // P3 — drag scenario
  { id: "s7",  cinemaId: "cgv-vincom", movieTitle: "Dune: Part Two",     room: "P3", startMinutes: t(10,0), durationMinutes: 166, cleaningMinutes: 15, language: "2D Phụ Đề",    format: "2D", color: "blue",   colorHex: "#3B82F6", status: "dragging" },
  { id: "s8",  cinemaId: "cgv-vincom", movieTitle: "Lật Mặt 7",          room: "P3", startMinutes: t(16,0), durationMinutes: 120, cleaningMinutes: 15, language: "2D Lồng Tiếng", format: "2D", color: "purple", colorHex: "#A855F7", status: "normal" },
  { id: "s9",  cinemaId: "cgv-vincom", movieTitle: "Avengers: Endgame",  room: "P3", startMinutes: t(20,0), durationMinutes: 181, cleaningMinutes: 15, language: "2D Lồng Tiếng", format: "2D", color: "red",    colorHex: "#EF4444", status: "normal" },

  // P4 — conflict scenario
  { id: "s10", cinemaId: "cgv-vincom", movieTitle: "Mai",                room: "P4", startMinutes: t(15,0), durationMinutes: 130, cleaningMinutes: 15, language: "2D Lồng Tiếng", format: "2D", color: "orange", colorHex: "#F97316", status: "normal" },
  { id: "s11", cinemaId: "cgv-vincom", movieTitle: "Dune: Part Two",     room: "P4", startMinutes: t(16,30),durationMinutes: 166, cleaningMinutes: 15, language: "2D Phụ Đề",    format: "2D", color: "blue",   colorHex: "#3B82F6", status: "conflict" },

  // P5
  { id: "s12", cinemaId: "cgv-vincom", movieTitle: "Lật Mặt 7",          room: "P5", startMinutes: t(9,0),  durationMinutes: 120, cleaningMinutes: 15, language: "2D Lồng Tiếng", format: "2D", color: "purple", colorHex: "#A855F7", status: "normal" },
  { id: "s13", cinemaId: "cgv-vincom", movieTitle: "Mai",                room: "P5", startMinutes: t(12,0), durationMinutes: 130, cleaningMinutes: 15, language: "2D Lồng Tiếng", format: "2D", color: "orange", colorHex: "#F97316", status: "normal" },
  { id: "s14", cinemaId: "cgv-vincom", movieTitle: "Dune: Part Two",     room: "P5", startMinutes: t(16,0), durationMinutes: 166, cleaningMinutes: 15, language: "2D Phụ Đề",    format: "2D", color: "blue",   colorHex: "#3B82F6", status: "normal" },
  { id: "s15", cinemaId: "cgv-vincom", movieTitle: "Avengers: Endgame",  room: "P5", startMinutes: t(21,0), durationMinutes: 181, cleaningMinutes: 15, language: "2D Lồng Tiếng", format: "2D", color: "red",    colorHex: "#EF4444", status: "normal" },

  // P6
  { id: "s16", cinemaId: "cgv-vincom", movieTitle: "Avengers: Endgame",  room: "P6", startMinutes: t(10,0), durationMinutes: 181, cleaningMinutes: 15, language: "IMAX",           format: "IMAX", color: "red",  colorHex: "#EF4444", status: "normal" },
  { id: "s17", cinemaId: "cgv-vincom", movieTitle: "Lật Mặt 7",          room: "P6", startMinutes: t(14,30),durationMinutes: 120, cleaningMinutes: 15, language: "2D Lồng Tiếng", format: "2D", color: "purple", colorHex: "#A855F7", status: "normal" },
  { id: "s18", cinemaId: "cgv-vincom", movieTitle: "Mai",                room: "P6", startMinutes: t(19,0), durationMinutes: 130, cleaningMinutes: 15, language: "2D Lồng Tiếng", format: "2D", color: "orange", colorHex: "#F97316", status: "normal" },

  // P7
  { id: "s19", cinemaId: "cgv-vincom", movieTitle: "Dune: Part Two",     room: "P7", startMinutes: t(11,0), durationMinutes: 166, cleaningMinutes: 15, language: "3D Phụ Đề",    format: "3D", color: "blue",   colorHex: "#3B82F6", status: "normal" },
  { id: "s20", cinemaId: "cgv-vincom", movieTitle: "Avengers: Endgame",  room: "P7", startMinutes: t(15,0), durationMinutes: 181, cleaningMinutes: 15, language: "IMAX",           format: "IMAX", color: "red",  colorHex: "#EF4444", status: "normal" },

  // P8
  { id: "s21", cinemaId: "cgv-vincom", movieTitle: "Lật Mặt 7",          room: "P8", startMinutes: t(13,0), durationMinutes: 120, cleaningMinutes: 15, language: "2D Lồng Tiếng", format: "2D", color: "purple", colorHex: "#A855F7", status: "normal" },
  { id: "s22", cinemaId: "cgv-vincom", movieTitle: "Mai",                room: "P8", startMinutes: t(16,0), durationMinutes: 130, cleaningMinutes: 15, language: "2D Lồng Tiếng", format: "2D", color: "orange", colorHex: "#F97316", status: "normal" },
  { id: "s23", cinemaId: "cgv-vincom", movieTitle: "Dune: Part Two",     room: "P8", startMinutes: t(20,0), durationMinutes: 166, cleaningMinutes: 15, language: "2D Phụ Đề",    format: "2D", color: "blue",   colorHex: "#3B82F6", status: "normal" },
];

// ===== Utilities =====
export function minsToHHMM(totalMins: number): string {
  const h = Math.floor(totalMins / 60) % 24;
  const m = totalMins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function pct(mins: number): number {
  return ((mins - GRID_START_MINS) / GRID_TOTAL_MINS) * 100;
}

export function widthPct(mins: number): number {
  return (mins / GRID_TOTAL_MINS) * 100;
}
