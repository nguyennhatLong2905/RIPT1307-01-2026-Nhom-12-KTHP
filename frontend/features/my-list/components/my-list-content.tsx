"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/features/shared";
import { wishlistService } from "@/features/home/services/wishlist-service";
import { Movie as MovieType } from "@/types";

export default function MyListContent() {
  const [list, setList] = useState<MovieType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await wishlistService.getWishlist();
        setList(data);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = (id: number) => {
    setList(prev => prev.filter(m => m.id !== id));
  };

  if (isLoading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#c9a84c] animate-pulse">LOADING LIST...</div>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes trendingPopIn {
            from { opacity: 0; transform: scale(0.92) translateY(8px); }
            to   { opacity: 1; transform: scale(1)    translateY(0);    }
          }
        `,
      }} />

      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-8 w-full">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight">My List</h1>
              <p className="text-white/60 text-sm md:text-base">
                Your favorite movies. Ready to book any time.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#E9C349] bg-[#E9C349]/10 px-4 py-2 rounded-full border border-[#E9C349]/20">
              <Heart size={16} fill="currentColor" />
              <span>{list.length} favorite movies</span>
            </div>
          </div>

          {/* Grid */}
          {list.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 mt-4">
              {list.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  isInitiallyLiked={true}
                  className="w-full aspect-[2/3] rounded-xl overflow-hidden relative cursor-pointer shadow-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] group"
                  onRemove={() => handleRemove(movie.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center border border-white/5 rounded-2xl bg-white/[0.02]">
              <Heart className="w-16 h-16 text-white/20 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">List is empty</h3>
              <p className="text-white/50 max-w-sm mb-6">
                You haven't added any movies to your favorites list yet.
              </p>
              <Button
                onClick={() => window.location.href = '/'}
                className="font-semibold text-black bg-[#E9C349] hover:bg-[#f0d060] rounded-xl px-8"
              >
                Explore now
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
