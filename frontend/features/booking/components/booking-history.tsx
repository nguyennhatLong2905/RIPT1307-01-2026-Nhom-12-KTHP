"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Calendar, MapPin, Clock, Trash2, ExternalLink } from "lucide-react";
import { bookingService } from "../services/booking-service";
import { Booking } from "@/types";
import { Button } from "@/components/ui/button";

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await bookingService.getMyHistory();
      setBookings(data);
    } catch (error) {
      console.error("Error loading booking history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await bookingService.cancelBooking(id);
      fetchHistory();
      setDeleteConfirmId(null);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || "Cannot cancel ticket. Please contact support.";
      alert(message);
    }
  };

  if (isLoading) return <div className="text-center py-20 text-[#c9a84c] animate-pulse">LOADING HISTORY...</div>;

  return (
    <div className="space-y-8">
      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
          <Ticket size={48} className="mx-auto text-white/20 mb-4" />
          <h3 className="text-xl font-bold text-white">No transactions yet</h3>
          <p className="text-white/40 text-sm mt-2">Start booking to enjoy the best movies!</p>
          <Button 
            onClick={() => window.location.href = "/"}
            className="mt-6 bg-[#c9a84c] text-black font-bold rounded-xl"
          >
            BOOK NOW
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => {
            const isPast = new Date() > new Date(booking.showtime.startTime);
            return (
              <div 
                key={booking.id} 
                className={`bg-[#0d0d0d] border border-white/5 p-6 rounded-3xl transition-all duration-300 group relative overflow-hidden ${isPast ? "opacity-75 grayscale-[0.5]" : "hover:border-[#c9a84c]/30"}`}
              >
                {/* Background Glow */}
                {!isPast && <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a84c]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />}

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
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#c9a84c] transition-colors">
                          {booking.showtime.movie.title}
                        </h3>
                        {isPast && (
                          <span className="text-[8px] font-bold px-1.5 py-0.5 bg-white/10 text-white/40 rounded uppercase tracking-wider">
                            Watched
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-white/40">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-[#c9a84c]" />
                          {new Date(booking.showtime.startTime).toLocaleDateString('en-US')}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14} className="text-[#c9a84c]" />
                          {new Date(booking.showtime.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-[#c9a84c]" />
                          {booking.showtime.room.name}
                        </div>
                      </div>
                      <div className="pt-2">
                         <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-[#c9a84c]/10 text-[#c9a84c] rounded-md">
                            Seats: {booking.seatNumbers}
                         </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                    <div className="text-right">
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Total Amount</div>
                      <div className="text-xl font-bold text-[#c9a84c]">
                        {booking.totalAmount.toLocaleString('en-US')} VND
                      </div>
                    </div>
                    
                    <div className="flex gap-2 relative z-20">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          window.location.href = `/movies/${booking.showtime.movie.id}/ticket?bookingId=${booking.id}`;
                        }}
                        className="border-[#c9a84c]/30 text-[#c9a84c] hover:bg-[#c9a84c]/20 hover:border-[#c9a84c] rounded-xl px-5 h-11 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer"
                      >
                        <ExternalLink size={14} />
                        Details
                      </Button>
                      <div className="relative z-20">
                      <Button 
                        variant="outline"
                        disabled={isPast}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(deleteConfirmId === booking.id ? null : booking.id);
                        }}
                        className={`rounded-xl px-5 h-11 flex items-center gap-2 text-xs font-bold transition-all ${
                          isPast 
                          ? "border-white/5 text-white/20 bg-white/5 cursor-not-allowed" 
                          : deleteConfirmId === booking.id
                          ? "border-red-500 bg-red-500/20 text-red-500"
                          : "border-red-500/40 text-red-500 hover:bg-red-500/20 hover:border-red-500 cursor-pointer"
                        }`}
                      >
                        <Trash2 size={14} />
                        Cancel
                      </Button>

                      {deleteConfirmId === booking.id && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 p-2 rounded-xl border flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200" style={{ background: "#1a1a1a", borderColor: "rgba(239,68,68,0.3)", backdropFilter: "blur(20px)", minWidth: "140px" }}>
                          <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider ml-1">Cancel?</span>
                          <div className="flex gap-1 ml-auto">
                            <button onClick={() => handleCancel(booking.id)} className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all bg-[#ef4444] text-white hover:bg-[#dc2626]">Yes</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60">No</button>
                          </div>
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
