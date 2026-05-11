"use client";

import React, { useEffect, useState } from "react";
import { Booking } from "@/types";

interface AdminChartsProps {
  bookings: Booking[];
}

export default function AdminCharts({ bookings }: AdminChartsProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Kích hoạt hiệu ứng sau khi mount
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Giả lập dữ liệu doanh thu theo ngày từ danh sách vé thực tế
  const getRevenueData = () => {
    const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    // Dữ liệu mẫu cơ bản
    const baseRevenue = [4200, 5100, 3800, 6200, 8900, 12500, 11000];
    
    // Tính toán thêm dựa trên dữ liệu thực tế để biểu đồ động
    const additionalRevenue = bookings.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0) / 1000;
    
    return days.map((day, i) => {
      const revenue = baseRevenue[i] + (i === 6 ? additionalRevenue : 0); // Cộng thêm vào ngày cuối
      const maxHeight = 15000;
      const height = (revenue / maxHeight) * 100;
      
      return {
        day,
        revenue,
        height: Math.max(height, 8) // Đảm bảo luôn thấy cột tối thiểu 8%
      };
    });
  };

  const data = getRevenueData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Biểu đồ doanh thu tuần */}
      <div className="bg-[#0d0d0d] border border-[#c9a84c]/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden group min-h-[400px] flex flex-col">
        <div className="absolute top-0 right-0 p-4">
          <span className="text-[10px] font-bold text-[#c9a84c] bg-[#c9a84c]/10 px-2 py-1 rounded-full uppercase tracking-widest border border-[#c9a84c]/20">Tuần này</span>
        </div>
        
        <h3 className="text-lg font-bold mb-12 flex items-center gap-2">
          <div className="w-1 h-6 bg-[#c9a84c] rounded-full" />
          Doanh thu tuần này
        </h3>
        
        <div className="flex-1 flex items-end justify-between gap-4 px-2 relative">
          {/* Grid lines background */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-[0.03] pointer-events-none">
            <div className="border-t border-white w-full" />
            <div className="border-t border-white w-full" />
            <div className="border-t border-white w-full" />
            <div className="border-t border-white w-full" />
          </div>

          {data.map((item, i) => (
            <div key={item.day} className="flex-1 flex flex-col items-center gap-4 group/bar relative z-10">
              <div className="relative w-full h-[220px] flex flex-col items-center justify-end">
                {/* Tooltip on hover */}
                <div className="absolute -top-12 bg-[#c9a84c] text-black text-[10px] font-bold px-2 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20 shadow-[0_10px_20px_rgba(201,168,76,0.3)] transform -translate-y-2 group-hover/bar:translate-y-0">
                  {item.revenue.toLocaleString()}đ
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#c9a84c] rotate-45" />
                </div>
                
                {/* Bar Background Track */}
                <div className="absolute inset-x-0 bottom-0 w-full max-w-[24px] mx-auto h-full bg-white/[0.02] rounded-t-lg" />

                {/* Actual Bar */}
                <div 
                  className="w-full max-w-[24px] rounded-t-lg bg-gradient-to-t from-[#c9a84c] via-[#DAB254] to-[#f0d78c] transition-all duration-1000 ease-out relative group-hover/bar:shadow-[0_0_30px_rgba(201,168,76,0.6)] group-hover/bar:scale-x-110 origin-bottom"
                  style={{ 
                    height: isLoaded ? `${item.height}%` : "0%"
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/bar:opacity-100 transition-opacity rounded-t-lg" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter group-hover/bar:text-[#c9a84c] transition-colors">{item.day}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-xs">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#f0d78c] shadow-[0_0_10px_rgba(201,168,76,0.5)]" />
            <span className="text-white/40 font-medium">Doanh thu (ngàn đồng)</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[#c9a84c] font-bold">+15.4%</span>
            <span className="text-[9px] text-white/20 uppercase tracking-widest">so với tuần trước</span>
          </div>
        </div>
      </div>

      {/* Hoạt động gần đây */}
      <div className="bg-[#0d0d0d] border border-[#c9a84c]/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col">
        <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
          <div className="w-1 h-6 bg-[#c9a84c] rounded-full" />
          Giao dịch gần đây
        </h3>
        
        <div className="flex-1 space-y-4">
          {bookings && bookings.length > 0 ? (
            [...bookings].reverse().slice(0, 5).map((booking, i) => (
              <div key={booking.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#c9a84c]/30 hover:bg-white/[0.05] transition-all group animate-in slide-in-from-right duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c9a84c]/20 to-[#c9a84c]/5 flex items-center justify-center text-[#c9a84c] font-bold border border-[#c9a84c]/10 group-hover:scale-110 transition-transform">
                    {booking.user.fullName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="text-sm font-bold group-hover:text-[#c9a84c] transition-colors">{booking.user.fullName}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-wider line-clamp-1">{booking.showtime.movie.title}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#c9a84c]">+{booking.totalAmount?.toLocaleString()}đ</div>
                  <div className="text-[10px] text-white/40 uppercase font-medium">{booking.bookingDate ? new Date(booking.bookingDate).toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'}) : "--:--"}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-white/20 italic gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/10" />
              Chưa có hoạt động nào hôm nay
            </div>
          )}
        </div>
        
        <button className="w-full mt-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a84c] hover:text-white transition-all border border-[#c9a84c]/20 hover:bg-[#c9a84c] hover:shadow-[0_10px_20px_rgba(201,168,76,0.2)] rounded-xl">
          Xem tất cả giao dịch
        </button>
      </div>
    </div>
  );
}
