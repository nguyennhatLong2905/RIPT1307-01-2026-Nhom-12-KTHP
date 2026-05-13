"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Film, 
  DoorOpen, 
  CalendarDays, 
  Users, 
  ChevronRight,
  Ticket,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/admin", section: "overview" },
  { name: "Cinemas", icon: MapPin, href: "/admin/cinemas", section: "cinemas" },
  { name: "Movie Management", icon: Film, href: "/admin/movies", section: "movies" },
  { name: "Rooms", icon: DoorOpen, href: "/admin/rooms", section: "rooms" },
  { name: "Showtimes", icon: CalendarDays, href: "/admin/showtimes", section: "showtimes" },
  { name: "Tickets", icon: Ticket, href: "/admin/tickets", section: "tickets" },
  { name: "Users", icon: Users, href: "/admin/users", section: "users" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0d0d0d] border-r border-[#c9a84c]/20 flex flex-col h-screen sticky top-0">

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "text-black font-semibold shadow-lg shadow-[#c9a84c]/20" 
                  : "text-white/60 hover:text-[#c9a84c] hover:bg-white/5"
              )}
              style={isActive ? { backgroundColor: "#c9a84c" } : {}}
            >
              <div className="flex items-center gap-3 z-10">
                <Icon size={20} className={cn("transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                <span className="tracking-wide text-sm">{item.name}</span>
              </div>
              {isActive && <ChevronRight size={16} className="z-10" />}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
