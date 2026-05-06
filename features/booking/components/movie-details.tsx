import { Movie } from "@/types";
import { Star, ChevronLeft } from "lucide-react";
import Link from "next/link";

export function MovieDetails({ movie }: { movie: Movie }) {
  return (
    <div className="relative h-full w-full bg-black text-white p-10 flex flex-col justify-end">
      <div className="absolute top-28 left-10 z-30">
        <Link 
          href="/" 
          className="flex items-center gap-1.5 text-white/90 hover:text-[#DAB254] transition-colors bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-[0.05em]">Back to Movies</span>
        </Link>
      </div>
      <div 
        className="absolute inset-0 z-0 opacity-50 bg-cover bg-center"
        style={{ backgroundImage: `url('${movie.poster}')` }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/80 to-transparent" />

      <div className="relative z-20 space-y-6 max-w-lg">
        <h1 className="text-6xl font-bold uppercase leading-tight tracking-wider">{movie.title}</h1>
        
        <div className="flex items-center gap-4 text-[#DAB254]">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <span className="font-bold">{movie.rating} IMDB</span>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-4">
          <div>
            <h3 className="text-[#DAB254] text-[10px] font-bold tracking-[0.2em] mb-2 uppercase">Director</h3>
            <p className="text-sm">{movie.director}</p>
          </div>
          <div>
            <h3 className="text-[#DAB254] text-[10px] font-bold tracking-[0.2em] mb-2 uppercase">Cast</h3>
            <p className="text-sm">{movie.cast}</p>
          </div>
        </div>

        <div className="pt-4">
          <h3 className="text-[#DAB254] text-[10px] font-bold tracking-[0.2em] mb-2 uppercase">Synopsis</h3>
          <p className="text-sm text-gray-300 leading-relaxed">{movie.synopsis}</p>
        </div>
      </div>
    </div>
  );
}
