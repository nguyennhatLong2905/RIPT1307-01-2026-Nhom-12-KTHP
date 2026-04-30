import { Seat, Theater, Showtime } from "@/types";
import { ChevronLeft } from "lucide-react";

interface SeatSelectorProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onToggleSeat: (seat: Seat) => void;
  theater: Theater;
  showtime: Showtime;
}

export function SeatSelector({ seats, selectedSeats, onToggleSeat, theater, showtime }: SeatSelectorProps) {
  const rows = Array.from(new Set(seats.map(s => s.row)));

  return (
    <div className="flex flex-col p-10 bg-[#0f0f11] min-h-screen text-white">
      <div className="flex items-center gap-4 mb-16">
        <button className="hover:text-[#DAB254] transition-colors" onClick={() => window.history.back()}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Choose Seats</h1>
          <p className="text-xs text-gray-400 mt-1">{theater.name} • Screen 4 IMAX</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl mx-auto">
        <div className="w-full mb-16 relative flex flex-col items-center">
          <div className="w-3/4 h-[1px] bg-gradient-to-r from-transparent via-red-200/40 to-transparent"></div>
          <div className="absolute top-0 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#DAB254]/20 to-transparent blur-sm"></div>
          <div className="text-gray-400 text-[10px] tracking-[1.5em] mt-6 uppercase ml-[1.5em]">Screen</div>
        </div>
        
        <div className="flex flex-col gap-4">
          {rows.map(row => (
            <div key={row} className="flex items-center gap-6">
              <span className="text-gray-500 w-4 text-center text-[10px] font-bold">{row}</span>
              <div className="flex gap-2">
                {seats.filter(s => s.row === row).map((seat, index) => {
                  const isSelected = selectedSeats.some(s => s.id === seat.id);
                  const isSold = seat.status === 'sold';
                  
                  let seatClass = "w-8 h-8 border transition-all duration-200 cursor-pointer flex items-center justify-center rounded-sm ";
                  
                  if (isSold) {
                    seatClass += "bg-[#1a1a1c] border-transparent text-gray-500 cursor-not-allowed";
                  } else if (isSelected) {
                    seatClass += "bg-gradient-to-t from-[#FF8C6B] to-[#DAB254] border-transparent shadow-[0_0_15px_rgba(218,178,84,0.4)]";
                  } else {
                    seatClass += "bg-transparent border-gray-600 hover:border-[#DAB254]";
                  }

                  return (
                    <div key={seat.id} className="flex">
                      <button
                        disabled={isSold}
                        onClick={() => onToggleSeat(seat)}
                        className={seatClass}
                      >
                        {isSold && <span className="text-xs font-light">×</span>}
                      </button>
                    </div>
                  );
                })}
              </div>
              <span className="text-gray-500 w-4 text-center text-[10px] font-bold">{row}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-10 mt-16 text-[10px] text-gray-400 uppercase tracking-wider">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border border-gray-600 rounded-sm"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gradient-to-t from-[#FF8C6B] to-[#DAB254] rounded-sm"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#1a1a1c] border-transparent flex items-center justify-center text-gray-500 rounded-sm">×</div>
            <span>Sold</span>
          </div>
        </div>
      </div>
    </div>
  );
}
