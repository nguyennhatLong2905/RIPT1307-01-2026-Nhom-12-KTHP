"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => {
      setIsAnimatingOut(true);

      const removeTimer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "unset";
      }, 1000);

      return () => clearTimeout(removeTimer);
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] transition-all duration-1000 ease-in-out ${
        isAnimatingOut ? "opacity-0 scale-110 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Cinematic Lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[#c9a84c]/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0a_80%)]" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Main Brand Container */}
        <div className="relative mb-8 animate-fade-in-up">
          <div className="absolute inset-0 blur-3xl bg-[#c9a84c]/20 scale-150 rounded-full" />
          <h1
            className="relative text-5xl md:text-7xl font-bold tracking-[0.4em] pl-[0.4em] text-center text-transparent bg-clip-text bg-gradient-to-b from-[#f5e6ad] via-[#c9a84c] to-[#8a6d1d] drop-shadow-[0_0_20px_rgba(201,168,76,0.4)]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            LUXE CINEMA
          </h1>
          <div className="absolute inset-0 pointer-events-none mix-blend-overlay animate-shimmer opacity-50" />
        </div>

        {/* Decorative Divider Line */}
        <div className="w-48 md:w-200 h-[1px] relative animate-fade-in-up [animation-delay:0.3s]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent animate-expand" />
        </div>

        {/* Tagline */}
        <p className="mt-8 text-[10px] md:text-xs tracking-[1em] uppercase text-[#c9a84c]/60 animate-fade-in-up [animation-delay:0.6s]">
          {isAdmin ? "ADMINISTRATOR DASHBOARD" : "WELCOME TO LUXE CINEMA"}
        </p>
      </div>
    </div>
  );
}
