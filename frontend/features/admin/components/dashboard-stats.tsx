"use client";

import React from "react";
import { TrendingUp, Ticket, Film, Users } from "lucide-react";
import { Stats } from "@/types";

interface DashboardStatsProps {
  stats: Stats | null;
}

const cards = (stats: Stats | null) => [
  {
    title: "Total Revenue",
    value: stats ? `${stats.totalRevenue?.toLocaleString("vi-VN")}đ` : "—",
    icon: TrendingUp,
    color: "#c9a84c",
  },
  {
    title: "Total Bookings",
    value: stats?.totalBookings ?? "—",
    icon: Ticket,
    color: "#60a5fa",
  },
  {
    title: "Movies",
    value: stats?.totalMovies ?? "—",
    icon: Film,
    color: "#a78bfa",
  },
  {
    title: "Customers",
    value: stats?.totalUsers ?? "—",
    icon: Users,
    color: "#34d399",
  },
];

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards(stats).map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: `${card.color}14`,
                  border: `1px solid ${card.color}30`,
                }}
              >
                <Icon size={16} style={{ color: card.color }} />
              </div>
            </div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-1"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {card.title}
            </p>
            <h3 className="text-xl font-bold text-white truncate">{card.value}</h3>
          </div>
        );
      })}
    </div>
  );
}
