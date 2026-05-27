"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Booking } from "@/types";
import { ArrowRight } from "lucide-react";

interface AdminChartsProps {
  revenueByMonth: Record<string, number>;
  recentBookings: Booking[];
}

interface ChartDataItem {
  label: string;
  revenue: number;
  isMock: boolean;
  isFuture: boolean;
  height: number;
}

export default function AdminCharts({ revenueByMonth, recentBookings }: AdminChartsProps) {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const getRevenueData = (): ChartDataItem[] => {
    // Hiển thị 3 tháng trước, tháng hiện tại và 2 tháng tiếp theo
    const now = new Date();
    const displayMonths = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 3 + i, 1);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      return `${year}-${month}`;
    });

    const mockValues: Record<string, number> = {
      "0": 1250000, "1": 2100000, "2": 1800000, "3": 3500000, "4": 4200000, "5": 5100000
    };

    const currentMonthKey = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;

    const displayData = displayMonths.map((monthKey, index) => {
      const realRevenue = revenueByMonth[monthKey] || 0;
      
      // Các tháng tương lai hoặc tháng hiện tại/quá khứ chưa có doanh thu đều dùng mock
      const isFuture = monthKey > currentMonthKey;
      const isMock = realRevenue === 0 || isFuture;
      
      const revenue = isMock ? (mockValues[index] || 1000000) : realRevenue;
      const label = `T${monthKey.split("-")[1]}`;
      
      return { label, revenue, isMock, isFuture };
    });

    const maxRevenue = Math.max(...displayData.map(d => d.revenue), 100000);
    
    return displayData.map(d => ({
      ...d,
      height: Math.max((d.revenue / maxRevenue) * 100, 8)
    })) as ChartDataItem[];
  };

  const data = getRevenueData();

  const cardStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
      <div className="rounded-2xl p-6 flex flex-col min-h-[340px]" style={cardStyle}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-white">Monthly Revenue</h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              Revenue & Projections
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: "#c9a84c" }} />
            Revenue (VND)
          </div>
        </div>

        <div className="flex-1 flex items-end gap-3 px-1 relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }} />
            ))}
          </div>

          {data.map((item) => (
            <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group/bar relative z-10">
              <div className="relative w-full flex flex-col items-center justify-end" style={{ height: "220px" }}>
                <div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none whitespace-nowrap z-20"
                  style={{ background: "#c9a84c", color: "#000" }}
                >
                  {item.revenue.toLocaleString()}đ {item.isMock ? "(Dự tính)" : ""}
                </div>

                <div
                  className="w-full max-w-[28px] rounded-t-lg transition-all duration-700 ease-out relative overflow-hidden"
                  style={{
                    height: isLoaded ? `${item.height}%` : "0%",
                    background: item.isMock 
                      ? "linear-gradient(to top, rgba(201,168,76,0.2), rgba(232,199,106,0.2))" 
                      : "linear-gradient(to top, #c9a84c, #e8c76a)",
                    border: item.isMock ? "1px dashed rgba(201,168,76,0.3)" : "none",
                    opacity: item.isMock ? 0.5 : 0.85,
                  }}
                >
                  {item.isMock && (
                    <div className="absolute inset-0 opacity-20" style={{ background: "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px)" }} />
                  )}
                </div>
              </div>
              <span
                className="text-[9px] font-medium uppercase"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-6 flex flex-col" style={cardStyle}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-white">Recent Bookings</h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              Latest transactions
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {recentBookings && recentBookings.length > 0 ? (
            recentBookings.slice(0, 6).map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 rounded-xl transition-colors"
                style={{ background: "rgba(255,255,255,0.03)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: "rgba(201,168,76,0.12)",
                      color: "#c9a84c",
                    }}
                  >
                    {booking.user.fullName?.charAt(0) || "U"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white/85 truncate">
                      {booking.user.fullName}
                    </div>
                    <div className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {booking.showtime?.movie?.title}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-xs font-bold" style={{ color: "#c9a84c" }}>
                    +{booking.totalAmount?.toLocaleString()}đ
                  </div>
                  <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {booking.bookingDate
                      ? new Date(booking.bookingDate).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                      : "--:--"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center py-10">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                No recent bookings
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => router.push("/admin/tickets")}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all"
          style={{
            color: "rgba(201,168,76,0.7)",
            border: "1px solid rgba(201,168,76,0.15)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#c9a84c";
            e.currentTarget.style.background = "rgba(201,168,76,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(201,168,76,0.7)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          View all tickets
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
