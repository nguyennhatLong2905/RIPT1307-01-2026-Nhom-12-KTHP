"use client";

import { UserCircle } from "lucide-react";

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

            <div className="flex flex-1 justify-end items-center gap-3">

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
