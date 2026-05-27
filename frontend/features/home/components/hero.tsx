"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Play, Heart, Ticket } from "lucide-react";
import { movieService } from "../services/movie-service";
import { wishlistService } from "../services/wishlist-service";
import { Movie } from "@/types";
import { isLoggedIn } from "@/lib/auth-utils";

export default function Hero() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isLoading) return;

    let animationId: number;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const playScroll = () => {
      if (!isDown && el) {
        el.scrollLeft += 0.8;
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
      el.style.scrollBehavior = 'auto';
    };

    const handlePointerUp = () => {
      isDown = false;
      el.style.cursor = 'grab';
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1.5;
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
    window.addEventListener("pointerup", handlePointerUp);
    el.addEventListener("pointermove", handlePointerMove);

    return () => {
      cancelAnimationFrame(animationId);
      el.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      el.removeEventListener("pointermove", handlePointerMove);
    };
  }, [isLoading, movies]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const allMovies = await movieService.getAllMovies();
        setMovies(allMovies);
        if (allMovies.length > 0) {
          const chosen = allMovies[0];
          setHeroMovie(chosen);
          
          if (isLoggedIn()) {
            const wishlist = await wishlistService.getWishlist();
            setIsLiked(wishlist.some(m => m.id === chosen.id));
          }
        }
      } catch (error) {
        console.error("Error loading Hero movie:", error);
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };
    fetchData();
  }, []);

  const handleBookNow = () => {
    if (heroMovie) {
      router.push(`/movies/${heroMovie.id}`);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn()) {
      window.location.href = "/?login=true";
      return;
    }
    if (!heroMovie) return;

    try {
      if (isLiked) {
        await wishlistService.removeFromWishlist(heroMovie.id);
      } else {
        await wishlistService.addToWishlist(heroMovie.id);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating my list:", error);
    }
  };

  if (isLoading || !heroMovie) {
    return <div className="w-full h-[80vh] bg-black flex items-center justify-center text-[#c9a84c]">Luxe Cinema...</div>;
  }

  const trailerUrl = heroMovie.trailerUrl;
  const isVideo = trailerUrl?.match(/\.(mp4|webm|ogg|mov)$/i) || trailerUrl?.includes("video/upload");

  return (
    <div id="hero" className="w-full flex flex-col bg-black overflow-hidden">
      <div className="w-full min-h-[80vh] flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 z-0 transition-opacity duration-1000" style={{ opacity: mounted ? 1 : 0 }}>
          {isVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60"
              key={trailerUrl}
            >
              <source src={trailerUrl} type="video/mp4" />
            </video>
          ) : (
            <img
              src={heroMovie.posterUrl}
              alt={heroMovie.title}
              className="w-full h-full object-cover opacity-50"
            />
          )}
        </div>

        <div
          className="flex-1 flex flex-col justify-end px-6 md:px-12 w-full pb-16 z-20"
          style={{
            transform: mounted ? 'translateX(0)' : 'translateX(-80px)',
            opacity: mounted ? 1 : 0,
            transition: 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s ease',
          }}
        >
          <div className="flex flex-col gap-4 mb-5">
            <h1 className="text-white text-5xl md:text-6xl font-bold uppercase tracking-tighter drop-shadow-xl max-w-2xl">
              {heroMovie.title}
            </h1>
            <p className="text-[#E9C349] text-lg font-bold italic tracking-widest uppercase">
              {heroMovie.director}
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 mb-8">
            <div className="flex items-center gap-4 text-white/70 text-sm font-medium">
               <span>{new Date(heroMovie.releaseDate || '').getFullYear()}</span>
               <span className="w-1 h-1 bg-white/30 rounded-full" />
               <span className="uppercase">{heroMovie.genre}</span>
               <span className="w-1 h-1 bg-white/30 rounded-full" />
               <span>{heroMovie.duration} MIN</span>
            </div>
            
            <div className="flex items-center gap-2 bg-[#E9C349]/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-[#E9C349]/20">
              <Star className="w-5 h-5 fill-[#E9C349] text-[#E9C349]" />
              <span className="text-white text-md font-bold">9.0<span className="text-white/40 text-sm ml-1 font-normal">/ 10</span></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={handleBookNow}
              className="flex items-center justify-center py-4 px-6 gap-3 rounded-2xl hover:brightness-110 hover:scale-105 transition-all shadow-[0_10px_30px_rgba(244,8,69,0.3)] cursor-pointer"
              style={{ background: "linear-gradient(135deg, #F40845, #F57C26)" }}
            >
              <Ticket size={20}/>
              <span className="text-white text-md font-bold uppercase tracking-wider">Book now</span>
            </button>
            <button 
              onClick={handleToggleWishlist}
              className={`flex items-center justify-center py-4 px-6 gap-3 rounded-2xl border transition-all backdrop-blur-md cursor-pointer shadow-xl ${
                isLiked 
                ? "bg-[#E9C349]/20 border-[#E9C349] text-[#E9C349]" 
                : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105"
              }`}
            >
              <Heart size={20} className={`${isLiked ? "fill-[#E9C349]" : ""}`} />
              <span className="text-md font-bold uppercase tracking-wider">My list</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-black py-10 border-t border-white/5 w-full relative group">
        <style dangerouslySetInnerHTML={{
          __html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `,
        }} />
        
        <div 
          ref={scrollRef}
          className="flex w-full overflow-x-auto hide-scrollbar select-none cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'pan-y' }}
        >
          <div className="flex w-max gap-6 px-6">
            {[...movies, ...movies].map((movie, idx) => (
              <img
                key={`${movie.id}-${idx}`}
                alt={movie.title}
                src={movie.posterUrl}
                draggable={false}
                onClick={() => router.push(`/movies/${movie.id}`)}
                className="w-[180px] md:w-[220px] lg:w-[280px] h-[120px] md:h-[150px] lg:h-[180px] object-cover rounded-2xl hover:opacity-100 opacity-60 hover:scale-105 transition-all shadow-2xl cursor-pointer border border-white/5 flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
