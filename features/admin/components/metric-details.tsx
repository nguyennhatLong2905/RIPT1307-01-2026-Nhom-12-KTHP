"use client";

import { useState } from "react";
import { X, ArrowLeft, Calendar, MapPin } from "lucide-react";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MetricDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    metric: {
        title: string;
        value: string;
        trend: string;
        trendUp: boolean;
        type: string; // 'revenue' | 'tickets' | 'customers' | 'occupancy'
    } | null;
}
const generate24hData = (base: number, volatility: number) => {
    // 1. Khởi tạo 13 mốc thời gian (0h đến 24h), giá trị mặc định là 0 để tránh đứt đoạn
    const result = Array.from({ length: 13 }).map((_, i) => ({
        name: `${i * 2}h`,
        value: 0
    }));

    // Giả lập danh sách các giao dịch (transactions) ngẫu nhiên trong 24h
    const transactions: { timestamp: Date; amount: number }[] = [];
    const numTransactions = 50 + Math.floor(Math.random() * 30); // 50-80 giao dịch
    const now = new Date();
    
    for (let i = 0; i < numTransactions; i++) {
        const hour = Math.floor(Math.random() * 24);
        const minute = Math.floor(Math.random() * 60);
        
        let multiplier = 1;
        if (hour >= 18 && hour <= 22) multiplier = 1.5;
        else if (hour >= 8 && hour <= 12) multiplier = 0.8;
        else if (hour >= 0 && hour < 8) multiplier = 0.1;
        
        // Tạo khoảng trống (0) vào khung giờ đêm
        if (hour >= 0 && hour < 8 && Math.random() > 0.3) continue;

        // Chia nhỏ base và volatility để mỗi giao dịch chỉ chiếm một phần
        const amount = Math.max(0, (base / 10) * multiplier + Math.sin(hour) * (volatility / 5));
        const txnDate = new Date(now);
        txnDate.setHours(hour, minute, 0, 0);
        
        transactions.push({ timestamp: txnDate, amount });
    }

    // 2. Logic Data Binning: Phân bổ giao dịch vào các mốc chẵn kế tiếp
    transactions.forEach(txn => {
        const hours = txn.timestamp.getHours();
        const minutes = txn.timestamp.getMinutes();
        const seconds = txn.timestamp.getSeconds();
        
        let binIndex = 0;
        if (hours === 0 && minutes === 0 && seconds === 0) {
            binIndex = 0; // Mốc 0h
        } else {
            // Đổi ra giờ thập phân, chia 2 và làm tròn lên
            const exactTimeInHours = hours + minutes / 60 + seconds / 3600;
            binIndex = Math.ceil(exactTimeInHours / 2);
        }
        
        if (binIndex > 12) binIndex = 12; // Giới hạn mốc tối đa là 24h (index 12)
        
        result[binIndex].value += Math.floor(txn.amount);
    });

    return result;
};

const ticketsMock = {
    realtime: generate24hData(150, 50),
    day: [
        { name: "T2", value: 1200 }, { name: "T3", value: 1500 }, { name: "T4", value: 1800 },
        { name: "T5", value: 1400 }, { name: "T6", value: 2500 }, { name: "T7", value: 3200 }, { name: "CN", value: 3500 },
    ],
    week: [
        { name: "Tuần 1", value: 8500 }, { name: "Tuần 2", value: 9200 },
        { name: "Tuần 3", value: 11000 }, { name: "Tuần 4", value: 13500 },
    ],
    month: [
        { name: "T1", value: 21000 }, { name: "T2", value: 24500 }, { name: "T3", value: 28000 },
        { name: "T4", value: 22000 }, { name: "T5", value: 35000 }, { name: "T6", value: 42000 },
        { name: "T7", value: 45000 }, { name: "T8", value: 51000 }, { name: "T9", value: 48000 },
        { name: "T10", value: 55000 }, { name: "T11", value: 62000 }, { name: "T12", value: 75000 },
    ],
    year: [
        { name: "2020", value: 150000 }, { name: "2021", value: 120000 },
        { name: "2022", value: 280000 }, { name: "2023", value: 350000 }, { name: "2024", value: 480000 },
    ],
};

const calculateOccupancy = (ticketsArray: any[], capacity: number) => {
    return ticketsArray.map(item => ({
        ...item,
        value: item.value === null ? null : Math.min(100, Math.round((item.value / capacity) * 100))
    }));
};

const mockDataMap: Record<string, any> = {
    revenue: {
        realtime: generate24hData(10000000, 3000000),
        day: [
            { name: "T2", value: 120000000 }, { name: "T3", value: 150000000 }, { name: "T4", value: 180000000 },
            { name: "T5", value: 140000000 }, { name: "T6", value: 250000000 }, { name: "T7", value: 320000000 }, { name: "CN", value: 350000000 },
        ],
        week: [
            { name: "Tuần 1", value: 850000000 }, { name: "Tuần 2", value: 920000000 },
            { name: "Tuần 3", value: 1100000000 }, { name: "Tuần 4", value: 1350000000 },
        ],
        month: [
            { name: "T1", value: 2100000000 }, { name: "T2", value: 2450000000 }, { name: "T3", value: 2800000000 },
            { name: "T4", value: 2200000000 }, { name: "T5", value: 3500000000 }, { name: "T6", value: 4200000000 },
            { name: "T7", value: 4500000000 }, { name: "T8", value: 5100000000 }, { name: "T9", value: 4800000000 },
            { name: "T10", value: 5500000000 }, { name: "T11", value: 6200000000 }, { name: "T12", value: 7500000000 },
        ],
        year: [
            { name: "2020", value: 15000000000 }, { name: "2021", value: 12000000000 },
            { name: "2022", value: 28000000000 }, { name: "2023", value: 35000000000 }, { name: "2024", value: 48000000000 },
        ],
    },
    tickets: ticketsMock,
    customers: {
        realtime: generate24hData(20, 10),
        day: [
            { name: "T2", value: 80 }, { name: "T3", value: 95 }, { name: "T4", value: 110 },
            { name: "T5", value: 90 }, { name: "T6", value: 150 }, { name: "T7", value: 210 }, { name: "CN", value: 240 },
        ],
        week: [
            { name: "Tuần 1", value: 550 }, { name: "Tuần 2", value: 620 },
            { name: "Tuần 3", value: 800 }, { name: "Tuần 4", value: 950 },
        ],
        month: [
            { name: "T1", value: 2100 }, { name: "T2", value: 2450 }, { name: "T3", value: 2800 },
            { name: "T4", value: 2200 }, { name: "T5", value: 3500 }, { name: "T6", value: 4200 },
            { name: "T7", value: 4500 }, { name: "T8", value: 5100 }, { name: "T9", value: 4800 },
            { name: "T10", value: 5500 }, { name: "T11", value: 6200 }, { name: "T12", value: 7500 },
        ],
        year: [
            { name: "2020", value: 15000 }, { name: "2021", value: 12000 },
            { name: "2022", value: 28000 }, { name: "2023", value: 35000 }, { name: "2024", value: 48000 },
        ],
    },
    occupancy: {
        realtime: calculateOccupancy(ticketsMock.realtime, 350),
        day: calculateOccupancy(ticketsMock.day, 4500),
        week: calculateOccupancy(ticketsMock.week, 31500),
        month: calculateOccupancy(ticketsMock.month, 135000),
        year: calculateOccupancy(ticketsMock.year, 1642500),
    }
};

const CustomTooltip = ({ active, payload, label, title, metricType }: any) => {
    if (active && payload && payload.length) {
        let valueStr = payload[0].value.toLocaleString();
        let accentColor = "#2DD4BF";
        if (metricType === 'revenue') {
            valueStr += " đ";
            accentColor = "#7C3AED";
        } else if (metricType === 'tickets') {
            valueStr += " vé";
            accentColor = "#2DD4BF";
        } else if (metricType === 'occupancy') {
            valueStr += "%";
        }

        return (
            <div style={{
                background: "#0B0E14",
                border: `1px solid ${accentColor}60`,
                borderRadius: "10px",
                padding: "10px 14px",
                boxShadow: `0 0 20px ${accentColor}30`,
            }}>
                <p style={{ color: "#8B949E", fontSize: "12px", marginBottom: "4px" }}>{label}</p>
                <p style={{ color: accentColor, fontWeight: 700, fontSize: "16px" }}>
                    {valueStr}
                </p>
                <p style={{ color: "#8B949E", fontSize: "11px", marginTop: "4px" }}>{title}</p>
            </div>
        );
    }
    return null;
};
const GenericChart = ({ data, title, metricType, heightClass = "h-[300px]" }: any) => {
    const isRevenue = metricType === 'revenue';
    const isTickets = metricType === 'tickets';

    return (
        <div
            className="flex flex-col w-full"
            style={{
                background: "#161B22",
                border: "1px solid #1F2532",
                boxShadow: "0 4px 20px 0 rgba(0,0,0,0.5)",
                borderRadius: "16px",
                padding: "24px",
            }}
        >
            <h3 className="text-base font-semibold mb-4" style={{ color: "#FFFFFF" }}>{title}</h3>
            <div className={`w-full ${heightClass}`}>
                <ResponsiveContainer width="100%" height="100%">
                    {isTickets ? (
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="neonBarV" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#7C3AED" />
                                    <stop offset="100%" stopColor="#2DD4BF" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1F2532" vertical={false} />
                            <XAxis dataKey="name" stroke="#8B949E" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis hide={true} />
                            <Tooltip content={<CustomTooltip title={title} metricType={metricType} />} cursor={{ fill: 'rgba(124,58,237,0.08)' }} />
                            <Bar dataKey="value" fill="url(#neonBarV)" radius={[4, 4, 0, 0]} barSize={28} />
                        </BarChart>
                    ) : (
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id={`neonLine_${metricType}`} x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#7C3AED" />
                                    <stop offset="100%" stopColor="#2DD4BF" />
                                </linearGradient>
                                <linearGradient id={`neonFill_${metricType}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1F2532" vertical={false} />
                            <XAxis dataKey="name" stroke="#8B949E" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis hide={true} />
                            <Tooltip content={<CustomTooltip title={title} metricType={metricType} />} />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={`url(#neonLine_${metricType})`}
                                strokeWidth={2.5}
                                fill={`url(#neonFill_${metricType})`}
                                dot={{ r: 3, fill: "#0B0E14", stroke: "#7C3AED", strokeWidth: 2 }}
                                activeDot={{ r: 5, fill: "#2DD4BF", stroke: "#FFFFFF", strokeWidth: 2 }}
                            />
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default function MetricDetailsModal({ isOpen, onClose, metric }: MetricDetailsProps) {
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(() => todayStr);
    const [selectedCinema, setSelectedCinema] = useState("all");

    if (!isOpen || !metric) return null;
    const metricData = mockDataMap[metric.type] || mockDataMap.revenue;
    const isToday = selectedDate === todayStr;
    const isFuture = selectedDate > todayStr;
    const cinemaMultiplier = selectedCinema === 'amc' ? 1.2 : selectedCinema === 'regal' ? 0.8 : selectedCinema === 'alamo' ? 0.9 : 1.0;
    
    const applyDataModifiers = (arr: any[]) => {
        let result = arr;
        const isRealtime = arr.length === 13;

        if (isRealtime) {
            if (isFuture) {
                result = arr.map(item => ({ ...item, value: null }));
            } else if (isToday) {
                const currentHour = new Date().getHours();
                result = arr.map(item => {
                    const hourLabel = parseInt(item.name.replace('h', ''));
                    return { ...item, value: hourLabel > currentHour ? null : item.value };
                });
            } else {
                const dateShift = parseInt(selectedDate.split('-')[2]) % 5;
                const dateMultiplier = 0.8 + (dateShift * 0.1);
                result = arr.map(item => ({
                    ...item,
                    value: item.value === null ? null : Math.round(item.value * dateMultiplier)
                }));
            }
        }

        if (cinemaMultiplier !== 1.0) {
            result = result.map(item => {
                if (item.value === null) return item;
                if (metric.type === 'occupancy') {
                    return { ...item, value: Math.min(100, Math.round(item.value * cinemaMultiplier)) };
                } else {
                    const fraction = selectedCinema === 'amc' ? 0.45 : selectedCinema === 'regal' ? 0.3 : 0.25;
                    return { ...item, value: Math.round(item.value * fraction) };
                }
            });
        }

        return result;
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-in slide-in-from-bottom-4 duration-300" style={{ background: "rgba(11,14,20,0.97)", backdropFilter: "blur(12px)" }}>
            <div className="max-w-7xl mx-auto p-6 md:p-8">
                
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                    <div>
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 transition-all duration-200 mb-6 group"
                            style={{ color: "#8B949E" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#2DD4BF"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#8B949E"; }}
                        >
                            <div
                                className="p-2 rounded-full transition-all duration-200"
                                style={{ background: "#161B22", border: "1px solid #1F2532" }}
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </div>
                            <span className="font-medium text-sm">Quay lại Bảng Điều Khiển</span>
                        </button>
                        <h1 className="text-3xl font-bold mb-2" style={{ color: "#FFFFFF" }}>Báo Cáo Chi Tiết: {metric.title}</h1>
                        <p style={{ color: "#8B949E" }}>
                            {metric.type === 'customers'
                                ? "Phân tích lượng tài khoản mới được tạo khi đăng ký xem phim."
                                : "Phân tích chuyên sâu dữ liệu với các khung thời gian linh hoạt."}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                        {/* Cinema Selector (For all metrics) */}
                        <Tabs value={selectedCinema} onValueChange={setSelectedCinema} className="w-full sm:w-auto">
                            <TabsList style={{ background: "#161B22", border: "1px solid #1F2532" }}>
                                <TabsTrigger value="all" className="data-[state=active]:text-white" style={{ color: "#8B949E" }}
                                    data-state-active-style={{ background: "linear-gradient(90deg,#7C3AED,#2DD4BF)", color: "#fff" }}>
                                    <MapPin className="h-3 w-3 mr-2" />
                                    Toàn Hệ Thống
                                </TabsTrigger>
                                <TabsTrigger value="amc" className="data-[state=active]:text-white" style={{ color: "#8B949E" }}>
                                    AMC Empire 25
                                </TabsTrigger>
                                <TabsTrigger value="regal" className="data-[state=active]:text-white" style={{ color: "#8B949E" }}>
                                    Regal E-Walk
                                </TabsTrigger>
                                <TabsTrigger value="alamo" className="data-[state=active]:text-white" style={{ color: "#8B949E" }}>
                                    Alamo Drafthouse
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div
                            className="flex items-center gap-3 rounded-xl p-2 px-4 w-full sm:w-auto"
                            style={{
                                background: "#161B22",
                                border: "1px solid #1F2532",
                                boxShadow: "0 4px 20px 0 rgba(0,0,0,0.4)",
                            }}
                        >
                            <Calendar className="h-5 w-5" style={{ color: "#7C3AED" }} />
                            <div className="flex flex-col">
                                <label className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "#8B949E" }}>Tra cứu theo ngày</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    max={todayStr}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="bg-transparent font-medium focus:outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:invert"
                                    style={{ color: isFuture ? "#F43F5E" : "#FFFFFF" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="flex flex-col gap-6">
                    {/* Top Chart: Real-time 24h */}
                    {isFuture && (
                        <div
                            className="flex items-center justify-center gap-3 rounded-xl px-4 py-3 mb-2"
                            style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: "12px" }}
                        >
                            <span style={{ color: "#F43F5E", fontSize: "14px", fontWeight: 600 }}>
                                ⚠ Không có dữ liệu cho ngày trong tương lai ({selectedDate})
                            </span>
                        </div>
                    )}
                    <GenericChart 
                        data={applyDataModifiers(metricData.realtime)} 
                        title={`Theo Thời Gian Thực (24h ${isToday ? 'Hôm Nay' : 'ngày ' + selectedDate})`} 
                        metricType={metric.type}
                        heightClass="h-[350px]"
                    />

                    {/* Bottom Grid: Day, Week, Month, Year */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <GenericChart 
                            data={applyDataModifiers(metricData.day)} 
                            title="Theo Ngày (7 ngày qua)" 
                            metricType={metric.type} 
                            heightClass="h-[250px]"
                        />
                        <GenericChart 
                            data={applyDataModifiers(metricData.week)} 
                            title="Theo Tuần (4 tuần gần nhất)" 
                            metricType={metric.type} 
                            heightClass="h-[250px]"
                        />
                        <GenericChart 
                            data={applyDataModifiers(metricData.month)} 
                            title="Theo Tháng (12 tháng)" 
                            metricType={metric.type} 
                            heightClass="h-[250px]"
                        />
                        <GenericChart 
                            data={applyDataModifiers(metricData.year)} 
                            title="Theo Năm (5 năm qua)" 
                            metricType={metric.type} 
                            heightClass="h-[250px]"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
