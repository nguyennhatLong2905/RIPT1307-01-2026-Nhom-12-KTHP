export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  order: number;
  isActive: boolean;
}

export interface ContactInfo {
  companyName: string;
  address: string;
  hotline: string;
  email: string;
  facebook: string;
  instagram: string;
  footer: string;
  privacyPolicy: string;
  termsOfService: string;
}

export interface PointConfig {
  spendPerPoint: number;
  pointExpiryDays: number;
  redeemRatio: number;
}

export interface PaymentGateway {
  id: string;
  name: string;
  provider: string;
  apiKey: string;
  isActive: boolean;
  sandbox: boolean;
}

export type AuditAction = "create" | "update" | "delete" | "lock" | "unlock";
export type AuditModule = "movies" | "cinemas" | "showtimes" | "bookings" | "users" | "promotions" | "settings";

export interface AuditLog {
  id: string;
  staffId: string;
  staffName: string;
  action: AuditAction;
  module: AuditModule;
  target: string;
  detail: string;
  timestamp: string;
  ipAddress: string;
}

export const auditActionConfig: Record<AuditAction, { label: string; color: string; bg: string }> = {
  create:  { label: "Thêm mới", color: "#10B981", bg: "rgba(16,185,129,0.12)"  },
  update:  { label: "Cập nhật", color: "#60A5FA", bg: "rgba(96,165,250,0.12)"  },
  delete:  { label: "Xóa",      color: "#EF4444", bg: "rgba(239,68,68,0.12)"   },
  lock:    { label: "Khóa",     color: "#F59E0B", bg: "rgba(245,158,11,0.12)"  },
  unlock:  { label: "Mở khóa", color: "#A78BFA", bg: "rgba(167,139,250,0.12)" },
};

export const auditModuleConfig: Record<AuditModule, { label: string }> = {
  movies:     { label: "Phim"        },
  cinemas:    { label: "Cụm Rạp"    },
  showtimes:  { label: "Lịch Chiếu" },
  bookings:   { label: "Đặt Vé"     },
  users:      { label: "Người Dùng" },
  promotions: { label: "Khuyến Mãi" },
  settings:   { label: "Cài Đặt"   },
};

export const mockBanners: Banner[] = [
  { id: "B001", title: "Avengers: Endgame – Siêu Anh Hùng Trở Lại", imageUrl: "/images/mai.jpg",           linkUrl: "/movies/1", order: 1, isActive: true  },
  { id: "B002", title: "Mai – Bom Tấn Tết 2024",                     imageUrl: "/images/mai.jpg",           linkUrl: "/movies/3", order: 2, isActive: true  },
  { id: "B003", title: "Mưa Đỏ – Sắp Ra Mắt",                       imageUrl: "/images/mưa đỏ.jpg",       linkUrl: "/movies/8", order: 3, isActive: false },
];

export const mockContactInfo: ContactInfo = {
  companyName: "LUXE CINEMA JSC",
  address: "72 Lê Thánh Tôn, Quận 1, TP.HCM",
  hotline: "1900 6868",
  email: "support@luxecinema.vn",
  facebook: "https://facebook.com/luxecinema",
  instagram: "https://instagram.com/luxecinema",
  footer: "© 2026 LUXE CINEMA. All rights reserved.",
  privacyPolicy: "Chúng tôi cam kết bảo mật thông tin cá nhân của quý khách...",
  termsOfService: "Điều khoản sử dụng dịch vụ LUXE CINEMA...",
};

export const mockPointConfig: PointConfig = {
  spendPerPoint: 10000,
  pointExpiryDays: 365,
  redeemRatio: 1000,
};

export const mockGateways: PaymentGateway[] = [
  { id: "GW001", name: "VNPay",    provider: "vnpay",    apiKey: "VNP_••••••••••••••••", isActive: true,  sandbox: false },
  { id: "GW002", name: "MoMo",     provider: "momo",     apiKey: "MOMO_••••••••••••••••", isActive: true,  sandbox: false },
  { id: "GW003", name: "ZaloPay", provider: "zalopay",  apiKey: "ZLP_••••••••••••••••",  isActive: false, sandbox: true  },
];

export const mockAuditLogs: AuditLog[] = [
  { id: "AL001", staffId: "S001", staffName: "Admin Hệ Thống",  action: "create", module: "movies",    target: "Phim: Mưa Đỏ",         detail: "Thêm mới phim Mưa Đỏ",                     timestamp: "12/05/2026 09:15:22", ipAddress: "192.168.1.1"  },
  { id: "AL002", staffId: "S002", staffName: "Nguyễn Quản Lý",  action: "update", module: "showtimes", target: "Suất: P3 - 10:00",       detail: "Dời lịch chiếu từ 10:00 sang 11:00",        timestamp: "12/05/2026 09:32:11", ipAddress: "192.168.1.5"  },
  { id: "AL003", staffId: "S003", staffName: "Trần Hỗ Trợ",     action: "lock",   module: "users",     target: "KH: Lê Hoàng Cường",     detail: "Khóa tài khoản do vi phạm chính sách",      timestamp: "12/05/2026 10:01:45", ipAddress: "192.168.1.12" },
  { id: "AL004", staffId: "S001", staffName: "Admin Hệ Thống",  action: "create", module: "promotions", target: "Mã: LUXE20",            detail: "Tạo mã giảm giá LUXE20 - 20% cho VIP",     timestamp: "12/05/2026 10:20:33", ipAddress: "192.168.1.1"  },
  { id: "AL005", staffId: "S002", staffName: "Nguyễn Quản Lý",  action: "delete", module: "cinemas",   target: "Rạp: Dcine Nguyễn Kiệm", detail: "Xóa cụm rạp Dcine Nguyễn Kiệm",            timestamp: "12/05/2026 10:45:00", ipAddress: "192.168.1.5"  },
  { id: "AL006", staffId: "S003", staffName: "Trần Hỗ Trợ",     action: "update", module: "bookings",  target: "BK-2024-003",            detail: "Xác nhận hoàn tiền 560,000đ cho Lê H. Cường", timestamp: "12/05/2026 11:05:17", ipAddress: "192.168.1.12" },
  { id: "AL007", staffId: "S001", staffName: "Admin Hệ Thống",  action: "update", module: "settings",  target: "Cấu hình điểm thưởng",  detail: "Thay đổi tỷ lệ: 10,000đ = 1 điểm",         timestamp: "12/05/2026 11:30:00", ipAddress: "192.168.1.1"  },
  { id: "AL008", staffId: "S002", staffName: "Nguyễn Quản Lý",  action: "create", module: "showtimes", target: "Tự động: P1-P3 Avengers", detail: "Tạo 9 suất chiếu tự động cho Avengers",    timestamp: "12/05/2026 13:00:05", ipAddress: "192.168.1.5"  },
];
