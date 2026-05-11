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
        type: "revenue"
    },
    {
        title: "Vé Đã Bán",
        value: "45,231",
        trend: "+5.1%",
        trendUp: true,
        icon: Ticket,
        description: "So với tháng trước",
        type: "tickets"
    },
    {
        title: "Khách Hàng Mới",
        value: "2,304",
        trend: "-2.3%",
        trendUp: false,
        icon: Users,
        description: "So với tháng trước",
        type: "customers"
    },
    {
        title: "Tỷ Lệ Lấp Đầy",
        value: "78%",
        trend: "+8.4%",
        trendUp: true,
        icon: TrendingUp,
        description: "Trung bình toàn hệ thống",
        type: "occupancy"
    },
];

export default function DashboardMetrics() {
    const [selectedMetric, setSelectedMetric] = useState<any>(null);

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric, index) => (
                    <div 
                        key={index} 
                        onClick={() => setSelectedMetric(metric)}
                        className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm cursor-pointer hover:bg-slate-800/80 transition-colors relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/0 via-slate-800/10 to-slate-800/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-slate-400">{metric.title}</h3>
                                <metric.icon className="h-4 w-4 text-slate-500" />
                            </div>
                            <div className="mt-4 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-white">{metric.value}</span>
                                <span className={`text-xs font-medium ${metric.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                                    {metric.trend}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-500">{metric.description}</p>
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
