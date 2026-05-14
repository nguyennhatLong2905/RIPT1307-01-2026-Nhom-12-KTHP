"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Ticket,
  Calendar,
  User,
  CreditCard,
  MapPin,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminService } from "../services/admin-service";
import { Booking } from "@/types";

export default function TicketManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getBookings();
      setBookings(data);
    } catch (error) {
      console.error("Error loading tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      try {
        await adminService.deleteBooking(id);
        fetchBookings();
      } catch (error) {
        alert("Failed to delete booking.");
      }
    }
  };

  const filteredBookings = bookings.filter(booking => 
    booking.user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    booking.showtime.movie.title.toLowerCase().includes(search.toLowerCase()) ||
    booking.seatNumbers.toLowerCase().includes(search.toLowerCase())
  );

  // Tính toán phân trang
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Ticket Management</h2>
        <p className="text-white/40 text-sm">Track all ticket transactions and revenue from customers</p>
      </div>

      <div className="bg-[#0d0d0d] border border-[#c9a84c]/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#c9a84c]/10 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/40" size={18} />
            <Input 
              placeholder="Search by customer, movie, seat..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 bg-white/5 border-white/10 rounded-xl focus:border-[#c9a84c]/50 transition-colors"
            />
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-[#c9a84c]/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white/60">Customer</TableHead>
              <TableHead className="text-white/60">Movie Info</TableHead>
              <TableHead className="text-white/60">Seats</TableHead>
              <TableHead className="text-white/60">Booking Date</TableHead>
              <TableHead className="text-right text-white/60">Total Amount</TableHead>
              <TableHead className="text-right text-white/60 w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-white/40">Loading data...</TableCell>
              </TableRow>
            ) : paginatedBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-white/40">No ticket transactions found</TableCell>
              </TableRow>
            ) : paginatedBookings.map((booking) => (
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
                      {booking.showtime.room.cinema?.name ? `${booking.showtime.room.cinema.name} - ${booking.showtime.room.name}` : booking.showtime.room.name}
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
                    {new Date(booking.bookingDate).toLocaleString("en-US")}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2 text-[#c9a84c] font-bold">
                    <CreditCard size={16} />
                    {booking.totalAmount.toLocaleString("en-US")} VND
                  </div>
                </TableCell>
                <TableCell className="text-right">
                   <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCancel(booking.id)}
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                   >
                      <Trash2 size={18} />
                   </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Thanh phân trang cao cấp nằm ở giữa, bên ngoài bảng */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-1 bg-[#0d0d0d] p-1.5 rounded-xl border border-[#c9a84c]/20 shadow-lg">
            <Button 
              variant="ghost" 
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="h-8 w-8 rounded-lg text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                  currentPage === page 
                    ? "bg-[#c9a84c] text-black hover:bg-[#c9a84c]/90 shadow-md shadow-[#c9a84c]/20" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {page}
              </Button>
            ))}
            <Button 
              variant="ghost" 
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="h-8 w-8 rounded-lg text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
