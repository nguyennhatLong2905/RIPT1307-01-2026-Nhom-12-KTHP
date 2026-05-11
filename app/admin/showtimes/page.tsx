import { Metadata } from "next";
import ShowtimeCalendar from "@/features/admin/components/showtimes/showtime-calendar";

export const metadata: Metadata = {
  title: "Quản Lý Lịch Chiếu – LUXE CINEMA",
  description: "Quản lý lịch chiếu phim, phòng chiếu và phát hiện xung đột.",
};

export default function ShowtimesPage() {
  return (
    // Stretch to fill the remaining height inside the admin layout's <main>
    <div className="-m-6 -mt-22 h-screen pt-16">
      <ShowtimeCalendar />
    </div>
  );
}
