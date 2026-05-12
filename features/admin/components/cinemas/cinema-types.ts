// ===== TypeScript Interfaces for Cinema Management =====

export type SeatType = "Standard" | "VIP" | "Sweetbox" | "Empty";
export type RoomFormat = "Standard" | "3D" | "IMAX" | "VIP";
export type CinemaStatus = "Active" | "Inactive" | "Pending";

export interface Seat {
  row: string;
  col: number;
  type: SeatType;
  isOccupied?: boolean;
}

export interface SeatMap {
  rows: number;
  cols: number;
  seats: Seat[][];
}

export interface Room {
  id: string;
  name: string;
  format: RoomFormat;
  seatLayout: SeatMap;
}

export interface Cinema {
  id: string;
  name: string;
  address: string;
  hotline: string;
  rooms: Room[];
  status: CinemaStatus;
}

// ===== Seat Type Config =====
export const seatTypeConfig: Record<SeatType, { label: string; color: string; bg: string; surcharge: number }> = {
  Standard: { label: "Standard", color: "#8B949E", bg: "rgba(139,148,158,0.2)", surcharge: 0 },
  VIP:      { label: "VIP",      color: "#F59E0B", bg: "rgba(245,158,11,0.2)",  surcharge: 50000 },
  Sweetbox: { label: "Sweetbox", color: "#EC4899", bg: "rgba(236,72,153,0.2)",  surcharge: 100000 },
  Empty:    { label: "Trống",    color: "#1F2532", bg: "transparent",            surcharge: 0 },
};

export const roomFormatOptions: RoomFormat[] = ["Standard", "3D", "IMAX", "VIP"];

export const statusConfig: Record<CinemaStatus, { label: string; color: string; bg: string; glow: string }> = {
  Active:   { label: "Đang hoạt động", color: "#2DD4BF", bg: "rgba(45,212,191,0.1)",  glow: "#2DD4BF" },
  Pending:  { label: "Chưa hoạt động", color: "#60A5FA", bg: "rgba(96,165,250,0.1)",  glow: "#60A5FA" },
  Inactive: { label: "Ngừng hoạt động", color: "#8B949E", bg: "rgba(139,148,158,0.1)", glow: "#8B949E" },
};

// ===== Helper: generate empty seat map =====
export function generateSeatMap(rows: number, cols: number): SeatMap {
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const seats: Seat[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      row: rowLabels[r] ?? String(r + 1),
      col: c + 1,
      type: "Standard" as SeatType,
      isOccupied: false,
    }))
  );
  return { rows, cols, seats };
}

// ===== Mock Data =====
export const mockCinemas: Cinema[] = [
  {
    id: "c1", name: "CGV Vincom Center", address: "72 Lê Thánh Tôn, Q.1, TP.HCM",
    hotline: "1900 6017", status: "Active",
    rooms: [
      { id: "r1", name: "Phòng 1", format: "Standard", seatLayout: generateSeatMap(6, 10) },
      { id: "r2", name: "Phòng 2", format: "IMAX",     seatLayout: generateSeatMap(8, 12) },
    ],
  },
  {
    id: "c2", name: "Galaxy Nguyễn Du", address: "116 Nguyễn Du, Q.1, TP.HCM",
    hotline: "1900 2224", status: "Active",
    rooms: [
      { id: "r3", name: "Phòng A", format: "3D",  seatLayout: generateSeatMap(7, 11) },
      { id: "r4", name: "Phòng B", format: "VIP", seatLayout: generateSeatMap(4, 8)  },
    ],
  },
  {
    id: "c3", name: "Lotte Cinema Landmark", address: "461A Điện Biên Phủ, Bình Thạnh",
    hotline: "1800 5555", status: "Active",
    rooms: [
      { id: "r5", name: "Phòng Gold", format: "IMAX", seatLayout: generateSeatMap(9, 14) },
    ],
  },
  {
    id: "c4", name: "BHD Star Bitexco", address: "2 Hải Triều, Q.1, TP.HCM",
    hotline: "1900 2099", status: "Active",
    rooms: [
      { id: "r6", name: "Phòng 1", format: "Standard", seatLayout: generateSeatMap(6, 10) },
      { id: "r7", name: "Phòng 2", format: "3D",       seatLayout: generateSeatMap(7, 12) },
      { id: "r8", name: "Phòng VIP", format: "VIP",    seatLayout: generateSeatMap(3, 6)  },
    ],
  },
  {
    id: "c5", name: "MegaGS Cao Thắng", address: "207 Cao Thắng, Q.3, TP.HCM",
    hotline: "1900 2088", status: "Active",
    rooms: [{ id: "r9", name: "Phòng 1", format: "Standard", seatLayout: generateSeatMap(6, 10) }],
  },
  {
    id: "c6", name: "CGV Gigamall", address: "242 Phạm Văn Đồng, Thủ Đức",
    hotline: "1900 6017", status: "Pending",
    rooms: [{ id: "r10", name: "Phòng 1", format: "Standard", seatLayout: generateSeatMap(6, 10) }],
  },
  {
    id: "c7", name: "Cinestar Quốc Thanh", address: "271 Nguyễn Trãi, Q.1, TP.HCM",
    hotline: "1900 9009", status: "Pending",
    rooms: [{ id: "r11", name: "Phòng A", format: "3D", seatLayout: generateSeatMap(7, 10) }],
  },
  {
    id: "c8", name: "Dcine Nguyễn Kiệm", address: "176 Nguyễn Kiệm, Phú Nhuận",
    hotline: "1800 1234", status: "Inactive",
    rooms: [],
  },
];
