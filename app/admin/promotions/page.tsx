import { Metadata } from "next";
import PromotionDashboard from "@/features/admin/components/promotions/promotion-dashboard";

export const metadata: Metadata = {
  title: "Quản lý Khuyến Mãi – LUXE CINEMA",
  description: "Tạo và quản lý mã giảm giá, điều kiện sử dụng và voucher.",
};

export default function PromotionsPage() {
  return <PromotionDashboard />;
}
