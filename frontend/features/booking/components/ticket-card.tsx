"use client";
import { CheckCircle, Download, Wallet, Home, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { bookingService } from "../services/booking-service";
import { Booking } from "@/types";
import { Button } from "@/components/ui/button";

export function TicketCard() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookingId) {
      fetchBooking(parseInt(bookingId));
    } else {
      setIsLoading(false);
      setError("Thiếu mã đặt vé (bookingId).");
    }
  }, [bookingId]);

  const fetchBooking = async (id: number) => {
    try {
      setIsLoading(true);
      // Sử dụng getMyHistory làm fallback để tránh lỗi nếu Backend chưa restart
      const history = await bookingService.getMyHistory();
      const data = history.find((b: Booking) => b.id === id);
      
      if (data) {
        setBooking(data);
      } else {
        setError("Không tìm thấy vé trong lịch sử giao dịch của bạn.");
      }
    } catch (error: any) {
      console.error("Lỗi tải thông tin vé:", error);
      setError(error.response?.data?.message || "Không thể kết nối với máy chủ.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#c9a84c] animate-spin" />
        <p className="text-[#c9a84c] font-medium tracking-widest uppercase text-xs">Đang xác thực vé...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">KHÔNG THỂ HIỂN THỊ VÉ</h2>
        <p className="text-white/40 text-sm max-w-xs mb-8">{error || "Dữ liệu vé không hợp lệ."}</p>
        <Link href="/bookings">
          <Button className="bg-[#c9a84c] text-black font-bold rounded-xl px-8">
            XEM LỊCH SỬ ĐẶT VÉ
          </Button>
        </Link>
      </div>
    );
  }

  const movie = booking.showtime.movie;
  const showtime = booking.showtime;
  const startTime = new Date(showtime.startTime);

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white flex flex-col items-center py-20 px-4">
      <div className="flex flex-col items-center mb-12 animate-in fade-in zoom-in duration-700">
        <div className="w-12 h-12 rounded-full border border-[#DAB254] flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(218,178,84,0.3)]">
          <CheckCircle className="w-6 h-6 text-[#DAB254]" />
        </div>
        <h1 className="text-2xl font-light mb-3">Booking Confirmed</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Your cinematic journey awaits</p>
      </div>

      <div className="w-full max-w-[340px] bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] text-black rounded-[2rem] overflow-hidden relative shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_50px_rgba(201,168,76,0.1)] mb-12 animate-in slide-in-from-bottom-8 duration-700">
        {/* Ticket Cutouts */}
        <div className="absolute left-0 top-[65%] -translate-y-1/2 w-5 h-10 bg-[#0f0f11] rounded-r-full shadow-inner"></div>
        <div className="absolute right-0 top-[65%] -translate-y-1/2 w-5 h-10 bg-[#0f0f11] rounded-l-full shadow-inner"></div>
        
        {/* Poster Section */}
        <div className="h-48 w-full overflow-hidden relative border-b border-gray-200">
          <img 
            src={movie.posterUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop"} 
            alt={movie.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] to-transparent opacity-60"></div>
          <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md px-2 py-1 rounded text-[8px] font-bold text-black uppercase tracking-widest border border-black/10">
            Premium
          </div>
        </div>

        <div className="p-8 pt-6 pb-10 border-b-2 border-dashed border-gray-300 relative">
          <div className="mb-8">
            <span className="text-[7px] text-gray-500 uppercase tracking-widest block mb-1">Movie Selection</span>
            <h2 className="text-xl font-bold uppercase leading-tight tracking-wider text-gray-900">{movie.title}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <span className="text-[7px] text-gray-500 uppercase tracking-widest block mb-1">Location</span>
              <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">{showtime.room.name}</p>
              <p className="text-[8px] text-gray-500">LUXE CINEMA CENTRAL</p>
            </div>
            <div>
              <span className="text-[7px] text-gray-500 uppercase tracking-widest block mb-1">Showtime</span>
              <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">
                {startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-[8px] text-gray-500">{startTime.toLocaleDateString('vi-VN')}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[7px] text-gray-500 uppercase tracking-widest block mb-1">Seats</span>
              <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">{booking.seatNumbers}</p>
            </div>
            <div className="text-right">
              <span className="text-[7px] text-gray-500 uppercase tracking-widest block mb-1">Booking Ref</span>
              <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">LX-{booking.id?.toString().padStart(6, '0') || '000000'}</p>
            </div>
          </div>
        </div>
        
        <div className="p-8 flex flex-col items-center justify-center bg-white/40">
          <div className="bg-white p-3 rounded-2xl shadow-sm mb-4 border border-gray-100">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BOOKING-${booking.id}`} 
              alt="QR Code" 
              className="w-24 h-24" 
            />
          </div>
          <p className="text-[7px] text-gray-500 uppercase tracking-widest text-center leading-relaxed font-bold">
            Scan this code at<br/>the cinema entrance
          </p>
        </div>
      </div>

      <div className="w-full max-w-[340px] flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
        <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#f0d78c] text-black hover:opacity-90 transition-all shadow-[0_10px_20px_rgba(201,168,76,0.2)] text-[10px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2">
          <Download size={14} />
          Save to Images
        </button>
        <button className="w-full py-4 rounded-xl border border-white/10 text-white/60 hover:text-[#c9a84c] hover:border-[#c9a84c]/50 transition-all text-[10px] font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2">
          <Wallet size={14} />
          Apple Wallet
        </button>
        <Link 
          href="/"
          className="w-full py-4 rounded-xl text-gray-500 hover:text-white transition-all text-[10px] font-bold tracking-[0.2em] uppercase mt-4 text-center flex items-center justify-center gap-2"
        >
          <Home size={14} />
          Back to Home
        </Link>
      </div>

      <p className="text-center text-[9px] text-white/30 mt-12 tracking-widest leading-relaxed uppercase">
        Luxe Cinema Premium Experience<br/>
        <span className="text-[7px]">Enjoy your movie</span>
      </p>
    </div>
  );
}
