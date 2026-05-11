"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Ticket,
  Calendar,
  User,
  CreditCard,
  MapPin
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { adminService } from "../services/admin-service";
import { Booking } from "@/types";

export default function TicketManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      // Vì backend tích hợp lịch sử vé vào stats
      const stats = await adminService.getStats();
      if (stats.lichSuDatVe) {
        setBookings(stats.lichSuDatVe);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách vé:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => 
    booking.user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    booking.showtime.movie.title.toLowerCase().includes(search.toLowerCase()) ||
    booking.seatNumbers.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Quản lý Vé đã đặt</h2>
        <p className="text-white/40 text-sm">Theo dõi toàn bộ giao dịch đặt vé và doanh thu từ khách hàng</p>
      </div>

      <div className="bg-[#0d0d0d] border border-[#c9a84c]/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#c9a84c]/10 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/40" size={18} />
            <Input 
              placeholder="Tìm theo tên khách, phim, số ghế..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 rounded-xl focus:border-[#c9a84c]/50 transition-colors"
            />
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-[#c9a84c]/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white/60">Khách hàng</TableHead>
              <TableHead className="text-white/60">Thông tin phim</TableHead>
              <TableHead className="text-white/60">Vị trí ghế</TableHead>
              <TableHead className="text-white/60">Ngày đặt</TableHead>
              <TableHead className="text-right text-white/60">Tổng tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-white/40">Đang tải dữ liệu...</TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-white/40">Chưa có giao dịch đặt vé nào</TableCell>
              </TableRow>
            ) : filteredBookings.map((booking) => (
              <TableRow key={booking.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60">
                      <User size={16} />
                    </div>
                    <div>
                      <div className="font-semibold">{booking.user.fullName}</div>
                      <div className="text-xs text-white/40">@{booking.user.username}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-white/80">{booking.showtime.movie.title}</div>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <MapPin size={12} />
                      {booking.showtime.room.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Ticket size={16} className="text-[#c9a84c]" />
                    <span className="font-mono">{booking.seatNumbers}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <Calendar size={14} />
                    {new Date(booking.bookingDate).toLocaleString("vi-VN")}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2 text-[#c9a84c] font-bold">
                    <CreditCard size={16} />
                    {booking.totalAmount.toLocaleString("vi-VN")}đ
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
