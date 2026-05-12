import { Metadata } from "next";
import { AdminLayoutWrapper } from "@/features/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard - LUXE CINEMA",
  description: "Hệ thống quản trị LUXE CINEMA",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}

