"use client";

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
  { name: "Mai", value: 85 },
  { name: "Đào, Phở...", value: 72 },
  { name: "Kung Fu Panda 4", value: 65 },
  { name: "Dune: Part 2", value: 60 },
  { name: "Exhuma", value: 55 },
];

export default function DashboardCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <div className="col-span-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Doanh Thu Tuần Này</h3>
          <p className="text-sm text-slate-400">Tổng doanh thu bán vé 7 ngày gần nhất</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value / 1000000}M`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                itemStyle={{ color: '#dc2626' }}
                formatter={(value: any) => [`${Number(value).toLocaleString()} đ`, "Doanh thu"]}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#dc2626" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#dc2626', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-span-3 rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Top Phim Thịnh Hành</h3>
          <p className="text-sm text-slate-400">Theo số lượng vé bán ra</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topMoviesData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }}
                cursor={{ fill: '#1e293b' }}
                formatter={(value: any) => [`${value}k vé`, "Đã bán"]}
              />
              <Bar dataKey="value" fill="#dc2626" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
