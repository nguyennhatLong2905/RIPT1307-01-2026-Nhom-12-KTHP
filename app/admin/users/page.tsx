import { Metadata } from "next";
import UserDashboard from "@/features/admin/components/users/user-dashboard";

export const metadata: Metadata = {
  title: "Quản lý Người Dùng – LUXE CINEMA",
  description: "Quản lý khách hàng, hạng thành viên và phân quyền nhân sự.",
};

export default function UsersPage() {
  return <UserDashboard />;
}
