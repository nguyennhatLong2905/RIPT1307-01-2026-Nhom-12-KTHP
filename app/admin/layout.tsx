import { Metadata } from "next";
import { Sidebar, Topbar } from "@/features/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard - LUXE CINEMA",
  description: "Hệ thống quản trị LUXE CINEMA",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <Sidebar />
      <div className="flex flex-1 flex-col ml-64">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
