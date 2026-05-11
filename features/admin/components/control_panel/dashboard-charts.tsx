"use client";

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

const revenueData = [
    { name: "T2", total: 120000000 },
    { name: "T3", total: 150000000 },
    { name: "T4", total: 180000000 },
    { name: "T5", total: 140000000 },
    { name: "T6", total: 250000000 },
    { name: "T7", total: 320000000 },
    { name: "CN", total: 350000000 },
];

const topMoviesData = [
    { name: "Mai", value: 98 },
    { name: "Đào, Phở...", value: 68 },
    { name: "Kung Fu Panda 4", value: 37 },
    { name: "Dune: Part 2", value: 36 },
    { name: "Exhuma", value: 22 },
];

const cardStyle = {
    background: "#161B22",
    border: "1px solid #1F2532",
    boxShadow: "0 4px 20px 0 rgba(0,0,0,0.5)",
    borderRadius: "16px",
    padding: "24px",
};

const CustomAreaTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: "#0B0E14",
                    border: "1px solid #7C3AED60",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    boxShadow: "0 0 20px rgba(124,58,237,0.3)",
                }}
            >
                <p style={{ color: "#8B949E", fontSize: "12px", marginBottom: "4px" }}>{label}</p>
                <p style={{ color: "#2DD4BF", fontWeight: 700, fontSize: "14px" }}>
                    {Number(payload[0].value).toLocaleString()} đ
                </p>
            </div>
        );
    }
    return null;
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: "#0B0E14",
                    border: "1px solid #2DD4BF60",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    boxShadow: "0 0 20px rgba(45,212,191,0.3)",
                }}
            >
                <p style={{ color: "#8B949E", fontSize: "12px", marginBottom: "4px" }}>{label}</p>
                <p style={{ color: "#7C3AED", fontWeight: 700, fontSize: "14px" }}>
                    {payload[0].value}%
                </p>
            </div>
        );
    }
    return null;
};

export default function DashboardCharts() {
    return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4" style={cardStyle}>
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-1" style={{ color: "#FFFFFF" }}>
                        Doanh Thu Tuần Này
                    </h3>
                    <p className="text-sm" style={{ color: "#8B949E" }}>
                        Tổng doanh thu bán vé 7 ngày gần nhất
                    </p>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="neonLineGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#7C3AED" />
                                    <stop offset="100%" stopColor="#2DD4BF" />
                                </linearGradient>
                                <linearGradient id="neonFillGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35} />
                                    <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1F2532" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#8B949E"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#8B949E"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(v) => `${v / 1000000}M`}
                                dx={-5}
                            />
                            <Tooltip content={<CustomAreaTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="url(#neonLineGradient)"
                                strokeWidth={3}
                                fill="url(#neonFillGradient)"
                                dot={{ r: 4, fill: "#0B0E14", stroke: "#7C3AED", strokeWidth: 2 }}
                                activeDot={{
                                    r: 6,
                                    fill: "#2DD4BF",
                                    stroke: "#FFFFFF",
                                    strokeWidth: 2,
                                    filter: "drop-shadow(0 0 6px #2DD4BF)",
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="col-span-3" style={cardStyle}>
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-1" style={{ color: "#FFFFFF" }}>
                        Top Phim Thịnh Hành
                    </h3>
                    <p className="text-sm" style={{ color: "#8B949E" }}>
                        Theo số lượng vé bán ra
                    </p>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={topMoviesData}
                            layout="vertical"
                            margin={{ top: 10, right: 40, bottom: 0, left: 40 }}
                        >
                            <defs>
                                <linearGradient id="neonBarGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#7C3AED" />
                                    <stop offset="100%" stopColor="#2DD4BF" />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1F2532" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                stroke="#8B949E"
                                fontSize={11}
                                tickLine={false}
                                axisLine={false}
                                width={80}
                            />
                            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(124,58,237,0.08)" }} />
                            <Bar
                                dataKey="value"
                                fill="url(#neonBarGradient)"
                                radius={[0, 6, 6, 0]}
                                barSize={14}
                                label={{
                                    position: "right",
                                    fill: "#8B949E",
                                    fontSize: 11,
                                    formatter: (v: any) => `${v}%`,
                                }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
