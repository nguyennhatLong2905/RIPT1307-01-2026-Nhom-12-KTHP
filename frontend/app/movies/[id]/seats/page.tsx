"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { SeatSelector, OrderSummary } from "@/features/booking";
import { bookingService } from "@/features/booking/services/booking-service";
import { showtimeService } from "@/features/booking/services/showtime-service";
import { Seat, Showtime, Movie } from "@/types";

export default function SeatsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const showtimeId = searchParams.get("showtimeId");
  const movieId = params.id as string;

  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [takenSeats, setTakenSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (showtimeId) {
      fetchData();
    }
  }, [showtimeId]);

  const fetchData = async () => {
    try {
      // Vì backend chưa có api lấy chi tiết 1 showtime đơn lẻ, 
      // chúng ta sẽ lấy toàn bộ showtime của phim đó (giả sử phim ID là 1 hoặc lấy từ URL)
      // Để đơn giản, tôi sẽ giả định có API lấy chi tiết showtime hoặc mock tạm thời
      // Nhưng quan trọng nhất là lấy ghế đã đặt
      const seats = await axiosInstance.get(`/bookings/showtime/${showtimeId}/seats`);
      setTakenSeats(seats.data);
      
      // Lấy thông tin showtime (tạm thời lấy từ danh sách hoặc backend)
      // Giả sử phim ID từ URL
      const pathParts = window.location.pathname.split('/');
      const movieId = parseInt(pathParts[2]);
      const showtimes = await showtimeService.getShowtimesByMovie(movieId);
      const currentShowtime = showtimes.find(s => s.id === parseInt(showtimeId!));
      if (currentShowtime) setShowtime(currentShowtime);
      
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!showtime || selectedSeats.length === 0) return;
    const seatNumbers = selectedSeats.map(s => s.id).join(",");
    router.push(`/movies/${movieId}/checkout?showtimeId=${showtime.id}&seats=${seatNumbers}`);
  };

  if (isLoading || !showtime) return <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center text-[#c9a84c]">ĐANG TẢI...</div>;

  // Tạo danh sách ghế dựa trên số hàng/cột của phòng
  const rows = Array.from({ length: showtime.room.rowsCount }, (_, i) => String.fromCharCode(65 + i));
  const generatedSeats: Seat[] = [];
  rows.forEach(row => {
    for (let i = 1; i <= showtime.room.colsCount; i++) {
      const seatId = `${row}${i}`;
      generatedSeats.push({
        id: seatId,
        row,
        number: i,
        status: takenSeats.includes(seatId) ? 'sold' : 'available'
      });
    }
  });

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f11] flex items-center justify-center text-[#c9a84c]">ĐANG TẢI...</div>}>
      <div className="flex min-h-screen bg-[#0f0f11]">
        <div className="flex-1 overflow-y-auto">
          <SeatSelector 
            seats={generatedSeats}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
            theater={{ name: "Luxe Cinema Central", id: "1", address: "Hà Nội", showtimes: [] }} // Mock theater wrapper
            showtime={{ 
              id: showtime.id, 
              time: new Date(showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }),
              theaterId: "1",
              type: "GOLD CLASS",
              startTime: showtime.startTime
            } as any}
          />
        </div>
        <div className="w-[500px] flex items-center justify-center p-8 bg-[#0f0f11] border-l border-white/5">
          <OrderSummary 
            movie={showtime.movie}
            theater={{ name: "Luxe Cinema Central", id: "1", address: "Hà Nội", showtimes: [] }}
            showtime={{ 
              id: showtime.id, 
              time: new Date(showtime.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }),
              theaterId: "1",
              type: "GOLD CLASS"
            } as any}
            selectedSeats={selectedSeats}
            onProceed={handleProceed}
          />
        </div>
      </div>
    </Suspense>
  );
}

import { Suspense } from "react";

import axiosInstance from "@/lib/axios";
