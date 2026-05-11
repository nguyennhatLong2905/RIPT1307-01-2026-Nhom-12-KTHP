"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Film, MapPin, Calendar, Ticket, Users, Tag, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    {
        title: "Bảng Điều Khiển",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Quản Lý Phim",
        href: "/admin/movies",
        icon: Film,
    },
    {
        title: "Quản Lý Rạp",
        href: "/admin/cinemas",
        icon: MapPin,
    },
    {
        title: "Lịch Chiếu",
        href: "/admin/showtimes",
        icon: Calendar,
    },
    {
        title: "Đơn Hàng",
        href: "/admin/bookings",
        icon: Ticket,
    },
    {
        title: "Khách Hàng",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Khuyến Mãi",
        href: "/admin/promotions",
        icon: Tag,
    },
    {
        title: "Cài Đặt",
        href: "/admin/settings",
        icon: Settings,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-800 bg-black text-white transition-transform">
            <div className="flex h-16 items-center border-b border-slate-800 px-6">
                <span className="text-xl font-bold tracking-wider text-red-600">LUXE ADMIN</span>
            </div>
            
            <div className="h-full overflow-y-auto px-3 py-4 pb-24">
                <ul className="space-y-2 font-medium">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/admin");
                        
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "group flex items-center rounded-lg p-3 hover:bg-slate-800",
                                        isActive ? "bg-red-600 text-white hover:bg-red-700" : "text-slate-300 hover:text-white"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    <span className="ml-3">{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="absolute bottom-0 left-0 w-full border-t border-slate-800 bg-black p-4">
                <button className="flex w-full items-center rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                    <LogOut className="h-5 w-5" />
                    <span className="ml-3">Đăng Xuất</span>
                </button>
            </div>
        </aside>
    );
}
