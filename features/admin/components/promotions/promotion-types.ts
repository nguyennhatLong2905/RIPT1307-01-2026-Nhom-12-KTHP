import { MembershipTier } from "../users/user-types";

export type DiscountType = "percent" | "fixed";
export type CouponScope = "all" | "ticket_only";
export type CouponStatus = "active" | "expired" | "disabled";

export interface Coupon {
  id: string;
  code: string;
  name: string;
  discountType: DiscountType;
  discountValue: number;
  scope: CouponScope;
  minOrderValue: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  applicableTiers: MembershipTier[];
  applicableCinemas: string[];
  status: CouponStatus;
}

export const couponStatusConfig: Record<CouponStatus, { label: string; color: string; bg: string; glow: string }> = {
  active:   { label: "Đang hoạt động", color: "#10B981", bg: "rgba(16,185,129,0.12)",  glow: "#10B981" },
  expired:  { label: "Hết hạn",        color: "#8B949E", bg: "rgba(139,148,158,0.12)", glow: "#8B949E" },
  disabled: { label: "Đã tắt",         color: "#EF4444", bg: "rgba(239,68,68,0.12)",   glow: "#EF4444" },
};

export const ALL_CINEMAS = ["Tất cả rạp", "CGV Vincom Center", "Galaxy Nguyễn Du", "Lotte Landmark", "BHD Star Bitexco"];
export const ALL_TIERS: MembershipTier[] = ["Standard", "VIP", "VVIP"];

export const mockCoupons: Coupon[] = [
  {
    id: "CP001", code: "LUXE20", name: "Giảm 20% cho thành viên VIP",
    discountType: "percent", discountValue: 20, scope: "ticket_only",
    minOrderValue: 200000, maxDiscount: 100000,
    startDate: "2026-05-01", endDate: "2026-05-31",
    usageLimit: 500, usedCount: 128,
    applicableTiers: ["VIP", "VVIP"], applicableCinemas: ["Tất cả rạp"],
    status: "active",
  },
  {
    id: "CP002", code: "SAVE50K", name: "Giảm 50,000đ đơn từ 300K",
    discountType: "fixed", discountValue: 50000, scope: "ticket_only",
    minOrderValue: 300000,
    startDate: "2026-05-10", endDate: "2026-06-10",
    usageLimit: 1000, usedCount: 342,
    applicableTiers: ["Standard", "VIP", "VVIP"], applicableCinemas: ["CGV Vincom Center", "Galaxy Nguyễn Du"],
    status: "active",
  },
  {
    id: "CP003", code: "WELCOME10", name: "Chào mừng thành viên mới",
    discountType: "percent", discountValue: 10, scope: "all",
    minOrderValue: 0, maxDiscount: 50000,
    startDate: "2026-01-01", endDate: "2026-04-30",
    usageLimit: 200, usedCount: 200,
    applicableTiers: ["Standard"], applicableCinemas: ["Tất cả rạp"],
    status: "expired",
  },
  {
    id: "CP004", code: "VVIPONLY", name: "Đặc quyền VVIP - Giảm 30%",
    discountType: "percent", discountValue: 30, scope: "ticket_only",
    minOrderValue: 500000, maxDiscount: 200000,
    startDate: "2026-05-01", endDate: "2026-12-31",
    usageLimit: 100, usedCount: 15,
    applicableTiers: ["VVIP"], applicableCinemas: ["Tất cả rạp"],
    status: "disabled",
  },
];
