"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axios";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { isAdmin, isLoggedIn } from "@/lib/auth-utils";
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
  { label: "MOVIES", href: "/", scrollTo: "trending" },
  { label: "MY LIST", href: "/my-list" },
  { label: "AI PICKS", href: "/ai-picks" },
];

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeLink, setActiveLink] = useState("MOVIES");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setIsSheetOpen(true);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  // Sync active link with current path
  useEffect(() => {
    if (pathname === "/my-list") {
      setActiveLink("MY LIST");
    } else if (pathname === "/ai-picks") {
      setActiveLink("AI PICKS");
    } else if (pathname === "/") {
      setActiveLink("MOVIES");
    } else {
      setActiveLink("");
    }
  }, [pathname]);


  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", { username, password });
      const token = response.data;
      localStorage.setItem("token", token);
      alert("Đăng nhập thành công!");
      window.location.reload(); // Reload to update UI and token
    } catch (error) {
      alert("Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản!");
    } finally {
      setIsLoading(false);
    }
  };

  const userLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: (typeof navLinks)[number]
  ) => {
    if (link.label === "MY LIST" && !userLoggedIn) {
      e.preventDefault();
      setIsSheetOpen(true);
      return;
    }

    if (link.scrollTo && pathname === "/") {
      const target = document.getElementById(link.scrollTo);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveLink(link.label);
      }
    } else {
      // Nếu có scrollTo nhưng đang ở trang khác, để Link tự chuyển hướng về href
      setActiveLink(link.label);
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

        {/* Menu giữa - Chỉ hiển thị khi KHÔNG phải trang admin */}
        {!pathname?.startsWith("/admin") && (
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
        )}

        {/* Search + User icon */}
        <div className="flex items-center gap-4">
          {/* Ô tìm kiếm - Ẩn khi là trang admin */}
          {!pathname?.startsWith("/admin") && (
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
          )}

          {/* Icon user + Sheet (Slide bar) */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button
                className="flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer hover:bg-white/10 p-2 -m-2"
                style={{ color: "#c9a84c" }}
              >
                <User size={22} />
              </button>
            </SheetTrigger>
            <SheetContent
              className="border-l border-[#c9a84c]/20 flex flex-col"
              style={{ backgroundColor: "#111111" }}
            >
              {userLoggedIn ? (
                <>
                  <SheetHeader className="mt-4">
                    <SheetTitle style={{
                      color: "#c9a84c", letterSpacing: "0.1em", fontWeight: "bold", fontSize: "2em", textAlign: "center"
                    }}>ACCOUNT</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 flex flex-col items-center justify-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] border border-[#c9a84c]/30 shadow-[0_0_30px_rgba(201,168,76,0.15)]">
                      <User size={48} />
                    </div>
                    
                    <div className="w-full space-y-3">
                      <SheetClose asChild>
                        <Button
                          onClick={() => router.push("/bookings")}
                          className="w-full bg-white/5 hover:bg-[#c9a84c]/10 text-white hover:text-[#c9a84c] border border-white/10 hover:border-[#c9a84c]/30 rounded-xl h-12 transition-all font-bold"
                        >
                          LỊCH SỬ ĐẶT VÉ
                        </Button>
                      </SheetClose>

                      <SheetClose asChild>
                        <Button
                          onClick={() => router.push("/profile")}
                          className="w-full bg-white/5 hover:bg-[#c9a84c]/10 text-white hover:text-[#c9a84c] border border-white/10 hover:border-[#c9a84c]/30 rounded-xl h-12 transition-all font-bold"
                        >
                          HỒ SƠ CỦA TÔI
                        </Button>
                      </SheetClose>

                      {isAdmin() && (
                        <SheetClose asChild>
                          <Button
                            onClick={() => router.push("/admin")}
                            className="w-full bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 rounded-xl h-12 transition-all font-bold"
                          >
                            QUẢN TRỊ HỆ THỐNG
                          </Button>
                        </SheetClose>
                      )}

                      <Button
                        onClick={handleLogout}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl h-12 transition-all font-bold flex items-center justify-center gap-2"
                      >
                        <LogOut size={18} />
                        ĐĂNG XUẤT
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
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
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nhập tên đăng nhập"
                        className="border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/50 h-12 rounded-xl"
                        style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e0e0e0" }}
                      />
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" style={{ color: "#c9a84c", fontSize: "0.8rem", letterSpacing: "0.05em" }}>PASSWORD</Label>
                        <SheetClose asChild>
                          <button 
                            onClick={() => router.push("/forgot-password")}
                            className="text-[10px] text-white/40 hover:text-[#c9a84c] uppercase tracking-widest font-bold transition-colors"
                          >
                            Quên mật khẩu?
                          </button>
                        </SheetClose>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        className="border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/50 h-12 rounded-xl"
                        style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e0e0e0" }}
                      />
                    </div>
                  </div>
                  <SheetFooter className="mt-auto flex flex-col gap-4">
                    <Button
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full h-12 hover:bg-[#d4b455] transition-colors rounded-xl"
                      style={{ backgroundColor: "#c9a84c", color: "#000", fontWeight: "bold", letterSpacing: "0.05em" }}
                    >
                      {isLoading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
                    </Button>
                    
                    <div className="text-center space-y-2">
                      <p className="text-[11px] text-white/40 uppercase tracking-widest">Chưa có tài khoản?</p>
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          onClick={() => router.push("/register")}
                          className="w-full text-[#c9a84c] hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-xl font-bold border border-[#c9a84c]/20"
                        >
                          ĐĂNG KÝ NGAY
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetFooter>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav >
  );
}
