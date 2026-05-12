"use client";

import React from "react";
import { 
  TrendingUp, 
  Ticket, 
  Film, 
  Users
} from "lucide-react";
import { Stats } from "@/types";

interface DashboardStatsProps {
  stats: Stats | null;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const cards = [
    {
      title: "Tổng doanh thu",
      value: stats ? `${stats.totalRevenue?.toLocaleString("vi-VN")}đ` : "---",
      icon: TrendingUp,
    },
    {
      title: "Tổng lượt đặt vé",
      value: stats?.totalBookings || "0",
      icon: Ticket,
    },
    {
      title: "Phim đang chiếu",
      value: stats?.totalMovies || "0",
      icon: Film,
    },
    {
      title: "Khách hàng",
      value: stats?.totalUsers || "0",
      icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div 
          key={card.title}
          className="bg-[#0d0d0d] border border-[#c9a84c]/10 p-6 rounded-2xl hover:border-[#c9a84c]/50 transition-all duration-500 group relative overflow-hidden"
        >
          {/* Subtle background glow on hover */}
          <div className="absolute inset-0 bg-[#c9a84c]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20`}>
                <card.icon size={24} />
              </div>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">{card.title}</p>
              <h3 className="text-2xl font-bold mt-1 group-hover:text-[#c9a84c] transition-colors">{card.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
