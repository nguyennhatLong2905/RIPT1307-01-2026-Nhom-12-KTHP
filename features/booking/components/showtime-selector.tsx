"use client";

import { useState } from "react";
import { Theater, Showtime } from "@/types";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const DATES = [
  { day: "24", month: "OCT", dayOfWeek: "THU" },
  { day: "25", month: "OCT", dayOfWeek: "FRI" },
  { day: "26", month: "OCT", dayOfWeek: "SAT" },
  { day: "27", month: "OCT", dayOfWeek: "SUN" },
];

export function ShowtimeSelector({ theaters }: { theaters: Theater[] }) {
  const [selectedDate, setSelectedDate] = useState("24");
  const [expandedTheater, setExpandedTheater] = useState<string>("t1");
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);

  const getTheaterById = (id: string) => theaters.find(t => t.id === id);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white">
      <ScrollArea className="flex-1 p-10 pb-32">
        {/* Date Selector */}
        <div className="mb-10">
          <h2 className="text-[#DAB254] text-[10px] font-bold tracking-[0.2em] mb-6">SELECT DATE</h2>
          <div className="flex gap-4">
            {DATES.map((date) => (
              <button
                key={date.day}
                onClick={() => setSelectedDate(date.day)}
                className={`flex flex-col items-center justify-center w-16 h-20 rounded-md border transition-all ${
                  selectedDate === date.day 
                    ? "border-[#DAB254] bg-[#DAB254]/5" 
                    : "border-gray-800 hover:border-gray-600 bg-[#141414]"
                }`}
              >
                <span className="text-[9px] text-gray-400 mb-1">{date.month}</span>
                <span className="text-xl font-light mb-1">{date.day}</span>
                <span className="text-[9px] text-[#DAB254]">{date.dayOfWeek}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theaters List */}
        <div>
          <h2 className="text-[#DAB254] text-[10px] font-bold tracking-[0.2em] mb-6">THEATERS & SHOWTIMES</h2>
          <div className="space-y-4">
            {theaters.map((theater) => (
              <div 
                key={theater.id} 
                className="bg-[#141414] rounded-lg overflow-hidden border border-gray-800/50"
              >
                {/* Theater Header */}
                <button 
                  className="w-full flex items-center justify-between p-6 hover:bg-[#1a1a1a] transition-colors"
                  onClick={() => setExpandedTheater(expandedTheater === theater.id ? "" : theater.id)}
                >
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-[#DAB254] mt-0.5 shrink-0" />
                    <div className="text-left">
                      <h3 className="text-base font-medium">{theater.name}</h3>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{theater.address}</p>
                    </div>
                  </div>
                  {expandedTheater === theater.id ? (
                    <ChevronUp className="w-4 h-4 text-[#DAB254]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {/* Showtimes Grid */}
                {expandedTheater === theater.id && (
                  <div className="p-6 pt-0 border-t border-gray-800/50 mt-2">
                    <div className="grid grid-cols-3 gap-4 pt-6">
                      {theater.showtimes.map((showtime) => (
                        <button
                          key={showtime.id}
                          onClick={() => setSelectedShowtime(showtime)}
                          className={`flex flex-col items-center justify-center py-4 rounded-md border transition-all ${
                            selectedShowtime?.id === showtime.id
                              ? "border-[#DAB254] bg-[#DAB254]/10"
                              : "border-gray-800 bg-[#1a1a1a] hover:border-gray-600"
                          }`}
                        >
                          <span className="text-sm text-[#DAB254] mb-1">{showtime.time}</span>
                          <span className="text-[8px] text-gray-400 tracking-[0.1em] text-center uppercase">
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

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 right-0 w-1/2 p-6 bg-gradient-to-t from-black via-[#0a0a0a] to-transparent pointer-events-none">
        <div className="bg-[#141414] border border-gray-800 rounded-lg p-5 flex items-center justify-between pointer-events-auto shadow-2xl">
          <div>
            <h4 className="text-[9px] text-gray-400 tracking-[0.2em] mb-2 uppercase">Selected Showtime</h4>
            {selectedShowtime ? (
              <p className="text-[#DAB254] text-sm font-medium">
                {selectedShowtime.time} • {getTheaterById(selectedShowtime.theaterId)?.name}
              </p>
            ) : (
              <p className="text-gray-600 text-sm italic">Please select a showtime</p>
            )}
          </div>
          <button 
            disabled={!selectedShowtime}
            onClick={() => window.location.href = "/movies/m1/seats"}
            className={`px-8 py-3 rounded text-[11px] font-bold tracking-[0.15em] transition-all ${
              selectedShowtime 
                ? "bg-gradient-to-r from-[#DAB254] to-[#FF8C6B] text-black hover:opacity-90 shadow-[0_0_20px_rgba(218,178,84,0.3)]" 
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            CONTINUE TO SEATS
          </button>
        </div>
      </div>
    </div>
  );
}
