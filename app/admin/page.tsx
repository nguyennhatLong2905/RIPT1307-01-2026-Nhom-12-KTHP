import { DashboardMetrics, DashboardCharts } from "@/features/admin";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <DashboardMetrics />
            <DashboardCharts />
        </div>
    );
}
