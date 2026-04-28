import { MOCK_MOVIE, MOCK_THEATERS } from "@/constants";
import { MovieDetails, ShowtimeSelector } from "@/features/booking";

export default function MovieBookingPage() {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Cột trái: Chi tiết phim (Cố định) */}
      <div className="w-1/2 fixed top-0 bottom-0 left-0">
        <MovieDetails movie={MOCK_MOVIE} />
      </div>

      {/* Cột phải: Chọn rạp và suất chiếu (Cuộn) */}
      <div className="w-1/2 ml-[50%] h-screen">
        <ShowtimeSelector theaters={MOCK_THEATERS} />
      </div>
    </div>
  );
}
