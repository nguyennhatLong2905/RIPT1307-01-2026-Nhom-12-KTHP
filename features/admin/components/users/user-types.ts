export type CustomerStatus = "active" | "locked";
export type MembershipTier = "Standard" | "VIP" | "VVIP";
export type StaffRole = "super_admin" | "cinema_manager" | "customer_support";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  tier: MembershipTier;
  totalSpend: number;
  points: number;
  joinedAt: string;
  bookingCount: number;
}

export interface BookingHistory {
  id: string;
  movieTitle: string;
  showDate: string;
  showtime: string;
  room: string;
  seats: string[];
  amount: number;
  status: "Đã thanh toán" | "Đã hủy";
}

export interface TierRule {
  tier: MembershipTier;
  minSpend: number;
  color: string;
  bg: string;
  glow: string;
  perks: string[];
}

export interface StaffAccount {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  assignedCinema?: string;
  createdAt: string;
  isActive: boolean;
}

export const tierConfig: Record<MembershipTier, { color: string; bg: string; glow: string }> = {
  Standard: { color: "#8B949E", bg: "rgba(139,148,158,0.15)", glow: "#8B949E" },
  VIP:      { color: "#F59E0B", bg: "rgba(245,158,11,0.15)",  glow: "#F59E0B" },
  VVIP:     { color: "#A78BFA", bg: "rgba(167,139,250,0.15)", glow: "#A78BFA" },
};

export const statusConfig: Record<CustomerStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Hoạt động", color: "#10B981", bg: "rgba(16,185,129,0.12)" },
  locked: { label: "Đã khóa",   color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
};

export const roleConfig: Record<StaffRole, { label: string; color: string; bg: string }> = {
  super_admin:       { label: "Super Admin",    color: "#A78BFA", bg: "rgba(167,139,250,0.15)" },
  cinema_manager:    { label: "Quản lý Rạp",   color: "#60A5FA", bg: "rgba(96,165,250,0.15)"  },
  customer_support:  { label: "CSKH",           color: "#2DD4BF", bg: "rgba(45,212,191,0.15)"  },
};

export const TIER_RULES: TierRule[] = [
  { tier: "Standard", minSpend: 0,         color: "#8B949E", bg: "rgba(139,148,158,0.15)", glow: "#8B949E", perks: ["Tích điểm cơ bản", "Ưu đãi sinh nhật"] },
  { tier: "VIP",      minSpend: 5000000,   color: "#F59E0B", bg: "rgba(245,158,11,0.15)",  glow: "#F59E0B", perks: ["Tích điểm x1.5", "Ưu đãi sinh nhật", "Ưu tiên đặt vé", "Giảm 5% mỗi đơn"] },
  { tier: "VVIP",     minSpend: 20000000,  color: "#A78BFA", bg: "rgba(167,139,250,0.15)", glow: "#A78BFA", perks: ["Tích điểm x2", "Ưu đãi sinh nhật", "Ưu tiên đặt vé", "Giảm 10% mỗi đơn", "Phòng chiếu riêng theo yêu cầu"] },
];

export const mockCustomers: Customer[] = [
  { id: "U001", name: "Nguyễn Văn An",   email: "an.nguyen@email.com",  phone: "0912345678", status: "active", tier: "VVIP",     totalSpend: 25000000, points: 2500, joinedAt: "2023-01-15", bookingCount: 48 },
  { id: "U002", name: "Trần Thị Bình",   email: "binh.tran@email.com",  phone: "0987654321", status: "active", tier: "VIP",      totalSpend: 8500000,  points: 850,  joinedAt: "2023-03-22", bookingCount: 21 },
  { id: "U003", name: "Lê Hoàng Cường",  email: "cuong.le@email.com",   phone: "0356789012", status: "locked", tier: "Standard", totalSpend: 1200000,  points: 120,  joinedAt: "2024-01-10", bookingCount: 5  },
  { id: "U004", name: "Phạm Minh Dũng",  email: "dung.pham@email.com",  phone: "0778901234", status: "active", tier: "VIP",      totalSpend: 6300000,  points: 630,  joinedAt: "2023-06-05", bookingCount: 17 },
  { id: "U005", name: "Võ Thị Eline",    email: "eline.vo@email.com",   phone: "0912000111", status: "active", tier: "Standard", totalSpend: 980000,   points: 98,   joinedAt: "2024-02-18", bookingCount: 4  },
  { id: "U006", name: "Hoàng Quốc Phúc", email: "phuc.hoang@email.com", phone: "0344512678", status: "active", tier: "VVIP",     totalSpend: 31000000, points: 3100, joinedAt: "2022-11-01", bookingCount: 62 },
  { id: "U007", name: "Đinh Thị Giang",  email: "giang.dinh@email.com", phone: "0901234567", status: "active", tier: "Standard", totalSpend: 2100000,  points: 210,  joinedAt: "2024-03-30", bookingCount: 8  },
  { id: "U008", name: "Bùi Văn Hùng",    email: "hung.bui@email.com",   phone: "0765432198", status: "locked", tier: "Standard", totalSpend: 450000,   points: 45,   joinedAt: "2024-04-12", bookingCount: 2  },
];

export const mockBookingHistory: Record<string, BookingHistory[]> = {
  U001: [
    { id: "BK-001", movieTitle: "Avengers: Endgame", showDate: "10/05/2026", showtime: "19:30", room: "Phòng 1 - IMAX", seats: ["A1","A2","A3"], amount: 450000, status: "Đã thanh toán" },
    { id: "BK-002", movieTitle: "Dune: Part Two",     showDate: "05/05/2026", showtime: "21:00", room: "Phòng 2 - 3D",   seats: ["C5","C6"],      amount: 280000, status: "Đã thanh toán" },
    { id: "BK-003", movieTitle: "Mai",                showDate: "28/04/2026", showtime: "14:00", room: "Phòng 3 - 2D",   seats: ["F10"],          amount: 120000, status: "Đã hủy"       },
  ],
  U002: [
    { id: "BK-010", movieTitle: "Lật Mặt 7",          showDate: "08/05/2026", showtime: "16:30", room: "Phòng 2 - 3D",   seats: ["D3","D4"],      amount: 240000, status: "Đã thanh toán" },
    { id: "BK-011", movieTitle: "Avengers: Endgame",   showDate: "01/05/2026", showtime: "19:30", room: "Phòng 1 - IMAX", seats: ["B5","B6"],      amount: 300000, status: "Đã thanh toán" },
  ],
};

export const mockStaff: StaffAccount[] = [
  { id: "S001", name: "Admin Hệ Thống",   email: "admin@luxecinema.vn",   role: "super_admin",      createdAt: "2022-01-01", isActive: true },
  { id: "S002", name: "Nguyễn Quản Lý",  email: "manager@luxecinema.vn", role: "cinema_manager",   assignedCinema: "CGV Vincom Center", createdAt: "2023-03-10", isActive: true  },
  { id: "S003", name: "Trần Hỗ Trợ",     email: "support@luxecinema.vn", role: "customer_support", createdAt: "2023-06-15", isActive: true  },
  { id: "S004", name: "Lê Văn Quản",     email: "lequan@luxecinema.vn",  role: "cinema_manager",   assignedCinema: "Galaxy Nguyễn Du",  createdAt: "2024-01-20", isActive: false },
];
