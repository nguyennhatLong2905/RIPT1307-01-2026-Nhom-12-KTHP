"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Trending() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-black py-24">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-8 w-full">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h2 className="text-[#E5E2E1] text-3xl md:text-4xl font-bold">Trending</h2>
            <p className="text-[#E9C349] text-xs md:text-sm uppercase tracking-wider font-semibold">
              Curated by our masters of cinema
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={scrollLeft}
              className="flex items-center justify-center p-3 md:p-4 rounded-xl border border-[#4D46354D] hover:bg-white/10 transition group cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>
            <button 
              onClick={scrollRight}
              className="flex items-center justify-center p-3 md:p-4 rounded-xl border border-[#4D46354D] hover:bg-white/10 transition group cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div 
          ref={scrollContainerRef}
          className="flex items-center gap-6 overflow-x-auto snap-x snap-mandatory pb-4 w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Card 1 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending1"
              src="/images/inception.jpeg" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {/* Card 2 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending2"
              src="/images/lordofring.jpg" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {/* Card 3 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending3"
              src="/images/avatar3.jpg" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {/* Card 4 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending4"
              src="/images/kong.jpg" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {/* Card 5 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending5"
              src="/images/mai.jpg" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {/* Card 6 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending6"
              src="/images/f1.jpg" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {/* Card 7 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending7"
              src="/images/star war.jpg" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {/* Card 8 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending8"
              src="/images/hoppers.jpg" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {/* Card 9 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending9"
              src="/images/inception.jpeg" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {/* Card 10 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending10"
              src="/images/LILO & STITCH (LIVE-ACTION).jpg" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {/* Card 11 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending11"
              src="/images/mưa đỏ.jpg" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {/* Card 12 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending12"
              src="/images/peaky-blinders-the-immortal-man-2026-i-watched-the-last-v0-fspfnz9khgqg1.webp" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {/* Card 13 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending13"
              src="/images/Poster_phim_Kỵ_sĩ_bóng_đêm_2008.jpg" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {/* Card 14 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending14"
              src="/images/Project_Hail_Mary_poster.jpg" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {/* Card 15 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending15"
              src="/images/spider-man-brand-new-day-as-ultimate-spider-man-2024-cover-v0-jpw1tpp43whf1.webp" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
          {/* Card 16 */}
          <div className="flex-none w-[200px] md:w-[280px] h-[300px] md:h-[400px] snap-center rounded-xl overflow-hidden relative cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0E0E0E]/90 z-10 pointer-events-none" />
            <img
              alt="trending16"
              src="/images/THE FANTASTIC FOUR- FIRST STEPS.jpg" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
          </div>
        </div>
      </div>
      
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
