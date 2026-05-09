"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Ticket, Heart, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Movie } from "@/types";



const myMovies: Movie[] = [
  { id: 1, title: "Inception", originalTitle: "Inception", image: "/images/inception.jpeg", imdb: 8.8, rating: "T13", year: 2010, duration: "2h 28m" },
  { id: 2, title: "Chúa Tể Của Những Chiếc Nhẫn", originalTitle: "The Lord of the Rings", image: "/images/lordofring.jpg", imdb: 8.9, rating: "T13", year: 2001, duration: "3h 28m" },
  { id: 3, title: "Avatar 3", originalTitle: "Avatar", image: "/images/avatar3.jpg", imdb: 7.9, rating: "T13", year: 2025, duration: "2h 40m" },
  { id: 4, title: "Godzilla vs. Kong", originalTitle: "Kong", image: "/images/kong.jpg", imdb: 6.3, rating: "T13", year: 2021, duration: "1h 53m" },
  { id: 5, title: "Mai", originalTitle: "Mai", image: "/images/mai.jpg", imdb: 7.1, rating: "T16", year: 2024, duration: "2h 15m" },
  { id: 6, title: "F1: The Movie", originalTitle: "F1", image: "/images/f1.jpg", imdb: 7.5, rating: "T13", year: 2025, duration: "2h 10m" },
  { id: 7, title: "Star Wars", originalTitle: "Star Wars", image: "/images/star war.jpg", imdb: 8.6, rating: "T13", year: 1977, duration: "2h 1m" },
  { id: 8, title: "Hoppers", originalTitle: "Hoppers", image: "/images/hoppers.jpg", imdb: 7.2, rating: "T16", year: 2024, duration: "1h 55m" },
];

const POPUP_WIDTH = 440;
const POPUP_HEIGHT = 500;

interface PopupProps {
  movie: Movie;
  anchorRect: DOMRect;
  liked: boolean;
  onLike: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function HoverPopup({ movie, anchorRect, liked, onLike, onMouseEnter, onMouseLeave }: PopupProps) {
  const router = useRouter();

  const cardCenterX = anchorRect.left + anchorRect.width / 2;
  const cardCenterY = anchorRect.top + anchorRect.height / 2;

  const left = Math.max(8, Math.min(cardCenterX - POPUP_WIDTH / 2, window.innerWidth - POPUP_WIDTH - 8));
  const top = Math.max(8, Math.min(cardCenterY - POPUP_HEIGHT / 2, window.innerHeight - POPUP_HEIGHT - 8));

  return createPortal(
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fixed z-[9999] w-[440px] rounded-2xl overflow-hidden shadow-2xl border border-white/[0.08] [animation:trendingPopIn_0.25s_cubic-bezier(0.34,1.4,0.64,1)_forwards] [background:linear-gradient(160deg,#1c1c2e_0%,#16213e_60%,#0f3460_100%)]"
      style={{ top, left }}
    >
      {/* Poster */}
      <div className="relative w-full h-[230px] overflow-hidden">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1c1c2e]" />
        <Badge
          className="absolute top-3 right-3 border-[#E9C349]/50 bg-black/65 text-[#E9C349] font-bold text-[11px] px-2.5 py-0.5 rounded-lg"
          variant="outline"
        >
          {movie.rating}
        </Badge>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 pt-4 flex flex-col gap-3">
        <div>
          <h3 className="text-white font-bold text-lg leading-snug">{movie.title}</h3>
          <p className="text-[#E9C349] text-[13px] mt-0.5">{movie.originalTitle}</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Badge
            variant="outline"
            className="border-[#E9C349] text-[#E9C349] font-bold text-[11px] px-2 py-0.5 rounded-md"
          >
            IMDb {movie.imdb?.toFixed(1) || 'N/A'}
          </Badge>
          <span className="text-white/50 text-xs">{movie.year}</span>
          <span className="flex items-center gap-1 text-white/50 text-xs">
            <Clock size={12} />
            {movie.duration}
          </span>
        </div>

        <div className="flex gap-2.5 mt-2">
          <Button
            onClick={() => router.push(`/movies/m1`)}
            className="flex-1 gap-1.5 font-bold text-sm text-black rounded-xl py-2.5 h-auto [background:linear-gradient(90deg,#E9C349,#f0d060)] hover:brightness-105 border-none"
          >
            <Ticket size={15} />
            Book Now
          </Button>
          <Button
            variant="outline"
            onClick={(e) => { e.stopPropagation(); onLike(); }}
            className={`gap-1.5 rounded-xl py-2.5 h-auto font-semibold text-sm transition-colors ${liked
              ? "border-[#E9C349] bg-[#E9C349]/15 text-[#E9C349] hover:bg-[#E9C349]/20"
              : "border-white/20 bg-white/[0.08] text-white hover:bg-white/15"
              }`}
          >
            <Heart size={14} fill={liked ? "#E9C349" : "none"} />
            MY LIST
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function MovieCard({ movie, onRemove }: { movie: Movie, onRemove?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(true);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    if (cardRef.current) setAnchorRect(cardRef.current.getBoundingClientRect());
    setHovered(true);
  };

  const handleMouseLeave = () => {
    leaveTimer.current = setTimeout(() => setHovered(false), 120);
  };

  useEffect(() => () => { if (leaveTimer.current) clearTimeout(leaveTimer.current); }, []);

  const handleLike = () => {
    setLiked(!liked);
    if (onRemove) {
      setTimeout(onRemove, 300);
    }
  };

  return (
    <>
      <div
        ref={cardRef}
        className="w-full aspect-[2/3] rounded-xl overflow-hidden relative cursor-pointer shadow-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)] group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          alt={movie.title}
          src={movie.image}
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? "scale-110" : "scale-100"}`}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#E9C349] flex items-center justify-center text-black shadow-[0_0_15px_rgba(233,195,73,0.5)]">
            <Play className="w-5 h-5 ml-1" fill="currentColor" />
          </div>
        </div>
      </div>

      {hovered && anchorRect && (
        <HoverPopup
          movie={movie}
          anchorRect={anchorRect}
          liked={liked}
          onLike={handleLike}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </>
  );
}

export default function MyListContent() {
  const [list, setList] = useState<Movie[]>(myMovies);

  const handleRemove = (id: string | number) => {
    setList(prev => prev.filter(m => m.id !== id));
  };

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
                Your saved movies and shows. Ready to book anytime.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#E9C349] bg-[#E9C349]/10 px-4 py-2 rounded-full border border-[#E9C349]/20">
              <Heart size={16} fill="currentColor" />
              <span>{list.length} Items Saved</span>
            </div>
          </div>

          {/* Grid */}
          {list.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 mt-4">
              {list.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onRemove={() => handleRemove(movie.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center border border-white/5 rounded-2xl bg-white/[0.02]">
              <Heart className="w-16 h-16 text-white/20 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Your list is empty</h3>
              <p className="text-white/50 max-w-sm mb-6">
                Looks like you haven&apos;t added any movies or TV shows to your list yet.
              </p>
              <Button
                onClick={() => window.location.href = '/'}
                className="font-semibold text-black bg-[#E9C349] hover:bg-[#f0d060] rounded-xl px-8"
              >
                Explore Movies
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
