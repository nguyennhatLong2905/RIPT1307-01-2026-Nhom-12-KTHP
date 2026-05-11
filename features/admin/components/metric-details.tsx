"use client";

import { useState } from "react";
import { X, ArrowLeft, Calendar, MapPin } from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
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
    let cumulativeValue = 0;
    return Array.from({ length: 13 }).map((_, i) => {
        const hour = i * 2;
        if (hour === 0) {
            return { name: "0h", value: 0 };
        }
        let hourlyIncrement = 0;
        if (hour >= 8) {
            const multiplier = (hour >= 18 && hour <= 22) ? 1.5 : (hour >= 8 && hour <= 12) ? 0.8 : 1;
            hourlyIncrement = Math.max(0, (base / 10) * multiplier + Math.sin(hour) * (volatility / 10));
        }

        cumulativeValue += hourlyIncrement;
        return {
            name: `${hour}h`,
            value: Math.floor(cumulativeValue)
        };
    });
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
        realtime: generate24hData(5000000, 2000000),
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
        realtime: calculateOccupancy(ticketsMock.realtime, 3500),
        day: calculateOccupancy(ticketsMock.day, 4500),
        week: calculateOccupancy(ticketsMock.week, 31500),
        month: calculateOccupancy(ticketsMock.month, 135000),
        year: calculateOccupancy(ticketsMock.year, 1642500),
    }
};

const CustomTooltip = ({ active, payload, label, title, metricType }: any) => {
    if (active && payload && payload.length) {
        let valueStr = payload[0].value.toLocaleString();
        let colorClass = "text-green-500";
        if (metricType === 'revenue') {
            valueStr += " đ";
            colorClass = "text-red-500";
        } else if (metricType === 'tickets') {
            valueStr += " vé";
            colorClass = "text-blue-500";
        } else if (metricType === 'occupancy') {
            valueStr += "%";
        }

        return (
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
                <p className="text-slate-300 font-medium mb-1">{label}</p>
                <p className={`${colorClass} font-bold text-lg`}>
                    {valueStr}
                </p>
                <p className="text-xs text-slate-500 mt-1">{title}</p>
            </div>
        );
    }
    return null;
};
const GenericChart = ({ data, title, metricType, heightClass = "h-[300px]" }: any) => {
    let strokeColor = "#10b981"; // Green for customers, occupancy
    let fillColor = "#10b981";

    if (metricType === 'revenue') {
        strokeColor = "#dc2626"; // Red
        fillColor = "url(#colorRevenue)";
    } else if (metricType === 'tickets') {
        strokeColor = "#3b82f6"; // Blue
        fillColor = "#3b82f6";
    }

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 flex flex-col w-full">
            <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
            <div className={`w-full ${heightClass}`}>
                <ResponsiveContainer width="100%" height="100%">
                    {metricType === 'revenue' ? (
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide={true} />
                            <Tooltip content={<CustomTooltip title={title} metricType={metricType} />} />
                            <Area type="monotone" dataKey="value" stroke={strokeColor} fillOpacity={1} fill={fillColor} />
                        </AreaChart>
                    ) : metricType === 'tickets' ? (
                        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide={true} />
                            <Tooltip content={<CustomTooltip title={title} metricType={metricType} />} cursor={{ fill: '#1e293b' }} />
                            <Bar dataKey="value" fill={fillColor} radius={[4, 4, 0, 0]} barSize={32} />
                        </BarChart>
                    ) : (
                        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide={true} />
                            <Tooltip content={<CustomTooltip title={title} metricType={metricType} />} />
                            <Line type="monotone" dataKey="value" stroke={strokeColor} strokeWidth={3} dot={{ r: 4, fill: strokeColor, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default function MetricDetailsModal({ isOpen, onClose, metric }: MetricDetailsProps) {
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [selectedCinema, setSelectedCinema] = useState("all");

    if (!isOpen || !metric) return null;
    const metricData = mockDataMap[metric.type] || mockDataMap.revenue;
    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    
    const cinemaMultiplier = selectedCinema === 'amc' ? 1.2 : selectedCinema === 'regal' ? 0.8 : selectedCinema === 'alamo' ? 0.9 : 1.0;

    const applyDataModifiers = (arr: any[]) => {
        let result = arr;
        if (isToday) {
            if (arr.length === 13) {
                const currentHour = new Date().getHours();
                result = arr.map(item => {
                    const hourLabel = parseInt(item.name.replace('h', ''));
                    return { ...item, value: hourLabel > currentHour ? null : item.value };
                });
            }
        } else {
            // Instead of shifting array elements (which breaks the cumulative 0h-8h logic),
            // we apply a pseudo-random multiplier based on the day to simulate different data.
            const dateShift = parseInt(selectedDate.split('-')[2]) % 5; 
            // Multiplier ranges from 0.8 to 1.2
            const dateMultiplier = 0.8 + (dateShift * 0.1); 
            
            result = arr.map(item => ({
                ...item,
                value: item.value === null ? null : Math.round(item.value * dateMultiplier)
            }));
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
        <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
            <div className="max-w-7xl mx-auto p-6 md:p-8">
                
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                    <div>
                        <button 
                            onClick={onClose}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
                        >
                            <div className="p-2 rounded-full bg-slate-900 group-hover:bg-slate-800 transition-colors">
                                <ArrowLeft className="h-5 w-5" />
                            </div>
                            <span className="font-medium">Quay lại Bảng Điều Khiển</span>
                        </button>
                        <h1 className="text-3xl font-bold text-white mb-2">Báo Cáo Chi Tiết: {metric.title}</h1>
                        <p className="text-slate-400">
                            {metric.type === 'customers' 
                                ? "Phân tích lượng tài khoản mới được tạo khi đăng ký xem phim."
                                : "Phân tích chuyên sâu dữ liệu với các khung thời gian linh hoạt."}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
                        {/* Cinema Selector (For all metrics) */}
                        <Tabs value={selectedCinema} onValueChange={setSelectedCinema} className="w-full sm:w-auto">
                            <TabsList className="bg-slate-900 border border-slate-800">
                                <TabsTrigger value="all" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">
                                    <MapPin className="h-3 w-3 mr-2" />
                                    Toàn Hệ Thống
                                </TabsTrigger>
                                <TabsTrigger value="amc" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">
                                    AMC Empire 25
                                </TabsTrigger>
                                <TabsTrigger value="regal" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">
                                    Regal E-Walk
                                </TabsTrigger>
                                <TabsTrigger value="alamo" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">
                                    Alamo Drafthouse
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-2 px-4 shadow-sm w-full sm:w-auto">
                            <Calendar className="h-5 w-5 text-slate-400" />
                            <div className="flex flex-col">
                                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Tra cứu theo ngày</label>
                                <input 
                                    type="date" 
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="bg-transparent text-white font-medium focus:outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:invert"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="flex flex-col gap-6">
                    {/* Top Chart: Real-time 24h */}
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
