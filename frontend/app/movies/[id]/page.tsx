"use client";

import { useEffect, useState, use } from "react";
import { MovieDetails, ShowtimeSelector } from "@/features/booking";
import { movieService } from "@/features/home/services/movie-service";
import { showtimeService } from "@/features/booking/services/showtime-service";
import { Movie, Showtime, Theater } from "@/types";

export default function MovieBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieId = parseInt(id);
        const movieData = await movieService.getAllMovies();
        const foundMovie = movieData.find(m => m.id === movieId);
        setMovie(foundMovie || null);

        const showtimes = await showtimeService.getShowtimesByMovie(movieId);
        
        // Nhóm showtimes theo rạp (Cinema) từ thông tin phòng (Room)
        const theaterMap: Record<number, Theater> = {};
        showtimes.forEach(s => {
          const cinema = s.room.cinema;
          const cinemaId = cinema?.id || 0; // 0 for unassigned
          
          const startTimeDate = new Date(s.startTime);
          const now = new Date();
          const isExpired = now.getTime() > (startTimeDate.getTime() + 30 * 60000);
          
          if (isExpired) return;

          if (!theaterMap[cinemaId]) {
            theaterMap[cinemaId] = {
              id: cinemaId.toString(),
              name: cinema?.name || "Luxe Cinema Central",
              address: cinema?.address || "Hồ Chí Minh",
              imageUrl: cinema?.imageUrl,
              description: cinema?.description,
              showtimes: []
            };
          }
          
          theaterMap[cinemaId].showtimes.push({
            id: s.id.toString(),
            time: new Date(s.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            type: s.room.name.includes("GOLD") ? "GOLD CLASS" : "DELUXE",
            theaterId: cinemaId.toString(),
            isExpired
          });
        });
        
        setTheaters(Object.values(theaterMap));
      } catch (error) {
        console.error("Error loading movie info:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading || !movie) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#c9a84c]">LOADING...</div>;

  return (
    <div className="flex h-[calc(100vh-60px)] bg-[#0a0a0a] overflow-hidden">
      <div className="w-1/2 h-full">
        <MovieDetails movie={{
          ...movie,
          id: movie.id.toString(),
          title: movie.title,
          poster: movie.posterUrl || "/images/placeholder.jpg",
          rating: 9.0,
          director: movie.director,
          cast: "Updating",
          synopsis: movie.description || "No description available.",
          genre: movie.genre,
          duration: movie.duration,
          trailerUrl: movie.trailerUrl
        } as any} />
      </div>

      <div className="w-1/2 h-full relative border-l border-white/5">
        <ShowtimeSelector theaters={theaters} />
      </div>
    </div>
  );
}
