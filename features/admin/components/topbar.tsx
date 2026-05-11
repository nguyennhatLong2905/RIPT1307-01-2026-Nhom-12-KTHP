"use client";

import { Bell, Search, UserCircle } from "lucide-react";

export default function Topbar() {
    return (
        <header
            className="fixed top-0 right-0 z-30 flex h-16 items-center justify-between px-6 backdrop-blur-md"
            style={{
                left: "16rem",
                background: "rgba(11, 14, 20, 0.85)",
                borderBottom: "1px solid #1F2532",
            }}
        >
            <div className="flex items-center gap-4 lg:hidden">
                <span
                    className="text-lg font-bold tracking-widest"
                    style={{
                        background: "linear-gradient(90deg, #7C3AED, #2DD4BF)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    LUXE
                </span>
            </div>

            <div className="flex flex-1 items-center gap-4 md:ml-6">
                <div className="relative w-full max-w-md hidden md:block">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Search className="h-4 w-4" style={{ color: "#8B949E" }} />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="w-full rounded-full pl-11 pr-4 py-2 text-sm outline-none transition-all"
                        style={{
                            background: "#161B22",
                            border: "1px solid #1F2532",
                            color: "#FFFFFF",
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)";
                            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)";
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = "#1F2532";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    className="relative rounded-full p-2 transition-all duration-200"
                    style={{ color: "#8B949E" }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = "#2DD4BF";
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(45,212,191,0.1)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = "#8B949E";
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }}
                >
                    <span
                        className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full"
                        style={{
                            background: "#2DD4BF",
                            boxShadow: "0 0 6px rgba(45,212,191,0.8)",
                        }}
                    />
                    <Bell className="h-5 w-5" />
                </button>

                <div className="h-8 w-px mx-1" style={{ background: "#1F2532" }} />

                <button
                    className="flex items-center gap-3 rounded-xl px-3 py-1.5 transition-all duration-200"
                    style={{ border: "1px solid transparent" }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.1)";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124,58,237,0.3)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                    }}
                >
                    <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                            background: "linear-gradient(135deg, #7C3AED, #2DD4BF)",
                            color: "#FFFFFF",
                        }}
                    >
                        A
                    </div>
                    <div className="hidden flex-col items-start md:flex">
                        <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>
                            Quản Trị Viên
                        </span>
                        <span className="text-xs" style={{ color: "#8B949E" }}>
                            Super Admin
                        </span>
                    </div>
                </button>
            </div>
        </header>
    );
}
