"use client";

import React, { useState, useEffect } from "react";
import { DashboardStats, AdminCharts } from "@/features/admin";
import { adminService } from "@/features/admin/services/admin-service";
import { Stats } from "@/types";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    }
  };

  return (
    <div className="py-4 space-y-8 animate-in fade-in duration-500">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold italic tracking-tighter">
          Chào mừng trở lại, <span style={{ color: "#c9a84c" }} className="italic underline decoration-[#c9a84c]/20 underline-offset-8">Admin!</span>
        </h1>
        <p className="text-white/40 mt-3 font-medium">Dưới đây là tổng quan về hoạt động của <span className="text-white">Luxe Cinema</span> hôm nay.</p>
      </div>
      
      <DashboardStats stats={stats} />
      
      <AdminCharts bookings={stats?.lichSuDatVe || []} />
    </div>
  );
}
