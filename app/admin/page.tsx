import { DashboardMetrics, DashboardCharts } from "@/features/admin";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Bảng Điều Khiển</h1>
        <p className="text-sm text-slate-400">
          Tổng quan về tình hình kinh doanh và hoạt động của hệ thống rạp.
        </p>
      </div>

      <DashboardMetrics />
      
      <DashboardCharts />
    </div>
  );
}
