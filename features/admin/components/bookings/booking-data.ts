export type BookingStatus = "Đã thanh toán" | "Chờ thanh toán" | "Đã hủy";
export type PaymentMethod = "Thẻ tín dụng" | "Ví điện tử" | "Tiền mặt" | "Chuyển khoản";

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  movieTitle: string;
  moviePoster: string;
  showtime: string;
  showDate: string;
  room: string;
  seats: string[];
  totalAmount: number;
  status: BookingStatus;
  paymentMethod: PaymentMethod;
  bookedAt: string;
  notes?: string;
}

export const statusConfig: Record<BookingStatus, { bg: string; color: string; glow: string; label: string }> = {
  "Đã thanh toán": {
    bg: "rgba(16,185,129,0.12)",
    color: "#10B981",
    glow: "#10B981",
    label: "Đã thanh toán",
  },
  "Chờ thanh toán": {
    bg: "rgba(251,191,36,0.12)",
    color: "#FBBF24",
    glow: "#FBBF24",
    label: "Chờ thanh toán",
  },
  "Đã hủy": {
    bg: "rgba(239,68,68,0.12)",
    color: "#EF4444",
    glow: "#EF4444",
    label: "Đã hủy",
  },
};

export const bookingsData: Booking[] = [
  {
    id: "BK-2024-001",
    customerName: "Nguyễn Văn An",
    customerPhone: "0912345678",
    customerEmail: "an.nguyen@email.com",
    movieTitle: "Avengers: Endgame",
    moviePoster: "https://image.tmdb.org/t/p/w200/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    showtime: "19:30",
    showDate: "12/05/2026",
    room: "Phòng 1 - IMAX",
    seats: ["A1", "A2", "A3"],
    totalAmount: 450000,
    status: "Đã thanh toán",
    paymentMethod: "Thẻ tín dụng",
    bookedAt: "10/05/2026 14:22",
  },
  {
    id: "BK-2024-002",
    customerName: "Trần Thị Bình",
    customerPhone: "0987654321",
    customerEmail: "binh.tran@email.com",
    movieTitle: "Dune: Part Two",
    moviePoster: "https://image.tmdb.org/t/p/w200/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg",
    showtime: "21:00",
    showDate: "12/05/2026",
    room: "Phòng 2 - 3D",
    seats: ["C5", "C6"],
    totalAmount: 280000,
    status: "Chờ thanh toán",
    paymentMethod: "Ví điện tử",
    bookedAt: "11/05/2026 09:15",
  },
  {
    id: "BK-2024-003",
    customerName: "Lê Hoàng Cường",
    customerPhone: "0356789012",
    customerEmail: "cuong.le@email.com",
    movieTitle: "Lật Mặt 7",
    moviePoster: "https://image.tmdb.org/t/p/w200/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    showtime: "14:00",
    showDate: "11/05/2026",
    room: "Phòng 3 - 2D",
    seats: ["F10", "F11", "F12", "F13"],
    totalAmount: 560000,
    status: "Đã hủy",
    paymentMethod: "Chuyển khoản",
    bookedAt: "09/05/2026 20:30",
    notes: "Khách yêu cầu hoàn tiền do thay đổi lịch.",
  },
  {
    id: "BK-2024-004",
    customerName: "Phạm Minh Dũng",
    customerPhone: "0778901234",
    customerEmail: "dung.pham@email.com",
    movieTitle: "Mai",
    moviePoster: "https://image.tmdb.org/t/p/w200/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    showtime: "10:00",
    showDate: "13/05/2026",
    room: "Phòng 1 - IMAX",
    seats: ["B7", "B8"],
    totalAmount: 300000,
    status: "Đã thanh toán",
    paymentMethod: "Ví điện tử",
    bookedAt: "12/05/2026 08:00",
  },
  {
    id: "BK-2024-005",
    customerName: "Võ Thị Eline",
    customerPhone: "0912000111",
    customerEmail: "eline.vo@email.com",
    movieTitle: "Avengers: Endgame",
    moviePoster: "https://image.tmdb.org/t/p/w200/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    showtime: "16:30",
    showDate: "13/05/2026",
    room: "Phòng 2 - 3D",
    seats: ["D1", "D2", "D3", "D4", "D5"],
    totalAmount: 750000,
    status: "Đã thanh toán",
    paymentMethod: "Tiền mặt",
    bookedAt: "11/05/2026 17:45",
  },
  {
    id: "BK-2024-006",
    customerName: "Hoàng Quốc Phúc",
    customerPhone: "0344512678",
    customerEmail: "phuc.hoang@email.com",
    movieTitle: "Dune: Part Two",
    moviePoster: "https://image.tmdb.org/t/p/w200/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg",
    showtime: "20:00",
    showDate: "14/05/2026",
    room: "Phòng 4 - 4DX",
    seats: ["G3"],
    totalAmount: 200000,
    status: "Chờ thanh toán",
    paymentMethod: "Thẻ tín dụng",
    bookedAt: "12/05/2026 11:10",
  },
];

export const SHOWTIMES_OPTIONS = [
  { date: "13/05/2026", time: "10:00", room: "Phòng 1 - IMAX" },
  { date: "13/05/2026", time: "13:30", room: "Phòng 2 - 3D" },
  { date: "13/05/2026", time: "16:30", room: "Phòng 3 - 2D" },
  { date: "13/05/2026", time: "19:00", room: "Phòng 4 - 4DX" },
  { date: "14/05/2026", time: "09:00", room: "Phòng 1 - IMAX" },
  { date: "14/05/2026", time: "14:00", room: "Phòng 2 - 3D" },
  { date: "14/05/2026", time: "20:00", room: "Phòng 3 - 2D" },
];
