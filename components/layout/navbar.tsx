"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "MOVIES", href: "/movies", scrollTo: "trending" },
  { label: "MY LIST", href: "/my-list" },
  { label: "AI PICKS", href: "/ai-picks", scrollTo: "ai-picks" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeLink, setActiveLink] = useState("MOVIES");

  if (pathname.startsWith('/admin')) return null;

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: (typeof navLinks)[number]
  ) => {
    setActiveLink(link.label);
    if (link.scrollTo) {
      e.preventDefault();
      const target = document.getElementById(link.scrollTo);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full">
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
        style={{ background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)" }}
      >
        {/* Tên */}
        <Link href="/" className="text-xl font-bold tracking-[0.15em]" style={{ color: "#c9a84c" }}
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              const target = document.getElementById("hero");
              if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }
          }}
        >
          LUXE CINEMA
        </Link>

        {/* Menu giữa */}
        <ul className="flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
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

          {/* Icon user + Sheet (Slide bar) */}
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer hover:bg-white/10 p-2 -m-2"
                style={{ color: "#c9a84c" }}
              >
                <User size={22} />
              </button>
            </SheetTrigger>
            <SheetContent
              className="border-l border-[#c9a84c]/20"
              style={{ backgroundColor: "#111111" }}
            >
              <SheetHeader className="mt-4">
                <SheetTitle style={{
                  color: "#c9a84c", letterSpacing: "0.1em", fontWeight: "bold", fontSize: "2em", textAlign: "center"
                }}>LOGIN</SheetTitle>
              </SheetHeader>
              <div className="grid flex-1 auto-rows-min gap-6 px-4 py-8">
                <div className="grid gap-3">
                  <Label htmlFor="username" style={{ color: "#c9a84c", fontSize: "0.8rem", letterSpacing: "0.05em" }}>USERNAME</Label>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    className="border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/50"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e0e0e0" }}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password" style={{ color: "#c9a84c", fontSize: "0.8rem", letterSpacing: "0.05em" }}>PASSWORD</Label>
                  <Input
                    id="password"
                    placeholder="Enter your password"
                    className="border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/50"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e0e0e0" }}
                  />
                </div>
              </div>
              <SheetFooter className="mt-auto">
                <Button
                  type="submit"
                  className="hover:bg-[#d4b455] transition-colors"
                  style={{ backgroundColor: "#c9a84c", color: "#000", fontWeight: "bold", letterSpacing: "0.05em" }}
                >
                  LOGIN
                </Button>
                <SheetClose asChild>
                  <Button
                    variant="outline"
                    className="hover:bg-[#c9a84c]/10 transition-colors"
                    style={{ borderColor: "rgba(201,168,76,0.3)", color: "#c9a84c", backgroundColor: "transparent" }}
                  >
                    CLOSE
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav >
  );
}
