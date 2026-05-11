import { DashboardMetrics, DashboardCharts } from "@/features/admin";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
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

            <DashboardMetrics />

            <DashboardCharts />
        </div>
    );
}
