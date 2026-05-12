"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Film, MapPin, Calendar, Ticket, Users, Tag, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { title: "Bảng Điều Khiển", href: "/admin", icon: LayoutDashboard },
    { title: "Quản Lý Phim", href: "/admin/movies", icon: Film },
    { title: "Quản Lý Rạp", href: "/admin/cinemas", icon: MapPin },
    { title: "Lịch Chiếu", href: "/admin/showtimes", icon: Calendar },
    { title: "Đơn Hàng", href: "/admin/bookings", icon: Ticket },
    { title: "Khách Hàng", href: "/admin/users", icon: Users },
    { title: "Khuyến Mãi", href: "/admin/promotions", icon: Tag },
    { title: "Cài Đặt", href: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    function handleLogout() {
        // Xóa mock token hoặc token thật
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
    }

    return (
        <aside
            className="fixed left-0 top-0 z-40 h-screen w-64 transition-transform"
            style={{
                background: "#0B0E14",
                borderRight: "1px solid #1F2532",
            }}
        >
            <div
                className="flex h-16 items-center px-6"
                style={{ borderBottom: "1px solid #1F2532" }}
            >
                <span
                    className="text-xl font-bold tracking-widest"
                    style={{
                        background: "linear-gradient(90deg, #7C3AED, #2DD4BF)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    LUXE ADMIN
                </span>
            </div>

            <div className="h-full overflow-y-auto px-3 py-4 pb-24">
                <ul className="space-y-1 font-medium">
                    {menuItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (pathname.startsWith(item.href) && item.href !== "/admin");

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center rounded-xl px-3 py-3 transition-all duration-200",
                                        isActive
                                            ? "text-white"
                                            : "hover:text-white"
                                    )}
                                    style={
                                        isActive
                                            ? {
                                                background: "linear-gradient(90deg, rgba(124,58,237,0.3), rgba(45,212,191,0.1))",
                                                border: "1px solid rgba(124,58,237,0.5)",
                                                boxShadow: "0 0 20px rgba(124,58,237,0.25), inset 0 0 20px rgba(124,58,237,0.05)",
                                            }
                                            : {
                                                color: "#8B949E",
                                                border: "1px solid transparent",
                                            }
                                    }
                                >
                                    <item.icon
                                        className="h-5 w-5 shrink-0"
                                        style={
                                            isActive
                                                ? {
                                                    color: "#2DD4BF",
                                                    filter: "drop-shadow(0 0 6px rgba(45,212,191,0.7))",
                                                }
                                                : {}
                                        }
                                    />
                                    <span className="ml-3 text-sm">{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div
                className="absolute bottom-0 left-0 w-full p-4"
                style={{ borderTop: "1px solid #1F2532", background: "#0B0E14" }}
            >
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center rounded-xl px-3 py-2 text-sm transition-all duration-200"
                    style={{ color: "#8B949E", border: "1px solid transparent" }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.1)";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124,58,237,0.3)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = "#8B949E";
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                    }}
                >
                    <LogOut className="h-5 w-5" />
                    <span className="ml-3">Đăng Xuất</span>
                </button>
            </div>
        </aside>
    );
}
