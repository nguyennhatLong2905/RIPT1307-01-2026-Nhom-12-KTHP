"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, User, LogOut, UserCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/features/auth";
import LoginForm from "@/features/auth/components/login-form";
import RegisterForm from "@/features/auth/components/register-form";

const GOLD = "#c9a84c";

const navLinks = [
  { label: "MOVIES", href: "/movies", scrollTo: "trending" },
  { label: "MY LIST", href: "/my-list" },
  { label: "AI PICKS", href: "/ai-picks", scrollTo: "ai-picks" },
];

type AuthTab = "login" | "register";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("MOVIES");
  const [authTab, setAuthTab] = useState<AuthTab>("login");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: (typeof navLinks)[number]
  ) => {
    setActiveLink(link.label);
    if (link.scrollTo) {
      e.preventDefault();
      const target = document.getElementById(link.scrollTo);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div
        className="absolute top-0 left-0 w-full h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #b8860b 30%, #ffd700 50%, #b8860b 70%, transparent 100%)",
        }}
      />

      <div
        className="flex items-center justify-between px-8 py-4"
        style={{ background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)" }}
      >
        <Link
          href="/"
          className="text-xl font-bold tracking-[0.15em]"
          style={{ color: GOLD }}
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              document.getElementById("hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        >
          LUXE CINEMA
        </Link>

        <ul className="flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                className="relative text-sm tracking-[0.1em] transition-colors duration-200"
                style={{ color: activeLink === link.label ? "#e0e0e0" : "#999999" }}
              >
                {link.label}
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

        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-3 rounded-full px-5 py-2"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Search size={20} style={{ color: GOLD }} />
            <input
              type="text"
              placeholder="SEARCH"
              className="bg-transparent text-sm tracking-widest outline-none w-32 placeholder:text-neutral-500"
              style={{ color: "#e0e0e0" }}
            />
          </div>

          {isLoggedIn ? (
            <div className="relative">
              <button
                id="user-menu-trigger"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full px-3 py-2 transition-colors duration-200 cursor-pointer hover:bg-white/10"
                style={{ color: GOLD }}
              >
                <UserCircle size={22} />
                <span className="text-xs tracking-wide max-w-[80px] truncate" style={{ color: "#e0e0e0" }}>
                  {user?.name}
                </span>
                <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden shadow-2xl"
                  style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(201,168,76,0.2)" }}
                >
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm tracking-wide transition-colors hover:bg-white/5"
                    style={{ color: "#e0e0e0" }}
                  >
                    <User size={15} style={{ color: GOLD }} />
                    Hồ sơ của tôi
                  </Link>
                  <div className="h-px mx-4" style={{ backgroundColor: "rgba(201,168,76,0.15)" }} />
                  <button
                    id="logout-btn"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm tracking-wide transition-colors hover:bg-white/5"
                    style={{ color: "#e0e0e0" }}
                  >
                    <LogOut size={15} style={{ color: "#e05252" }} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  id="login-trigger"
                  className="flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer hover:bg-white/10 p-2 -m-2"
                  style={{ color: GOLD }}
                >
                  <User size={22} />
                </button>
              </SheetTrigger>
              <SheetContent
                className="border-l border-[#c9a84c]/20"
                style={{ backgroundColor: "#111111" }}
              >
                <SheetHeader className="mt-4">
                  <SheetTitle style={{ color: GOLD, letterSpacing: "0.1em", textAlign: "center" }}>
                    LUXE CINEMA
                  </SheetTitle>
                </SheetHeader>

                <div className="flex gap-0 mt-6 mx-4 rounded-lg overflow-hidden" style={{ border: "1px solid rgba(201,168,76,0.2)" }}>
                  {(["login", "register"] as AuthTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAuthTab(tab)}
                      className="flex-1 py-2 text-xs font-bold tracking-widest transition-colors"
                      style={{
                        backgroundColor: authTab === tab ? GOLD : "transparent",
                        color: authTab === tab ? "#000" : "#999",
                      }}
                    >
                      {tab === "login" ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
                    </button>
                  ))}
                </div>

                <div className="px-4 py-6">
                  {authTab === "login" ? (
                    <LoginForm
                      onSuccess={() => setSheetOpen(false)}
                      onSwitchToRegister={() => setAuthTab("register")}
                    />
                  ) : (
                    <RegisterForm
                      onSuccess={() => setSheetOpen(false)}
                      onSwitchToLogin={() => setAuthTab("login")}
                    />
                  )}
                </div>

                <SheetClose className="hidden" />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
}
