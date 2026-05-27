"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Lock } from "lucide-react";
import { movieService } from "../services/movie-service";
import { Movie } from "@/types";
import { isLoggedIn } from "@/lib/auth-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const AVAILABLE_GENRES = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Animation", "Thriller"];

export default function AiPicks() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const loggedIn = isLoggedIn();

  useEffect(() => {
    fetchPicks();
  }, [loggedIn, selectedGenres]);

  const fetchPicks = async () => {
    setIsLoading(true);
    try {
      let data;
      if (selectedGenres.length > 0) {
        data = await movieService.getAIPicks(selectedGenres);
      } else if (loggedIn) {
        data = await movieService.getMyAIPicks();
      } else {
        const all = await movieService.getAllMovies();
        data = all.slice(0, 4); 
      }
      setMovies(data);
    } catch (error) {
      console.error("Error loading AI Picks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre) 
        : [...prev, genre]
    );
  };

  return (
    <div id="ai-picks" className="w-full bg-black py-24">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-10 w-full">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-6">
                <h2 className="text-[#E5E2E1] text-3xl md:text-4xl">AI Picks</h2>
                <div className="flex items-center bg-[#E9C3491A] py-1.5 px-3 gap-2 rounded-xl border border-[#E9C34933]">
                  <Sparkles className="w-4 h-4 text-[#E9C349]" />
                  <span className="text-[#E9C349] text-xs font-medium uppercase tracking-wider">
                    {selectedGenres.length > 0 ? "Based on your choice" : loggedIn ? "Personalized for you" : "Top Picks"}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {AVAILABLE_GENRES.map(genre => (
                  <Badge
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    variant="outline"
                    className={`cursor-pointer px-4 py-1.5 rounded-full transition-all border-[#E9C349]/20 hover:border-[#E9C349]/50 ${
                      selectedGenres.includes(genre) 
                        ? "bg-[#E9C349] text-black border-[#E9C349]" 
                        : "bg-white/5 text-white/60"
                    }`}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

          {!loggedIn && selectedGenres.length === 0 ? (
            <div className="w-full h-[400px] rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#c9a84c10,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="w-16 h-16 rounded-full bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c] mb-6">
                  <Lock size={32} />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Unlock Personalized Recommendations</h3>
               <p className="text-white/40 max-w-md mb-8">Select your favorite genres above or log in to let our AI analyze your taste.</p>
               <Button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-[#c9a84c] text-black font-bold rounded-xl px-10 h-12 shadow-lg shadow-[#c9a84c]/20 transition-all hover:scale-105"
               >
                  LOGIN NOW
               </Button>
            </div>
          ) : isLoading ? (
             <div className="w-full h-[400px] flex items-center justify-center text-[#c9a84c] animate-pulse">
                {selectedGenres.length > 0 ? "FINDING THE BEST MATCHES..." : "ANALYZING YOUR MOVIE TASTE..."}
             </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 w-full">
              {movies.length > 0 ? (
                <>
                  {movies[0] && (
                    <div 
                      onClick={() => router.push(`/movies/${movies[0].id}`)}
                      className="flex-[1.2] relative rounded-2xl overflow-hidden min-h-[400px] lg:min-h-[500px] group cursor-pointer shadow-lg hover:shadow-2xl transition"
                    >
                      <img
                        alt={movies[0].title}
                        src={movies[0].posterUrl}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E]/90 via-[#0E0E0E]/50 to-transparent" />

                      <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
                        <span className="text-[#E9C349] text-sm uppercase tracking-wider font-bold mb-3 z-10 drop-shadow-md">
                          {selectedGenres.length > 0 ? "Genre Highlight" : "Special recommendation"}
                        </span>
                        <h3 className="text-[#E5E2E1] text-4xl md:text-5xl font-bold mb-4 z-10 leading-tight drop-shadow-lg uppercase tracking-tighter italic">
                          {movies[0].title}
                        </h3>
                        <p className="text-[#D0C5AF] text-base md:text-lg max-w-md mb-6 z-10 line-clamp-3 drop-shadow-md">
                          {movies[0].description}
                        </p>
                        <button className="text-[#E9C349] text-sm font-semibold uppercase border-b-2 border-[#E9C349] self-start pb-1 hover:text-white hover:border-white transition z-10">
                          Explore now
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col flex-1 gap-4 md:gap-6 justify-center">
                    {movies.slice(1, 4).map((movie) => (
                      <div 
                        key={movie.id} 
                        onClick={() => router.push(`/movies/${movie.id}`)}
                        className="flex items-center gap-6 group cursor-pointer hover:bg-white/5 p-4 rounded-xl transition shadow-sm hover:shadow-md border border-transparent hover:border-white/5"
                      >
                        <img
                          alt={movie.title}
                          src={movie.posterUrl}
                          className="w-20 h-28 md:w-24 md:h-36 rounded-lg object-cover shadow-md group-hover:scale-105 transition-transform"
                        />
                        <div className="flex flex-col">
                          <h4 className="text-[#E5E2E1] text-lg md:text-xl font-bold mb-1 md:mb-2 group-hover:text-[#E9C349] transition-colors">
                            {movie.title}
                          </h4>
                          <p className="text-[#D0C5AF] text-[10px] md:text-xs uppercase tracking-wider">{movie.genre}</p>
                        </div>
                      </div>
                    ))}
                    {movies.length < 2 && (
                      <div className="flex flex-col items-center justify-center p-10 text-white/20">
                         <Sparkles size={48} className="mb-4 opacity-20" />
                         <p>Select more genres for better variety</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-[400px] flex flex-col items-center justify-center text-white/40 bg-white/5 rounded-3xl border border-white/10">
                   <Sparkles size={48} className="mb-4 opacity-20" />
                   <p className="text-xl font-bold mb-2">No movies found for these genres</p>
                   <p className="text-sm">Try selecting different categories</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
