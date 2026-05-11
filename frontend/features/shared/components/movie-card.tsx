"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Ticket, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Movie as MovieType } from "@/types";
import { wishlistService } from "@/features/home/services/wishlist-service";
import { isLoggedIn } from "@/lib/auth-utils";

interface PopupProps {
  movie: MovieType;
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
      <div 
        onClick={() => router.push(`/movies/${movie.id}`)}
        className="relative w-full h-[230px] overflow-hidden cursor-pointer group/poster"
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/poster:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1c1c2e]" />
        <Badge
          className="absolute top-3 right-3 border-[#E9C349]/50 bg-black/65 text-[#E9C349] font-bold text-[11px] px-2.5 py-0.5 rounded-lg"
          variant="outline"
        >
          {movie.genre.split(',')[0]}
        </Badge>
      </div>

      <div className="px-5 pb-5 pt-4 flex flex-col gap-3">
        <div 
          onClick={() => router.push(`/movies/${movie.id}`)}
          className="cursor-pointer group/title"
        >
          <h3 className="text-white font-bold text-lg leading-snug group-hover/title:text-[#E9C349] transition-colors line-clamp-2">{movie.title}</h3>
          <p className="text-[#E9C349] text-[13px] mt-0.5 opacity-80 group-hover/title:opacity-100">{movie.director}</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Badge
            variant="outline"
            className="border-[#E9C349] text-[#E9C349] font-bold text-[11px] px-2 py-0.5 rounded-md"
          >
            HD
          </Badge>
          <span className="text-white/50 text-xs">{new Date(movie.releaseDate || '').getFullYear()}</span>
          <span className="flex items-center gap-1 text-white/50 text-xs">
            <Clock size={12} />
            {movie.duration} min
          </span>
        </div>

        <div className="flex gap-2.5">
          <Button
            onClick={() => router.push(`/movies/${movie.id}`)}
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

interface MovieCardProps {
  movie: MovieType;
  isInitiallyLiked?: boolean;
  className?: string;
  onRemove?: () => void;
}

export default function MovieCard({ movie, isInitiallyLiked = false, className, onRemove }: MovieCardProps) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(isInitiallyLiked);
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

  const toggleLike = async () => {
    if (!isLoggedIn()) {
      window.location.href = "/?login=true";
      return;
    }

    try {
      if (liked) {
        await wishlistService.removeFromWishlist(movie.id);
        if (onRemove) onRemove();
      } else {
        await wishlistService.addToWishlist(movie.id);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error updating my list:", error);
    }
  };

  useEffect(() => () => { if (leaveTimer.current) clearTimeout(leaveTimer.current); }, []);

  return (
    <>
      <div
        ref={cardRef}
        className={className || "flex-none w-[200px] md:w-[240px] h-[300px] md:h-[360px] snap-center rounded-xl overflow-hidden relative cursor-pointer shadow-lg transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)]"}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          alt={movie.title}
          src={movie.posterUrl}
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? "scale-110" : "scale-100"}`}
        />
      </div>

      {hovered && anchorRect && (
        <HoverPopup
          movie={movie}
          anchorRect={anchorRect}
          liked={liked}
          onLike={toggleLike}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </>
  );
}
