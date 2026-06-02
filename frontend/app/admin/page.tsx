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
        recentBookings: [],
      });
    } catch (error) {
      console.error("Error loading summary:", error);
    }
  };

  const fetchMonthlyRevenue = async () => {
    try {
      const data = await adminService.getMonthlyRevenue();
      setRevenueByMonth(data || {});
    } catch (error) {
      console.error("Error loading revenue chart:", error);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const data = await adminService.getRecentBookings();
      setRecentBookings(data || []);
    } catch (error) {
      console.error("Error loading recent bookings:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
          Overview of Luxe Cinema operations
        </p>
      </div>

      <DashboardStats stats={summaryStats} />
      <AdminCharts revenueByMonth={revenueByMonth} recentBookings={recentBookings} />
    </div>
  );
}
