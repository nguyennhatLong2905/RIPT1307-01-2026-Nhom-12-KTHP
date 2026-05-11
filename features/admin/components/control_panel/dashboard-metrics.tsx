"use client";

import { useState } from "react";
import { DollarSign, Ticket, Users, TrendingUp } from "lucide-react";
import MetricDetailsModal from "./metric-details";

const metrics = [
    {
        title: "Tổng Doanh Thu",
        value: "2.450.000.000đ",
        trend: "+15.2%",
        trendUp: true,
        icon: DollarSign,
        description: "So với tháng trước",
        type: "revenue",
        accentColor: "#7C3AED",
        glowColor: "rgba(124,58,237,0.4)",
    },
    {
        title: "Vé Đã Bán",
        value: "45,231",
        trend: "+5.1%",
        trendUp: true,
        icon: Ticket,
        description: "So với tháng trước",
        type: "tickets",
        accentColor: "#2DD4BF",
        glowColor: "rgba(45,212,191,0.4)",
    },
    {
        title: "Khách Hàng Mới",
        value: "2,304",
        trend: "-2.3%",
        trendUp: false,
        icon: Users,
        description: "So với tháng trước",
        type: "customers",
        accentColor: "#7C3AED",
        glowColor: "rgba(124,58,237,0.4)",
    },
    {
        title: "Tỷ Lệ Lấp Đầy",
        value: "78%",
        trend: "+8.4%",
        trendUp: true,
        icon: TrendingUp,
        description: "Trung bình toàn hệ thống",
        type: "occupancy",
        accentColor: "#2DD4BF",
        glowColor: "rgba(45,212,191,0.4)",
    },
];

export default function DashboardMetrics() {
    const [selectedMetric, setSelectedMetric] = useState<any>(null);

    return (
        <>
            <div>
                <h1
                    className="text-3xl font-bold tracking-tight"
                    style={{ color: "#FFFFFF" }}
                >
                    Bảng Điều Khiển
                </h1>
                <p className="text-sm mt-1" style={{ color: "#8B949E" }}>
                    Tổng quan về tình hình kinh doanh và hoạt động của hệ thống rạp.
                </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedMetric(metric)}
                        className="relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 group"
                        style={{
                            background: "#161B22",
                            border: "1px solid #1F2532",
                            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.5)",
                            padding: "24px",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = metric.accentColor + "60";
                            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 30px 0 rgba(0,0,0,0.6), 0 0 20px 0 ${metric.glowColor}`;
                            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.borderColor = "#1F2532";
                            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px 0 rgba(0,0,0,0.5)";
                            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                        }}
                    >
                        <div
                            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl pointer-events-none"
                            style={{ background: metric.accentColor, transform: "translate(40%, -40%)" }}
                        />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-sm font-medium" style={{ color: "#8B949E" }}>
                                    {metric.title}
                                </h3>
                                <div
                                    className="h-9 w-9 rounded-xl flex items-center justify-center"
                                    style={{
                                        background: `linear-gradient(135deg, ${metric.accentColor}25, ${metric.accentColor}10)`,
                                        border: `1px solid ${metric.accentColor}40`,
                                    }}
                                >
                                    <metric.icon
                                        className="h-4 w-4"
                                        style={{
                                            color: metric.accentColor,
                                            filter: `drop-shadow(0 0 4px ${metric.glowColor})`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-end gap-3 mb-2">
                                <span
                                    className="text-2xl font-bold"
                                    style={{
                                        color: "#FFFFFF",
                                        textShadow: `0 0 20px ${metric.glowColor}`,
                                    }}
                                >
                                    {metric.value}
                                </span>
                                <span
                                    className="text-sm font-semibold mb-0.5"
                                    style={{ color: metric.trendUp ? "#2DD4BF" : "#F43F5E" }}
                                >
                                    {metric.trend}
                                </span>
                            </div>

                            <p className="text-xs" style={{ color: "#8B949E" }}>
                                {metric.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <MetricDetailsModal
                isOpen={!!selectedMetric}
                onClose={() => setSelectedMetric(null)}
                metric={selectedMetric}
            />
        </>
    );
}
