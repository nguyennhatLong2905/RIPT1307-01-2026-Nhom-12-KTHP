"use client";

import { useState } from "react";
import { SeatSelector, OrderSummary } from "@/features/booking";
import { MOCK_MOVIE, MOCK_THEATERS, MOCK_SEATS } from "@/constants";
import { Seat } from "@/types";

export default function SeatsPage() {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const theater = MOCK_THEATERS[0];
  const showtime = theater.showtimes[0];

  const handleToggleSeat = (seat: Seat) => {
    setSelectedSeats(prev => {
      const isSelected = prev.some(s => s.id === seat.id);
      if (isSelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };

  const handleProceed = () => {
    window.location.href = "/movies/m1/checkout";
  };

  return (
    <div className="flex min-h-screen bg-[#0f0f11]">
      <div className="flex-1">
        <SeatSelector 
          seats={MOCK_SEATS}
          selectedSeats={selectedSeats}
          onToggleSeat={handleToggleSeat}
          theater={theater}
          showtime={showtime}
        />
      </div>
      <div className="w-[500px] flex items-center justify-center p-8 bg-[#0f0f11]">
        <OrderSummary 
          movie={MOCK_MOVIE}
          theater={theater}
          showtime={showtime}
          selectedSeats={selectedSeats}
          onProceed={handleProceed}
        />
      </div>
    </div>
  );
}
