"use client";

import React, { useState, useEffect } from "react";
import { AdminSidebar } from "@/features/admin";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/lib/auth-utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra quyền truy cập ADMIN thực tế từ JWT Token
    if (!isAdmin()) {
      console.warn("Truy cập bị từ chối: Yêu cầu quyền ADMIN");
      router.push("/");
    } else {
      setIsAuthorized(true);
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#c9a84c]/20 border-t-[#c9a84c] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
