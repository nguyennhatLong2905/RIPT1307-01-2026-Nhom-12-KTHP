"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Ticket, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  image: string;
  imdb: number;
  rating: string;
  year: number;
  duration: string;
}

const movies: Movie[] = [
  { id: 1, title: "Inception", originalTitle: "Inception", image: "/images/inception.jpeg", imdb: 8.8, rating: "T13", year: 2010, duration: "2h 28m" },
  { id: 2, title: "Chúa Tể Của Những Chiếc Nhẫn", originalTitle: "The Lord of the Rings", image: "/images/lordofring.jpg", imdb: 8.9, rating: "T13", year: 2001, duration: "3h 28m" },
  { id: 3, title: "Avatar 3", originalTitle: "Avatar", image: "/images/avatar3.jpg", imdb: 7.9, rating: "T13", year: 2025, duration: "2h 40m" },
  { id: 4, title: "Godzilla vs. Kong", originalTitle: "Kong", image: "/images/kong.jpg", imdb: 6.3, rating: "T13", year: 2021, duration: "1h 53m" },
  { id: 5, title: "Mai", originalTitle: "Mai", image: "/images/mai.jpg", imdb: 7.1, rating: "T16", year: 2024, duration: "2h 15m" },
  { id: 6, title: "F1: The Movie", originalTitle: "F1", image: "/images/f1.jpg", imdb: 7.5, rating: "T13", year: 2025, duration: "2h 10m" },
  { id: 7, title: "Star Wars", originalTitle: "Star Wars", image: "/images/star war.jpg", imdb: 8.6, rating: "T13", year: 1977, duration: "2h 1m" },
  { id: 8, title: "Hoppers", originalTitle: "Hoppers", image: "/images/hoppers.jpg", imdb: 7.2, rating: "T16", year: 2024, duration: "1h 55m" },
  { id: 9, title: "Inception 2", originalTitle: "Inception", image: "/images/inception.jpeg", imdb: 8.8, rating: "T13", year: 2010, duration: "2h 28m" },
  { id: 10, title: "Lilo & Stitch", originalTitle: "LILO & STITCH", image: "/images/LILO & STITCH (LIVE-ACTION).jpg", imdb: 6.8, rating: "P", year: 2025, duration: "1h 48m" },
  { id: 11, title: "Mưa Đỏ", originalTitle: "Red Rain", image: "/images/mưa đỏ.jpg", imdb: 6.5, rating: "T18", year: 2024, duration: "1h 50m" },
  { id: 12, title: "Peaky Blinders", originalTitle: "Peaky Blinders: The Immortal Man", image: "/images/peaky-blinders-the-immortal-man-2026-i-watched-the-last-v0-fspfnz9khgqg1.webp", imdb: 8.7, rating: "T18", year: 2026, duration: "2h 20m" },
  { id: 13, title: "Kỵ Sĩ Bóng Đêm", originalTitle: "The Dark Knight", image: "/images/Poster_phim_Kỵ_sĩ_bóng_đêm_2008.jpg", imdb: 9.0, rating: "T13", year: 2008, duration: "2h 32m" },
  { id: 14, title: "Project Hail Mary", originalTitle: "Project Hail Mary", image: "/images/Project_Hail_Mary_poster.jpg", imdb: 8.3, rating: "T13", year: 2025, duration: "2h 20m" },
  { id: 15, title: "Spider-Man: Brand New Day", originalTitle: "Ultimate Spider-Man", image: "/images/spider-man-brand-new-day-as-ultimate-spider-man-2024-cover-v0-jpw1tpp43whf1.webp", imdb: 7.8, rating: "T13", year: 2024, duration: "1h 45m" },
  { id: 16, title: "The Fantastic Four: First Steps", originalTitle: "The Fantastic Four", image: "/images/THE FANTASTIC FOUR- FIRST STEPS.jpg", imdb: 7.6, rating: "T13", year: 2025, duration: "2h 5m" },
];

interface PopupProps {
  movie: Movie;
  anchorRect: DOMRect;
  liked: boolean;
  onLike: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const POPUP_WIDTH = 440;
const POPUP_HEIGHT = 500;

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
            IMDb {movie.imdb.toFixed(1)}
          </Badge>
          <span className="text-white/50 text-xs">{movie.year}</span>
          <span className="flex items-center gap-1 text-white/50 text-xs">
            <Clock size={12} />
            {movie.duration}
          </span>
        </div>

        <div className="flex gap-2.5">
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

function MovieCard({ movie }: { movie: Movie }) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);
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

  return (
    <>
      <div
        ref={cardRef}
        className="flex-none w-[200px] md:w-[240px] h-[300px] md:h-[360px] snap-center rounded-xl overflow-hidden relative cursor-pointer shadow-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          alt={movie.title}
          src={movie.image}
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? "scale-110" : "scale-100"}`}
        />
      </div>

      {hovered && anchorRect && (
        <HoverPopup
          movie={movie}
          anchorRect={anchorRect}
          liked={liked}
          onLike={() => setLiked((p) => !p)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </>
  );
}

export default function Trending() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });

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

          {/* Header */}
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

          {/* Scrollable cards */}
          <div
            ref={scrollContainerRef}
            className="trending-scroll flex items-end gap-6 overflow-x-auto snap-x snap-mandatory pb-4 w-full"
            style={{ scrollbarWidth: "none" }}
          >
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
