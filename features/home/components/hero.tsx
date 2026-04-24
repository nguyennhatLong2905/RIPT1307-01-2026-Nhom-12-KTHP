"use client";

import React from "react";
import { Search, Bell, Star, Play, Plus } from "lucide-react";

export default function Hero() {
  return (
    <div className="w-full flex flex-col bg-black">
      <div 
        className="w-full bg-cover bg-center min-h-[80vh] flex flex-col relative"
        style={{
          backgroundImage: 'url("/images/dune222.webp")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 w-full mt-12 mb-20 z-10">
          <h1 className="text-white text-5xl md:text-7xl font-bold mb-4 drop-shadow-md">
            DUNE: PART TWO
          </h1>
          <p className="text-[#FFD873] text-lg font-medium mb-6">
            Denis Villeneuve
          </p>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <p className="text-white text-base max-w-md leading-relaxed drop-shadow-sm">
              2024 - A - 2 Seasons<br/>
              Sci-Fi | Epic | Action &amp; Adventure | Drama
            </p>
            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 cursor-default">
              <Star className="w-5 h-5 fill-[#E9C349] text-[#E9C349]" />
              <span className="text-white text-lg font-semibold">8.4<span className="text-white/60 text-sm">/10</span></span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button className="flex items-center justify-center py-4 px-8 gap-3 rounded-[15px] hover:opacity-90 hover:scale-105 transition-all shadow-lg cursor-pointer" 
              style={{ background: "linear-gradient(180deg, #F40845, #F57C26)" }}
            >
              <Play className="w-5 h-5 fill-white text-white" />
              <span className="text-white text-lg font-medium">Book now</span>
            </button>
            <button className="flex items-center justify-center bg-white/10 py-4 px-8 gap-3 rounded-[15px] border border-white/20 hover:bg-white/20 hover:scale-105 transition-all backdrop-blur-sm cursor-pointer shadow-lg">
              <Plus className="w-5 h-5 text-white" />
              <span className="text-white text-lg font-medium">My list</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* 3 Images Below Hero */}
      <div className="bg-black py-8 border-t border-[#4D46351A] px-6 md:px-12 w-full">
        <div className="flex flex-col md:flex-row items-center gap-5 w-full">
          <img alt="movie1" src="/images/titanic.avif" className="flex-1 w-full md:w-1/7 h-48 lg:h-64 object-cover rounded-lg cursor-pointer hover:opacity-80 hover:scale-[1.02] transition-all shadow-lg" />
          <img alt="movie2" src="/images/canthislove.webp" className="flex-1 w-full md:w-1/7  h-48 lg:h-64 object-cover rounded-lg cursor-pointer hover:opacity-80 hover:scale-[1.02] transition-all shadow-lg" />
          <img alt="movie3" src="/images/avatar3.jpg" className="flex-1 w-full md:w-1/7 h-48 lg:h-64 object-cover rounded-lg cursor-pointer hover:opacity-80 hover:scale-[1.02] transition-all shadow-lg" />
          <img alt="movie4" src="/images/chuyentausinhtu.jpg" className="flex-1 w-full md:w-1/7 h-48 lg:h-64 object-cover rounded-lg cursor-pointer hover:opacity-80 hover:scale-[1.02] transition-all shadow-lg" />
          <img alt="movie5" src="/images/greenbook.jpg" className="flex-1 w-full md:w-1/7 h-48 lg:h-64 object-cover rounded-lg cursor-pointer hover:opacity-80 hover:scale-[1.02] transition-all shadow-lg" />
        </div>
      </div>
    </div>
  );
}
