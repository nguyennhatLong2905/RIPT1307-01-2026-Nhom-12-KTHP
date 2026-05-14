"use client";

import React, { useState, useEffect } from "react";
import { DashboardStats, AdminCharts } from "@/features/admin";
import { adminService } from "@/features/admin/services/admin-service";
import { Stats, Booking } from "@/types";

export default function AdminOverviewPage() {
  const [summaryStats, setSummaryStats] = useState<Stats | null>(null);
  const [revenueByMonth, setRevenueByMonth] = useState<Record<string, number>>({});
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Tải song song và độc lập từng phần dữ liệu để trang hiển thị tiệm tiến ngay lập tức
    fetchSummary();
    fetchMonthlyRevenue();
    fetchRecentBookings();
  }, []);

  const fetchSummary = async () => {
    try {
      const data = await adminService.getSummaryStats();
      setSummaryStats({
        totalRevenue: data.totalRevenue || 0,
        totalBookings: data.totalBookings || 0,
        totalMovies: data.totalMovies || 0,
        totalUsers: data.totalCustomers || 0,
        revenueByMonth: {},
        recentBookings: []
      });
    } catch (error) {
      console.error("Lỗi khi tải tổng quan:", error);
    }
  };

  const fetchMonthlyRevenue = async () => {
    try {
      const data = await adminService.getMonthlyRevenue();
      setRevenueByMonth(data || {});
    } catch (error) {
      console.error("Lỗi khi tải biểu đồ doanh thu:", error);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const data = await adminService.getRecentBookings();
      setRecentBookings(data || []);
    } catch (error) {
      console.error("Lỗi khi tải giao dịch gần đây:", error);
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
      
      <DashboardStats stats={summaryStats} />
      
      <AdminCharts 
        revenueByMonth={revenueByMonth} 
        recentBookings={recentBookings} 
      />
    </div>
  );
}
