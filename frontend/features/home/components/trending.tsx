"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Ticket, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { movieService } from "../services/movie-service";
import { Movie as MovieType } from "@/types";

import { MovieCard } from "@/features/shared";
import { wishlistService } from "../services/wishlist-service";
import { isLoggedIn } from "@/lib/auth-utils";

export default function Trending() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieData = await movieService.getAllMovies();
        setMovies(movieData);

        if (isLoggedIn()) {
          const wishData = await wishlistService.getWishlist();
          setWishlistIds(wishData.map(m => m.id));
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const scrollLeft = () => scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  if (isLoading) return <div className="w-full bg-black py-18 text-center text-[#c9a84c] animate-pulse">LOADING MOVIES...</div>;

  return (
    <div id="trending" className="w-full bg-black py-18">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes trendingPopIn {
            from { opacity: 0; transform: scale(0.92) translateY(8px); }
            to   { opacity: 1; transform: scale(1)    translateY(0);    }
          }
          .trending-scroll::-webkit-scrollbar { display: none; }
        `,
      }} />

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-8 w-full">

          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <h2 className="text-[#E5E2E1] text-3xl md:text-4xl">Trending</h2>
              <p className="text-[#E9C349] text-xs md:text-sm uppercase tracking-wider font-semibold">
                Curated by our masters of cinema
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollLeft}
                className="rounded-xl border-white/10 bg-transparent hover:bg-white/10 text-white/70 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollRight}
                className="rounded-xl border-white/10 bg-transparent hover:bg-white/10 text-white/70 hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div
            ref={scrollContainerRef}
            className="trending-scroll flex items-end gap-6 overflow-x-auto snap-x snap-mandatory pb-4 w-full"
            style={{ scrollbarWidth: "none" }}
          >
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                isInitiallyLiked={wishlistIds.includes(movie.id)}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
