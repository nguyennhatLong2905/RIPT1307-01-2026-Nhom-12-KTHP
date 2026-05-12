import { Metadata } from "next";
import SettingsDashboard from "@/features/admin/components/settings/settings-dashboard";

export const metadata: Metadata = {
  title: "Cấu hình Hệ thống – LUXE CINEMA",
  description: "Cấu hình giao diện, vận hành, cổng thanh toán và nhật ký hệ thống.",
};

export default function SettingsPage() {
  return <SettingsDashboard />;
}
