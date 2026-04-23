"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User } from "lucide-react";

const navLinks = [
  { label: "MOVIES", href: "/movies" },
  { label: "MY LIST", href: "/my-list" },
  { label: "AI PICKS", href: "/ai-picks" },
];

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("MOVIES");

  return (
    <nav className="relative w-full">
      {/* Đường gradient vàng trên cùng */}
      <div
        className="absolute top-0 left-0 w-full h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #b8860b 30%, #ffd700 50%, #b8860b 70%, transparent 100%)",
        }}
      />

      {/* Thanh navbar chính */}
      <div
        className="flex items-center justify-between px-8 py-4"
        style={{
          background:
            "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-[0.15em]" style={{ color: "#c9a84c" }}>
          LUXE CINEMA
        </Link>

        {/* Menu giữa */}
        <ul className="flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setActiveLink(link.label)}
                className="relative text-sm tracking-[0.1em] transition-colors duration-200"
                style={{
                  color: activeLink === link.label ? "#e0e0e0" : "#999999",
                }}
              >
                {link.label}

                {/* Gạch chân cho mục đang active */}
                {activeLink === link.label && (
                  <span
                    className="absolute left-0 -bottom-1 w-full h-[1.5px]"
                    style={{ backgroundColor: "#e0e0e0" }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Search + User icon */}
        <div className="flex items-center gap-4">
          {/* Ô tìm kiếm */}
          <div
            className="flex items-center gap-3 rounded-full px-5 py-2"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Search size={20} style={{ color: "#c9a84c" }} />
            <input
              type="text"
              placeholder="SEARCH"
              className="bg-transparent text-sm tracking-widest outline-none w-32 placeholder:text-neutral-500"
              style={{ color: "#e0e0e0" }}
            />
          </div>

          {/* Icon user */}
          <button
            className="flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer"
            style={{ color: "#c9a84c" }}
          >
            <User size={22} />
          </button>
        </div>
      </div>
    </nav>
  );
}
