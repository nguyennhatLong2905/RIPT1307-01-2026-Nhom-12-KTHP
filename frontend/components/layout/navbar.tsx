"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  User,
  LogOut,
  LockKeyhole,
  LayoutDashboard,
  History,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { isAdmin, isLoggedIn } from "@/lib/auth-utils";
import { Movie } from "@/types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetDescription,
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
  const [showPassword, setShowPassword] = useState(false);
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
        if (Array.isArray(response.data)) setAllMovies(response.data);
      } catch (err) {
        console.error("Error loading movies for search:", err);
      }
    };
    fetchMoviesForSearch();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setIsSearching(true);
    const timer = setTimeout(() => {
      const filtered = allMovies.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery, allMovies]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setIsSheetOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [searchParams]);

  useEffect(() => {
    if (pathname === "/my-list") setActiveLink("MY LIST");
    else if (pathname === "/ai-picks") setActiveLink("AI PICKS");
    else if (pathname === "/") setActiveLink("MOVIES");
    else setActiveLink("");
  }, [pathname]);

  const handleLogin = async () => {
    setLoginError("");
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", { username, password });
      localStorage.setItem("token", response.data);
      if (isAdmin()) {
        router.push("/admin");
        setIsSheetOpen(false);
      } else {
        window.location.reload();
      }
    } catch {
      setLoginError("Incorrect username or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const userLoggedIn = mounted && typeof window !== "undefined" && !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: (typeof navLinks)[number]) => {
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
      setActiveLink(link.label);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full">
      {/* Top gold line */}
      <div
        className="absolute top-0 left-0 w-full h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #b8860b 30%, #ffd700 50%, #b8860b 70%, transparent 100%)",
        }}
      />

      <div
        className="flex items-center justify-between px-8 py-4"
        style={{ background: "linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-[0.15em]"
          style={{ color: "#c9a84c" }}
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              document.getElementById("hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        >
          LUXE CINEMA
        </Link>

        {/* Nav links */}
        {!pathname?.startsWith("/admin") && (
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
        )}

        {/* Right side: search + user */}
        <div className="flex items-center gap-4">
          {/* Search */}
          {!pathname?.startsWith("/admin") && (
            <div className="relative">
              <div
                className="flex items-center gap-3 rounded-full px-5 py-2 transition-all duration-300 focus-within:border-[#c9a84c]/50 focus-within:bg-white/10"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <Search size={16} style={{ color: "#c9a84c" }} />
                <input
                  type="text"
                  placeholder="SEARCH"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm tracking-widest outline-none w-28 placeholder:text-neutral-500 transition-all focus:w-44"
                  style={{ color: "#e0e0e0" }}
                  suppressHydrationWarning
                />
              </div>

              {/* Search dropdown */}
              {searchQuery.trim().length > 0 && (
                <div
                  className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-[#c9a84c]/15 bg-[#0d0d0d] p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl max-h-80 overflow-y-auto z-50"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(201,168,76,0.2) transparent" }}
                >
                  {isSearching ? (
                    <div className="p-4 text-center text-xs text-white/30 italic">Searching...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-white/30 italic">No results found</div>
                  ) : (
                    <div className="space-y-1">
                      {searchResults.map((movie) => (
                        <button
                          key={movie.id}
                          onClick={() => { router.push(`/movies/${movie.id}`); setSearchQuery(""); }}
                          className="flex w-full items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5 text-left group cursor-pointer"
                        >
                          {movie.posterUrl ? (
                            <img
                              src={movie.posterUrl}
                              alt={movie.title}
                              className="h-12 w-9 rounded-lg object-cover border border-white/10 group-hover:border-[#c9a84c]/30 transition-colors flex-shrink-0"
                            />
                          ) : (
                            <div className="h-12 w-9 rounded-lg bg-white/5 flex items-center justify-center text-[9px] text-white/30 border border-white/10 flex-shrink-0">
                              FILM
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-white/85 truncate group-hover:text-[#c9a84c] transition-colors">
                              {movie.title}
                            </div>
                            <div className="text-[10px] text-white/35 mt-0.5">
                              {movie.genre || "N/A"} · {movie.duration} min
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

          {/* User Sheet */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button
                className="flex items-center justify-center rounded-full p-2 -m-2 transition-colors duration-200 cursor-pointer hover:bg-white/8"
                style={{ color: "#c9a84c" }}
              >
                <User size={22} />
              </button>
            </SheetTrigger>

            <SheetContent
              className="flex flex-col border-l border-white/8 p-0"
              style={{ backgroundColor: "#0e0e0e", width: "360px" }}
            >
              {/* Hidden accessible title — required by Radix Dialog */}
              <SheetTitle className="sr-only">
                {userLoggedIn ? "Account menu" : "Sign in to Luxe Cinema"}
              </SheetTitle>
              <SheetDescription className="sr-only">
                {userLoggedIn
                  ? "Navigate to your account sections or sign out."
                  : "Enter your credentials to access your account."}
              </SheetDescription>

              {userLoggedIn ? (
                /* ── LOGGED IN ── */
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="px-8 pt-10 pb-6 border-b border-white/6">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#c9a84c]/12 flex items-center justify-center border border-[#c9a84c]/25">
                        <User size={28} className="text-[#c9a84c]" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-white/35 uppercase tracking-[0.2em] font-medium">
                          {mounted && isAdmin() ? "Administrator" : "Member"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Nav items */}
                  <div className="flex-1 px-4 py-4 space-y-1">
                    {mounted && isAdmin() ? (
                      <>
                        <SheetClose asChild>
                          <button
                            onClick={() => router.push("/admin")}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-white/75 hover:text-white hover:bg-white/6 transition-all group"
                          >
                            <LayoutDashboard size={16} className="text-[#c9a84c] flex-shrink-0" />
                            <span className="flex-1 text-left">Admin Dashboard</span>
                            <ChevronRight size={14} className="text-white/20 group-hover:text-white/40 transition-colors" />
                          </button>
                        </SheetClose>
                        <SheetClose asChild>
                          <button
                            onClick={() => router.push("/profile")}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-white/75 hover:text-white hover:bg-white/6 transition-all group"
                          >
                            <User size={16} className="text-[#c9a84c] flex-shrink-0" />
                            <span className="flex-1 text-left">Admin Profile</span>
                            <ChevronRight size={14} className="text-white/20 group-hover:text-white/40 transition-colors" />
                          </button>
                        </SheetClose>
                      </>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <button
                            onClick={() => router.push("/bookings")}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-white/75 hover:text-white hover:bg-white/6 transition-all group"
                          >
                            <History size={16} className="text-[#c9a84c] flex-shrink-0" />
                            <span className="flex-1 text-left">Booking History</span>
                            <ChevronRight size={14} className="text-white/20 group-hover:text-white/40 transition-colors" />
                          </button>
                        </SheetClose>
                        <SheetClose asChild>
                          <button
                            onClick={() => router.push("/profile")}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-white/75 hover:text-white hover:bg-white/6 transition-all group"
                          >
                            <User size={16} className="text-[#c9a84c] flex-shrink-0" />
                            <span className="flex-1 text-left">My Profile</span>
                            <ChevronRight size={14} className="text-white/20 group-hover:text-white/40 transition-colors" />
                          </button>
                        </SheetClose>
                      </>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="px-4 pb-8 pt-2 border-t border-white/6">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/8 transition-all"
                    >
                      <LogOut size={16} className="flex-shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* ── LOGIN ── */
                <div className="flex flex-col h-full">
                  {/* Decorative */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#c9a84c]/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-[#c9a84c]/5 blur-3xl" />
                  </div>

                  {/* Header */}
                  <div className="relative px-8 pt-12 pb-8">
                    <div className="mb-6 w-12 h-12 rounded-2xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center">
                      <LockKeyhole size={20} className="text-[#c9a84c]" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
                      Welcome back
                    </h2>
                    <p className="text-sm text-white/35 leading-relaxed">
                      Sign in to access your Luxe Cinema account.
                    </p>
                  </div>

                  {/* Form */}
                  <div className="relative flex-1 px-8 space-y-5">
                    {/* Username */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
                        Username
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 pointer-events-none" />
                        <input
                          id="login-username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter username"
                          autoComplete="username"
                          required
                          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                          className="w-full h-11 pl-10 pr-4 rounded-xl text-sm text-white placeholder:text-white/20 outline-none transition-all"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.09)",
                          }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/40">
                          Password
                        </label>
                        <SheetClose asChild>
                          <button
                            onClick={() => router.push("/forgot-password")}
                            className="text-[10px] text-white/30 hover:text-[#c9a84c] transition-colors tracking-wide"
                          >
                            Forgot password?
                          </button>
                        </SheetClose>
                      </div>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25 pointer-events-none" />
                        <input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          autoComplete="current-password"
                          required
                          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                          className="w-full h-11 pl-10 pr-10 rounded-xl text-sm text-white placeholder:text-white/20 outline-none transition-all"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.09)",
                          }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Error */}
                    {loginError && (
                      <div className="rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-3 text-xs text-red-300/80 leading-relaxed">
                        {loginError}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="relative px-8 pb-8 pt-6 mt-6 space-y-3">
                    <button
                      onClick={handleLogin}
                      disabled={isLoading || !username.trim() || !password.trim()}
                      className="w-full h-11 rounded-xl text-sm font-bold tracking-[0.08em] text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
                      style={{
                        background: "linear-gradient(135deg, #c9a84c 0%, #e8c76a 50%, #c9a84c 100%)",
                      }}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-white/6" />
                      <span className="text-[10px] text-white/25 uppercase tracking-widest">or</span>
                      <div className="flex-1 h-px bg-white/6" />
                    </div>

                    <SheetClose asChild>
                      <button
                        onClick={() => router.push("/register")}
                        className="w-full h-11 rounded-xl text-sm font-semibold text-white/50 hover:text-white transition-all border border-white/8 hover:border-white/15 hover:bg-white/4"
                      >
                        Create an account
                      </button>
                    </SheetClose>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
