"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Play, Plus } from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Trigger entrance animations on every mount
  useEffect(() => {
    setMounted(false);
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    let animationId: number;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const playScroll = () => {
      if (!isDown && el) {
        el.scrollLeft += 1;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      animationId = requestAnimationFrame(playScroll);
    };
    
    animationId = requestAnimationFrame(playScroll);
    
    const handlePointerDown = (e: PointerEvent) => { 
      isDown = true; 
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };
    const handlePointerUp = () => { 
      isDown = false; 
      el.style.cursor = 'grab';
    };
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 2;
      el.scrollLeft = scrollLeft - walk;
      
      if (el.scrollLeft >= el.scrollWidth / 2) {
         el.scrollLeft -= el.scrollWidth / 2;
         startX = e.pageX - el.offsetLeft;
         scrollLeft = el.scrollLeft;
      } else if (el.scrollLeft <= 0) {
         el.scrollLeft += el.scrollWidth / 2;
         startX = e.pageX - el.offsetLeft;
         scrollLeft = el.scrollLeft;
      }
    };
    
    el.addEventListener("pointerdown", handlePointerDown);
    el.addEventListener("pointerup", handlePointerUp);
    el.addEventListener("pointerleave", handlePointerUp);
    el.addEventListener("pointermove", handlePointerMove);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener("pointerdown", handlePointerDown);
      el.removeEventListener("pointerup", handlePointerUp);
      el.removeEventListener("pointerleave", handlePointerUp);
      el.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <div id="hero" className="w-full flex flex-col bg-black overflow-hidden">
      <div 
        className="w-full min-h-[80vh] flex flex-col relative overflow-hidden"
      >
        {/* Animated Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: mounted ? 'translateX(0)' : 'translateX(80px)',
            opacity: mounted ? 1 : 0,
            transition: 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s ease',
          }}
        >
          <source src="/images/Dune - video.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none z-10" />

        {/* Hero Content */}
        <div
          className="flex-1 flex flex-col justify-end px-6 md:px-12 w-full pb-8 z-20"
          style={{
            transform: mounted ? 'translateX(0)' : 'translateX(-80px)',
            opacity: mounted ? 1 : 0,
            transition: 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s ease',
          }}
        >
          <h1 className="text-white text-5xl md:text-5xl mb-4 drop-shadow-md">
            DUNE: PART TWO
          </h1>
          <p className="text-[#FFD873] text-lg font-medium mb-2">
            Denis Villeneuve
          </p>
          
          <div className="flex flex-col items-start gap-0 mb-8">
            <p className="text-white text-base max-w-md leading-relaxed drop-shadow-sm">
              2024 - A - 2 Seasons<br/>
              Sci-Fi | Epic | Action &amp; Adventure | Drama
            </p>
            <div className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm border border-white/10 cursor-default">
              <Star className="w-5 h-5 fill-[#E9C349] text-[#E9C349]" />
              <span className="text-white text-lg font-semibold">8.4<span className="text-white/60 text-sm">/10</span></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <button
              onClick={() => router.push("/movies/m1")}
              className="flex items-center justify-center py-2 px-4 gap-3 rounded-[15px] hover:opacity-90 hover:scale-105 transition-all shadow-lg cursor-pointer" 
              style={{ background: "linear-gradient(180deg, #F40845, #F57C26)" }}
            >
              <Play className="w-5 h-5 fill-white text-white" />
              <span className="text-white text-lg font-medium">Book now</span>
            </button>
            <button className="flex items-center justify-center bg-white/10 py-2 px-4 gap-3 rounded-[15px] border border-white/20 hover:bg-white/20 hover:scale-105 transition-all backdrop-blur-sm cursor-pointer shadow-lg">
              <Plus className="w-5 h-5 text-white" />
              <span className="text-white text-lg font-medium">My list</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Movies Marquee Below Hero */}
      <div className="bg-black py-8 border-t border-[#4D46351A] w-full overflow-hidden relative">
        <div 
          ref={scrollRef}
          className="flex w-full overflow-x-hidden select-none cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        >
          <div className="flex w-max">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-5 items-center pr-5">
                {[
                  { src: "/images/titanic.avif", alt: "titanic" },
                  { src: "/images/canthislove.webp", alt: "can this love" },
                  { src: "/images/avatar3.jpg", alt: "avatar 3" },
                  { src: "/images/chuyentausinhtu.jpg", alt: "chuyen tau sinh tu" },
                  { src: "/images/greenbook.jpg", alt: "greenbook" },
                ].map((movie, idx) => (
                  <img 
                    key={idx} 
                    alt={movie.alt} 
                    src={movie.src} 
                    draggable={false}
                    className="w-[200px] md:w-[200px] lg:w-[300px] h-48 lg:h-40 object-cover rounded-lg hover:opacity-80 hover:scale-[1.02] transition-all shadow-lg shrink-0" 
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
