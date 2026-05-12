import { Metadata } from "next";
import AdminLogin from "@/features/admin/components/auth/admin-login";

export const metadata: Metadata = {
  title: "Đăng nhập Quản trị – LUXE CINEMA",
  description: "Đăng nhập vào hệ thống quản trị LUXE CINEMA.",
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}
