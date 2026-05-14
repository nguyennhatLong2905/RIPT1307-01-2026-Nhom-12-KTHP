"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, LogOut, LockKeyhole, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axios";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { isAdmin, isLoggedIn } from "@/lib/auth-utils";
import { Movie } from "@/types";
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
  const [loginError, setLoginError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchMoviesForSearch = async () => {
      try {
        const response = await axiosInstance.get("/movies");
        if (Array.isArray(response.data)) {
          setAllMovies(response.data);
        }
      } catch (err) {
        console.error("Error loading movies for search:", err);
      }
    };
    fetchMoviesForSearch();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      const filtered = allMovies.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery, allMovies]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setIsSheetOpen(true);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  // Sync active link with current path and redirect Admin from Home
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
    setLoginError("");
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", { username, password });
      const token = response.data;
      localStorage.setItem("token", token);
      
      // If Admin, redirect to dashboard directly
      if (isAdmin()) {
        router.push("/admin");
        setIsSheetOpen(false);
      } else {
        window.location.reload(); // Reload for normal users to update UI
      }
    } catch (error) {
      setLoginError("Login failed. Please check your username and password.");
    } finally {
      setIsLoading(false);
    }
  };

  const userLoggedIn = mounted && typeof window !== "undefined" && !!localStorage.getItem("token");

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
            <div className="relative">
              <div
                className="flex items-center gap-3 rounded-full px-5 py-2 transition-all duration-300 focus-within:border-[#c9a84c]/50 focus-within:bg-white/10"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Search size={20} style={{ color: "#c9a84c" }} />
                <input
                  type="text"
                  placeholder="SEARCH"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm tracking-widest outline-none w-32 placeholder:text-neutral-500 transition-all focus:w-48"
                  style={{ color: "#e0e0e0" }}
                  suppressHydrationWarning
                />
              </div>

              {/* Kết quả tìm kiếm dropdown */}
              {searchQuery.trim().length > 0 && (
                <div 
                  className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-[#c9a84c]/20 bg-[#0d0d0d] p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all max-h-80 overflow-y-auto z-50 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#c9a84c]/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#c9a84c]/40 transition-colors"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(201, 168, 76, 0.2) transparent" }}
                >
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-white/40 italic">Searching...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-white/40 italic">No movies found</div>
                  ) : (
                    <div className="space-y-1">
                      {searchResults.map((movie) => (
                        <button
                          key={movie.id}
                          onClick={() => {
                            router.push(`/movies/${movie.id}`);
                            setSearchQuery("");
                          }}
                          className="flex w-full items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5 text-left group cursor-pointer"
                        >
                          {movie.posterUrl ? (
                            <img
                              src={movie.posterUrl}
                              alt={movie.title}
                              className="h-12 w-9 rounded-lg object-cover border border-white/10 group-hover:border-[#c9a84c]/40 transition-colors"
                            />
                          ) : (
                            <div className="h-12 w-9 rounded-lg bg-white/5 flex items-center justify-center text-[10px] text-white/30 border border-white/10">
                              FILM
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-white/90 truncate group-hover:text-[#c9a84c] transition-colors">
                              {movie.title}
                            </div>
                            <div className="text-[10px] text-white/40 truncate mt-0.5">
                              {movie.genre || "N/A"} • {movie.duration} min
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
                      {mounted && isAdmin() ? (
                        <>
                          <SheetClose asChild>
                            <Button
                              onClick={() => router.push("/admin")}
                              className="w-full bg-[#c9a84c]/10 hover:bg-[#c9a84c]/20 text-[#c9a84c] border border-[#c9a84c]/30 rounded-xl h-12 transition-all font-bold"
                            >
                              ADMIN DASHBOARD
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button
                              onClick={() => router.push("/profile")}
                              className="w-full bg-white/5 hover:bg-[#c9a84c]/10 text-white hover:text-[#c9a84c] border border-white/10 hover:border-[#c9a84c]/30 rounded-xl h-12 transition-all font-bold"
                            >
                              ADMIN PROFILE
                            </Button>
                          </SheetClose>
                        </>
                      ) : (
                        <>
                          <SheetClose asChild>
                            <Button
                              onClick={() => router.push("/bookings")}
                              className="w-full bg-white/5 hover:bg-[#c9a84c]/10 text-white hover:text-[#c9a84c] border border-white/10 hover:border-[#c9a84c]/30 rounded-xl h-12 transition-all font-bold"
                            >
                              BOOKING HISTORY
                            </Button>
                          </SheetClose>

                          <SheetClose asChild>
                            <Button
                              onClick={() => router.push("/profile")}
                              className="w-full bg-white/5 hover:bg-[#c9a84c]/10 text-white hover:text-[#c9a84c] border border-white/10 hover:border-[#c9a84c]/30 rounded-xl h-12 transition-all font-bold"
                            >
                              MY PROFILE
                            </Button>
                          </SheetClose>
                        </>
                      )}

                      <Button
                        onClick={handleLogout}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl h-12 transition-all font-bold flex items-center justify-center gap-2"
                      >
                        <LogOut size={18} />
                        LOGOUT
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#c9a84c]/20 blur-3xl" />
                    <div className="absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-[#ff8c6b]/10 blur-3xl" />
                    <div className="absolute inset-x-8 top-28 h-px bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />
                  </div>

                  <SheetHeader className="relative mt-4 items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c9a84c]/30 bg-[#c9a84c]/10 shadow-[0_0_35px_rgba(201,168,76,0.18)]">
                      <LockKeyhole className="h-8 w-8 text-[#c9a84c]" />
                    </div>
                    <SheetTitle className="text-center text-3xl font-black tracking-[0.18em] text-[#c9a84c]">
                      WELCOME BACK
                    </SheetTitle>
                    <SheetDescription className="max-w-xs text-center text-xs leading-5 text-white/45">
                      Sign in once to book tickets, save favorite movies and access your Luxe Cinema account.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="relative mt-8 grid flex-1 auto-rows-min gap-5 px-4">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur">
                      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#c9a84c]/15 bg-[#c9a84c]/5 p-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c9a84c]/15 text-[#c9a84c]">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white">Member Access</p>
                          <p className="text-[11px] text-white/40">For both user and admin accounts</p>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <div className="grid gap-2.5">
                          <Label htmlFor="username" className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c9a84c]">
                            Username
                          </Label>
                          <div className="group relative">
                            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#c9a84c]" />
                            <Input
                              id="username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="Enter username"
                              autoComplete="username"
                              className="h-12 rounded-2xl border-white/10 bg-black/30 pl-11 text-white placeholder:text-white/25 focus-visible:border-[#c9a84c]/50 focus-visible:ring-[#c9a84c]/30"
                            />
                          </div>
                        </div>

                        <div className="grid gap-2.5">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#c9a84c]">
                              Password
                            </Label>
                            <SheetClose asChild>
                              <button 
                                onClick={() => router.push("/forgot-password")}
                                className="text-[10px] font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-[#c9a84c]"
                              >
                                Forgot password?
                              </button>
                            </SheetClose>
                          </div>
                          <div className="group relative">
                            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-[#c9a84c]" />
                            <Input
                              id="password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter password"
                              autoComplete="current-password"
                              className="h-12 rounded-2xl border-white/10 bg-black/30 pl-11 text-white placeholder:text-white/25 focus-visible:border-[#c9a84c]/50 focus-visible:ring-[#c9a84c]/30"
                            />
                          </div>
                        </div>
                      </div>

                      {loginError && (
                        <div className="mt-4 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-xs leading-5 text-red-200">
                          {loginError}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px] uppercase tracking-widest text-white/45">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                        <ShieldCheck className="mb-2 h-4 w-4 text-[#c9a84c]" />
                        Secure login
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                        <User className="mb-2 h-4 w-4 text-[#c9a84c]" />
                        Auto role detect
                      </div>
                    </div>
                  </div>

                  <SheetFooter className="relative mt-auto flex flex-col gap-4 border-t border-white/10 bg-black/10 px-4 pt-5">
                    <Button
                      onClick={handleLogin}
                      disabled={isLoading || !username.trim() || !password.trim()}
                      className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#c9a84c] to-[#ff8c6b] font-black tracking-[0.14em] text-black shadow-[0_0_28px_rgba(201,168,76,0.22)] transition-all hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      {isLoading ? "LOGGING IN..." : "LOGIN"}
                    </Button>
                    
                    <div className="space-y-2 text-center">
                      <p className="text-[11px] uppercase tracking-widest text-white/40">Don't have an account?</p>
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          onClick={() => router.push("/register")}
                          className="h-11 w-full rounded-2xl border border-[#c9a84c]/25 bg-[#c9a84c]/5 font-bold text-[#c9a84c] hover:bg-[#c9a84c]/10 hover:text-[#c9a84c]"
                        >
                          REGISTER NOW
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
