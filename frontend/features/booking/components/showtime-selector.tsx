"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Theater } from "@/types";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isLoggedIn } from "@/lib/auth-utils";

type TheaterShowtime = Theater["showtimes"][0];

export function ShowtimeSelector({ theaters }: { theaters: Theater[] }) {
  const router = useRouter();

  // Helper to safely parse dates
  const parseDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  // Extract all unique dates from all theaters' showtimes
  const allShowtimes = theaters.flatMap(t => t.showtimes);
  const uniqueDatesMap = new Map<string, { day: string; month: string; dayOfWeek: string; fullDate: string }>();

  allShowtimes.forEach(s => {
    const d = parseDate(s.startTime);
    if (d) {
      const fullDate = d.toISOString().split('T')[0]; // YYYY-MM-DD
      if (!uniqueDatesMap.has(fullDate)) {
        uniqueDatesMap.set(fullDate, {
          day: d.getDate().toString(),
          month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
          dayOfWeek: d.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
          fullDate
        });
      }
    }
  });

  // Sort dates
  const sortedDates = Array.from(uniqueDatesMap.values()).sort((a, b) => a.fullDate.localeCompare(b.fullDate));
  
  const [selectedDate, setSelectedDate] = useState<string>(sortedDates[0]?.fullDate || "");
  const [expandedTheater, setExpandedTheater] = useState<string>(theaters[0]?.id || "");
  const [selectedShowtime, setSelectedShowtime] = useState<TheaterShowtime | null>(null);

  const getTheaterById = (id: string) => theaters.find(t => t.id === id);

  // Filter theaters to only show those that have showtimes on the selected date
  const theatersWithFilteredShowtimes = theaters.map(t => ({
    ...t,
    showtimes: t.showtimes.filter(s => {
      const d = parseDate(s.startTime);
      return d && d.toISOString().split('T')[0] === selectedDate;
    })
  })).filter(t => t.showtimes.length > 0);

  return (
    <div className="flex h-full flex-col bg-[#0a0a0a] text-white">
      <ScrollArea className="flex-1 px-7 pt-4 pb-36 lg:px-10 lg:pt-6">
        <div className="mb-7">
          <h2 className="mb-4 text-[10px] font-bold tracking-[0.2em] text-[#DAB254]">SELECT DATE</h2>
          <div className="flex flex-wrap gap-3">
            {sortedDates.length > 0 ? (
              sortedDates.map((date) => (
                <button
                  key={date.fullDate}
                  onClick={() => setSelectedDate(date.fullDate)}
                  className={`flex h-16 w-14 flex-col items-center justify-center rounded-md border transition-all lg:h-[72px] lg:w-16 ${
                    selectedDate === date.fullDate 
                      ? "border-[#DAB254] bg-[#DAB254]/10 shadow-[0_0_18px_rgba(218,178,84,0.12)]" 
                      : "border-gray-800 bg-[#141414] hover:border-gray-600 hover:bg-[#181818]"
                  }`}
                >
                  <span className="mb-0.5 text-[8px] text-gray-400 lg:text-[9px]">{date.month}</span>
                  <span className="mb-0.5 text-lg font-light lg:text-xl">{date.day}</span>
                  <span className="text-[8px] text-[#DAB254] lg:text-[9px]">{date.dayOfWeek}</span>
                </button>
              ))
            ) : (
              <p className="text-xs text-gray-500 italic">No upcoming showtimes available.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-[10px] font-bold tracking-[0.2em] text-[#DAB254]">THEATERS & SHOWTIMES</h2>
          <div className="space-y-3">
            {theatersWithFilteredShowtimes.map((theater) => (
              <div 
                key={theater.id} 
                className="overflow-hidden rounded-xl border border-gray-800/60 bg-[#141414]/95 shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
              >
                <button 
                  className="flex w-full items-center justify-between gap-4 p-4 transition-colors hover:bg-[#1a1a1a] lg:p-5"
                  onClick={() => setExpandedTheater(expandedTheater === theater.id ? "" : theater.id)}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#DAB254]" />
                    <div className="min-w-0 text-left">
                      <h3 className="truncate text-sm font-medium lg:text-base">{theater.name}</h3>
                      <p className="mt-1 line-clamp-2 text-[10px] uppercase tracking-wider text-gray-500">{theater.address}</p>
                    </div>
                  </div>
                  {expandedTheater === theater.id ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-[#DAB254]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
                  )}
                </button>

                {expandedTheater === theater.id && (
                  <div className="border-t border-gray-800/50 px-4 pb-4 pt-3 lg:px-5 lg:pb-5">
                    <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                      {theater.showtimes.map((showtime) => (
                        <button
                          key={showtime.id}
                          onClick={() => setSelectedShowtime(showtime)}
                          className={`flex flex-col items-center justify-center rounded-lg border py-3 transition-all ${
                            selectedShowtime?.id === showtime.id
                              ? "border-[#DAB254] bg-[#DAB254]/10 shadow-[0_0_18px_rgba(218,178,84,0.12)]"
                              : "border-gray-800 bg-[#1a1a1a] hover:border-gray-600 hover:bg-[#202020]"
                          }`}
                        >
                          <span className="mb-1 text-sm font-medium text-[#DAB254]">{showtime.time}</span>
                          <span className="text-center text-[8px] uppercase tracking-[0.1em] text-gray-400">
                            {showtime.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-4 pt-10 bg-gradient-to-t from-black via-[#0a0a0a]/95 to-transparent pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between gap-4 rounded-xl border border-gray-800 bg-[#141414]/95 p-4 shadow-2xl backdrop-blur">
          <div className="min-w-0">
            <h4 className="mb-1.5 text-[9px] uppercase tracking-[0.2em] text-gray-400">Selected Showtime</h4>
            {selectedShowtime ? (
              <p className="truncate text-sm font-medium text-[#DAB254]">
                {selectedShowtime.time} • {getTheaterById(selectedShowtime.theaterId)?.name}
              </p>
            ) : (
              <p className="text-sm italic text-gray-600">Please select a showtime</p>
            )}
          </div>
          <button 
            disabled={!selectedShowtime}
            onClick={() => {
              if (!isLoggedIn()) {
                router.push(`${window.location.pathname}?login=true`);
                return;
              }
              const pathParts = window.location.pathname.split('/');
              const movieId = pathParts[2];
              router.push(`/movies/${movieId}/seats?showtimeId=${selectedShowtime!.id}`);
            }}
            className={`shrink-0 rounded-lg px-5 py-3 text-[10px] font-bold tracking-[0.15em] transition-all lg:px-7 lg:text-[11px] ${
              selectedShowtime 
                ? "bg-gradient-to-r from-[#DAB254] to-[#FF8C6B] text-black shadow-[0_0_20px_rgba(218,178,84,0.3)] hover:opacity-90" 
                : "cursor-not-allowed bg-gray-800 text-gray-500"
            }`}
          >
            CONTINUE TO SEATS
          </button>
        </div>
      </div>
    </div>
  );
}

