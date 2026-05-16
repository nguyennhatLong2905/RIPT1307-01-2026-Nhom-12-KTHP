import { Movie, Theater, Showtime, Seat } from "@/types";

interface OrderSummaryProps {
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  selectedSeats: Seat[];
  onProceed: () => void;
}

export function OrderSummary({ movie, theater, showtime, selectedSeats, onProceed }: OrderSummaryProps) {
  const ticketPrice = showtime.price || 75000;
  const subtotal = selectedSeats.length * ticketPrice;
  const total = subtotal;

  return (
    <div className="bg-[#232325] p-8 rounded-[2rem] w-full max-w-md flex flex-col shadow-2xl">
      <h2 className="text-white text-2xl font-bold mb-8">Order Summary</h2>
      
      <div className="flex gap-5 mb-10">
        <img 
          src={movie.poster || movie.posterUrl} 
          alt={movie.title} 
          className="w-24 h-36 object-cover rounded-xl shadow-lg bg-[#323234]" 
          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/0d0d0d/c9a84c?text=" + encodeURIComponent(movie.title); }}
        />
        <div className="flex flex-col justify-center">
          <span className="text-[#FF8C6B] text-[9px] font-bold tracking-[0.15em] uppercase mb-2">Now Booking</span>
          <h3 className="text-white font-bold text-xl leading-tight mb-3 uppercase">{movie.title}</h3>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-400 bg-[#323234] px-2.5 py-1 rounded-md font-medium">{showtime.type || "DELUXE"}</span>
            <span className="text-[10px] text-gray-400 bg-[#323234] px-2.5 py-1 rounded-md font-medium">PG-13</span>
          </div>
        </div>
      </div>

      <div className="relative pl-6 border-l-[1.5px] border-gray-600/50 mb-10 ml-2">
        <div className="absolute w-2 h-2 rounded-full bg-[#FF8C6B] -left-[4.5px] top-1"></div>
        <div className="mb-8">
          <span className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.15em] block mb-1">Location</span>
          <p className="text-white text-sm">{theater.name}</p>
        </div>
        
        <div className="absolute w-2 h-2 rounded-full bg-gray-500 -left-[4.5px] top-[4.5rem]"></div>
        <div>
          <span className="text-gray-400 text-[9px] font-bold uppercase tracking-[0.15em] block mb-1">Time & Date</span>
          <p className="text-white text-sm">
            {showtime.startTime 
              ? new Date(showtime.startTime).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' }) 
              : "Today"} 
            • {showtime.time}
          </p>
        </div>
      </div>

      <div className="bg-[#0f0f11] rounded-2xl p-6 mb-8 flex justify-between items-center">
        <div>
          <span className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.15em] block mb-2">Tickets</span>
          <p className="text-[#FF8C6B] text-2xl font-bold">
            {selectedSeats.length > 0 ? selectedSeats.map(s => s.id).join(", ") : "-"}
          </p>
        </div>
        <div className="text-right">
          <span className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.15em] block mb-2">Total Price</span>
          <p className="text-[#FF8C6B] text-3xl font-bold">{total.toLocaleString()} đ</p>
        </div>
      </div>

      <button
        disabled={selectedSeats.length === 0}
        onClick={onProceed}
        className={`w-full py-4 rounded-full text-sm font-bold transition-all shadow-lg text-black ${
          selectedSeats.length > 0
            ? "bg-gradient-to-r from-[#FF8C6B] to-[#DAB254] hover:opacity-90 shadow-[0_0_30px_rgba(255,140,107,0.3)]"
            : "bg-gray-700/50 text-gray-500 cursor-not-allowed"
        }`}
      >
        Proceed to Payment
      </button>
    </div>
  );
}
