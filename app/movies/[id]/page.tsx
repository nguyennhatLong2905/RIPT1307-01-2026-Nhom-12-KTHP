import { MOCK_MOVIE, MOCK_THEATERS } from "@/constants";
import { MovieDetails, ShowtimeSelector } from "@/features/booking";

export default function MovieBookingPage() {
  return (
    <div className="flex h-[calc(100vh-60px)] bg-[#0a0a0a] overflow-hidden">
      <div className="w-1/2 h-full">
        <MovieDetails movie={MOCK_MOVIE} />
      </div>

      <div className="w-1/2 h-full relative">
        <ShowtimeSelector theaters={MOCK_THEATERS} />
      </div>
    </div>
  );
}
