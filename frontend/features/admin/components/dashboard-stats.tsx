"use client";

import React from "react";
import { 
  TrendingUp, 
  Ticket, 
  Film, 
  Users,
  ArrowUpRight,
  ArrowDownRight
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
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      trend: "+12.5%",
      isPositive: true,
    },
    {
      title: "Tổng lượt đặt vé",
      value: stats?.totalBookings || "0",
      icon: Ticket,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      trend: "+8.2%",
      isPositive: true,
    },
    {
      title: "Phim đang chiếu",
      value: stats?.totalMovies || "0",
      icon: Film,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      trend: "0%",
      isPositive: true,
    },
    {
      title: "Khách hàng",
      value: stats?.totalUsers || "0",
      icon: Users,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      trend: "+5.1%",
      isPositive: true,
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
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-white/5 ${card.isPositive ? "text-emerald-400" : "text-red-400"}`}>
                {card.trend}
                {card.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
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
