"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar, Topbar } from "@/features/admin";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("admin_token");
    if (!token && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isLoginPage, router]);

  if (!mounted) return null; // Prevent hydration mismatch

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden text-white" style={{ background: "#0B0E14" }}>
      <Sidebar />
      <div className="flex flex-1 flex-col ml-64">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 pt-22" style={{ background: "#0B0E14" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
