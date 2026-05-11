"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Calendar, MapPin, Clock, Trash2, ExternalLink } from "lucide-react";
import { bookingService } from "../services/booking-service";
import { Booking } from "@/types";
import { Button } from "@/components/ui/button";

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await bookingService.getMyHistory();
      setBookings(data);
    } catch (error) {
      console.error("Lỗi tải lịch sử đặt vé:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn hủy vé này?")) {
      try {
        await bookingService.cancelBooking(id);
        fetchHistory();
      } catch (error) {
        alert("Không thể hủy vé. Vui lòng liên hệ hỗ trợ.");
      }
    }
  };

  if (isLoading) return <div className="text-center py-20 text-[#c9a84c] animate-pulse">ĐANG TẢI LỊCH SỬ...</div>;

  return (
    <div className="space-y-8">
      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
          <Ticket size={48} className="mx-auto text-white/20 mb-4" />
          <h3 className="text-xl font-bold text-white">Chưa có giao dịch nào</h3>
          <p className="text-white/40 text-sm mt-2">Bắt đầu đặt vé để tận hưởng những bộ phim hay nhất!</p>
          <Button 
            onClick={() => window.location.href = "/"}
            className="mt-6 bg-[#c9a84c] text-black font-bold rounded-xl"
          >
            ĐẶT VÉ NGAY
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => (
            <div 
              key={booking.id} 
              className="bg-[#0d0d0d] border border-white/5 hover:border-[#c9a84c]/30 p-6 rounded-3xl transition-all duration-300 group relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a84c]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex gap-6 items-center">
                  <div className="w-20 h-28 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    <img 
                      src={booking.showtime.movie.posterUrl} 
                      alt={booking.showtime.movie.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#c9a84c] transition-colors">
                      {booking.showtime.movie.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-xs text-white/40">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#c9a84c]" />
                        {new Date(booking.showtime.startTime).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[#c9a84c]" />
                        {new Date(booking.showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#c9a84c]" />
                        {booking.showtime.room.name}
                      </div>
                    </div>
                    <div className="pt-2">
                       <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-[#c9a84c]/10 text-[#c9a84c] rounded-md">
                          Ghế: {booking.seatNumbers}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  <div className="text-right">
                    <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Tổng thanh toán</div>
                    <div className="text-xl font-bold text-[#c9a84c]">
                      {booking.totalAmount.toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = `/movies/${booking.showtime.movie.id}/ticket?bookingId=${booking.id}`}
                      className="border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/10 rounded-xl px-4 h-10 flex items-center gap-2 text-xs font-bold"
                    >
                      <ExternalLink size={14} />
                      Chi tiết
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleCancel(booking.id)}
                      className="border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xl px-4 h-10 flex items-center gap-2 text-xs"
                    >
                      <Trash2 size={14} />
                      Hủy vé
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
