"use client";

import { Movie } from "@/types";
import { Star, Clock, Tag } from "lucide-react";
import { useState, useEffect } from "react";

interface ExtendedMovie extends Movie {
  poster?: string;
  rating?: number;
  cast?: string;
  synopsis?: string;
}

export function MovieDetails({ movie }: { movie: ExtendedMovie }) {
  const [isVideoReady, setIsVideoReady] = useState(false);

  const getYouTubeId = (url: string | undefined) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(movie.trailerUrl);
  const isLocalVideo = movie.trailerUrl?.includes("/api/files/") || movie.trailerUrl?.match(/\.(mp4|webm|ogg)$/i);
  const videoSource = isLocalVideo ? (movie.trailerUrl?.startsWith("http") ? movie.trailerUrl : `http://localhost:8080${movie.trailerUrl}`) : null;

  useEffect(() => {
    if (videoId || isLocalVideo) {
      const timer = setTimeout(() => setIsVideoReady(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setIsVideoReady(false);
    }
  }, [videoId, isLocalVideo]);

  return (
    <div className="relative h-full w-full bg-black text-white p-10 flex flex-col justify-center overflow-hidden">
      {/* Background Section */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden bg-black">
        {videoId ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <iframe
              className={`absolute inset-0 w-[150%] h-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 ${isVideoReady ? 'opacity-70' : 'opacity-0'}`}
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&showinfo=0&playsinline=1`}
              allow="autoplay; encrypted-media"
              frameBorder="0"
              style={{ pointerEvents: 'none' }}
            />
          </div>
        ) : isLocalVideo ? (
          <div className="absolute inset-0 w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isVideoReady ? 'opacity-70' : 'opacity-0'}`}
            >
              <source src={videoSource!} type="video/mp4" />
            </video>
          </div>
        ) : null}

        {/* Poster fallback */}
        {!isVideoReady && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url('${movie.poster || movie.posterUrl}')` }}
          />
        )}
        
        <div className="absolute inset-0 bg-black/10 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20" />
      </div>

      {/* Content Section */}
      <div className="relative z-30 space-y-6 max-w-lg animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <h1 className="text-6xl font-bold uppercase leading-tight tracking-wider drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">{movie.title}</h1>

        <div className="flex items-center gap-6 text-[#DAB254] flex-wrap">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="font-bold text-sm tracking-widest">{movie.rating || 9.0} IMDB</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl">
            <Tag size={14} className="text-[#DAB254]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{movie.genre}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl">
            <Clock size={14} className="text-[#DAB254]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{movie.duration} MIN</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-4">
          <div>
            <h3 className="text-[#DAB254] text-[10px] font-bold tracking-[0.2em] mb-2 uppercase">Director</h3>
            <p className="text-sm font-medium text-white drop-shadow-md">{movie.director}</p>
          </div>
          <div>
            <h3 className="text-[#DAB254] text-[10px] font-bold tracking-[0.2em] mb-2 uppercase">Cast</h3>
            <p className="text-sm font-medium text-white drop-shadow-md">{movie.cast || "Đang cập nhật"}</p>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-[#DAB254] text-[10px] font-bold tracking-[0.2em] mb-2 uppercase">Synopsis</h3>
          <p className="text-sm text-white/95 leading-relaxed font-light drop-shadow-lg">{movie.synopsis || movie.description}</p>
        </div>
      </div>
    </div>
  );
}
