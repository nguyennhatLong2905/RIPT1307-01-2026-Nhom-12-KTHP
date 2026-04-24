"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export default function AiPicks() {
  return (
    <div className="w-full bg-black py-24">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-10 w-full">
        <div className="flex items-center gap-6">
          <h2 className="text-[#E5E2E1] text-3xl md:text-4xl font-bold">AI Picks</h2>
          <div className="flex items-center bg-[#E9C3491A] py-1.5 px-3 gap-2 rounded-xl border border-[#E9C34933]">
            <Sparkles className="w-4 h-4 text-[#E9C349]" />
            <span className="text-[#E9C349] text-xs font-medium uppercase tracking-wider">
              Personalized for you
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Main big card */}
          <div className="flex-[1.2] relative rounded-2xl overflow-hidden min-h-[400px] lg:min-h-[500px] group cursor-pointer shadow-lg hover:shadow-2xl transition">
            <img
              alt="aipicks_banner"
              src="/images/oppenheimer.jpg" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E]/90 via-[#0E0E0E]/50 to-transparent" />
            
            <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end">
              <span className="text-[#E9C349] text-sm uppercase tracking-wider font-bold mb-3 z-10 drop-shadow-md">
                Special recommendation
              </span>
              <h3 className="text-[#E5E2E1] text-4xl md:text-6xl font-bold mb-4 z-10 leading-tight drop-shadow-lg">
                Neon<br/>Reflections
              </h3>
              <p className="text-[#D0C5AF] text-base md:text-lg max-w-md mb-6 z-10 line-clamp-3 drop-shadow-md">
                A deep dive into the psychological impact of living in a hyper-connected metropolis.
              </p>
              <button className="text-[#E9C349] text-sm font-semibold uppercase border-b-2 border-[#E9C349] self-start pb-1 hover:text-white hover:border-white transition z-10">
                Explore more like this
              </button>
            </div>
          </div>

          {/* List panel */}
          <div className="flex flex-col flex-1 gap-4 md:gap-6 justify-center">
            
            {/* Item 1 */}
            <div className="flex items-center gap-6 group cursor-pointer hover:bg-white/5 p-4 rounded-xl transition shadow-sm hover:shadow-md border border-transparent hover:border-white/5">
              <img
                alt="aipicks1"
                src="/images/greenbook.jpg" 
                className="w-20 h-28 md:w-24 md:h-36 rounded-lg object-cover shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <h4 className="text-[#E5E2E1] text-lg md:text-xl font-bold mb-1 md:mb-2 group-hover:text-[#E9C349] transition-colors">
                  The Last Audience
                </h4>
                <p className="text-[#D0C5AF] text-[10px] md:text-xs uppercase tracking-wider">Documentary</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-center gap-6 group cursor-pointer hover:bg-white/5 p-4 rounded-xl transition shadow-sm hover:shadow-md border border-transparent hover:border-white/5">
              <img
                alt="aipicks2"
                src="/images/the blind side.jpg" 
                className="w-20 h-28 md:w-24 md:h-36 rounded-lg object-cover shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <h4 className="text-[#E5E2E1] text-lg md:text-xl font-bold mb-1 md:mb-2 group-hover:text-[#E9C349] transition-colors">
                  Emerald Silence
                </h4>
                <p className="text-[#D0C5AF] text-[10px] md:text-xs uppercase tracking-wider">Mystery</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-center gap-6 group cursor-pointer hover:bg-white/5 p-4 rounded-xl transition shadow-sm hover:shadow-md border border-transparent hover:border-white/5">
              <img
                alt="aipicks3"
                src="/images/star war.jpg" 
                className="w-20 h-28 md:w-24 md:h-36 rounded-lg object-cover shadow-md group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <h4 className="text-[#E5E2E1] text-lg md:text-xl font-bold mb-1 md:mb-2 group-hover:text-[#E9C349] transition-colors">
                  Canyon Road
                </h4>
                <p className="text-[#D0C5AF] text-[10px] md:text-xs uppercase tracking-wider">Adventure</p>
              </div>
            </div>

          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
