"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  DoorOpen,
  CalendarDays,
  Users,
  Ticket,
  MapPin,
  LogOut,
} from "lucide-react";

const menuItems = [
  { name: "Overview",   icon: LayoutDashboard, href: "/admin" },
  { name: "Cinemas",    icon: MapPin,           href: "/admin/cinemas" },
  { name: "Movies",     icon: Film,             href: "/admin/movies" },
  { name: "Rooms",      icon: DoorOpen,         href: "/admin/rooms" },
  { name: "Showtimes",  icon: CalendarDays,     href: "/admin/showtimes" },
  { name: "Tickets",    icon: Ticket,           href: "/admin/tickets" },
  { name: "Users",      icon: Users,            href: "/admin/users" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <aside
      className="fixed inset-y-0 left-0 w-56 flex flex-col z-40"
      style={{
        background: "#0a0a0a",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <Link href="/admin" className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.25)" }}
          >
            <Film size={14} style={{ color: "#c9a84c" }} />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.12em]" style={{ color: "#c9a84c" }}>
              LUXE CINEMA
            </p>
            <p className="text-[9px] font-medium tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
              ADMIN
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p
          className="px-3 pb-2 text-[9px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Management
        </p>
        {menuItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                color: isActive ? "#c9a84c" : "rgba(255,255,255,0.45)",
                background: isActive ? "rgba(201,168,76,0.08)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <Icon size={15} className="flex-shrink-0" />
              <span>{item.name}</span>
              {isActive && (
                <div
                  className="ml-auto w-1 h-1 rounded-full"
                  style={{ background: "#c9a84c" }}
                />
              )}
            </Link>
          );
        })}
      </nav>


    </aside>
  );
}
