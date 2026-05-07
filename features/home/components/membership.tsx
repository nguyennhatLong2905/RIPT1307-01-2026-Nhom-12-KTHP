"use client";

import React from "react";
import { Check, QrCode } from "lucide-react";

export default function Membership() {
  return (
    <>
      <div className="w-full bg-black py-16 md:py-20 px-6 md:px-12">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-center w-full">

          <div className="flex-1 flex flex-col w-full">
            <h2 className="text-[#E5E2E1] text-4xl md:text-5xl mb-6 md:mb-8 leading-tight">
              The Membership<br className="hidden md:block" />Experience
            </h2>
            <p className="text-[#D0C5AF] text-base md:text-lg mb-10 md:mb-12 max-w-xl leading-relaxed">
              Join THE VELVET GALLERY and unlock unlimited access to premieres, priority lounge seating, and private screening rooms. A legacy of cinematic excellence awaits.
            </p>

            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-4">
                <Check className="w-5 h-5 text-[#E9C349]" />
                <span className="text-[#E5E2E1] text-sm md:text-base font-medium">Unlimited Premieres</span>
              </div>
              <div className="flex items-center gap-4">
                <Check className="w-5 h-5 text-[#E9C349]" />
                <span className="text-[#E5E2E1] text-sm md:text-base font-medium">Private Champagne Lounge</span>
              </div>
              <div className="flex items-center gap-4">
                <Check className="w-5 h-5 text-[#E9C349]" />
                <span className="text-[#E5E2E1] text-sm md:text-base font-medium">24/7 Concierge Service</span>
              </div>
            </div>
          </div>

          {/* Card Component */}
          <div className="flex-none lg:w-[450px] w-full max-w-md mx-auto lg:mx-0 mt-8 lg:mt-0">
            <div
              className="bg-[#353534] p-[1px] rounded-2xl shadow-2xl transition-transform hover:-translate-y-2 duration-300 pointer-events-auto cursor-pointer"
              style={{ boxShadow: "0px 30px 60px #00000080" }}
            >
              <div
                className="bg-cover bg-center p-6 md:p-8 rounded-2xl flex items-center justify-between min-h-[220px] relative overflow-hidden"
              >
                {/* Background image replacement or gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#3a2d12] to-[#b8860b] opacity-90 z-0" />
                <div
                  className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 z-0"
                  style={{ backgroundImage: 'url("/images/goldpass.png")' }}
                />

                <div className="flex flex-col justify-between h-full py-2 z-10">
                  <div className="flex flex-col gap-1 mb-10">
                    <span className="text-[#FFE58A] text-lg md:text-xl font-medium tracking-wide drop-shadow-md">LUXE CINEMA</span>
                    <span className="text-white text-2xl md:text-3xl font-black tracking-widest drop-shadow-md">GOLD PASS</span>
                  </div>

                  <div className="flex items-center gap-6 md:gap-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-[#D0C5AF] text-[9px] md:text-[10px] uppercase tracking-wider font-semibold">Valid Until</span>
                      <span className="text-[#FFE58A] text-xs md:text-sm font-bold">DECEMBER 2024</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[#D0C5AF] text-[9px] md:text-[10px] uppercase tracking-wider font-semibold">Member No.</span>
                      <span className="text-[#FFE58A] text-xs md:text-sm font-mono font-bold">#LX-098821</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 ml-4 bg-black/40 p-4 rounded-xl backdrop-blur-md border border-white/10 z-10 w-24">
                  <button
                    className="p-2 rounded-xl transition-all cursor-pointer"
                    onClick={() => alert("Show QR Code!")}
                  >
                    <QrCode className="w-10 h-10 text-white drop-shadow-md" />
                  </button>
                  <span className="text-[#D0C5AF] text-[9px] text-center max-w-[60px] uppercase leading-tight font-bold tracking-wider">Scan at Entrance</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
