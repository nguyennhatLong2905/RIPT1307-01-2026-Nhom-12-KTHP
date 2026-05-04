"use client";

import { CheckCircle } from "lucide-react";

import Link from "next/link";

export function TicketCard() {
  return (
    <div className="min-h-screen bg-[#0f0f11] text-white flex flex-col items-center py-20 px-4">
      <div className="flex flex-col items-center mb-12">
        <div className="w-12 h-12 rounded-full border border-[#DAB254] flex items-center justify-center mb-6">
          <CheckCircle className="w-6 h-6 text-[#DAB254]" />
        </div>
        <h1 className="text-2xl font-light mb-3">Booking Confirmed</h1>
        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Your cinematic journey awaits</p>
      </div>

      <div className="w-full max-w-[340px] bg-gradient-to-b from-[#e5e5e5] to-[#c0c0c0] text-black rounded-[1.5rem] overflow-hidden relative shadow-[0_0_40px_rgba(218,178,84,0.1)] mb-12">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#0f0f11] rounded-r-full shadow-inner"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-[#0f0f11] rounded-l-full shadow-inner"></div>
        
        <div className="p-8 pb-10 border-b-2 border-dashed border-gray-400/50 relative">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-[7px] text-gray-500 uppercase tracking-widest block mb-1">Selected</span>
              <h2 className="text-xl font-medium uppercase leading-tight tracking-wider text-gray-800">Dune: Part<br/>Two</h2>
            </div>
            <div className="flex gap-1 mt-1">
              <div className="w-[1px] h-4 bg-gray-500"></div>
              <div className="w-[2px] h-4 bg-gray-500"></div>
              <div className="w-[1px] h-4 bg-gray-500"></div>
              <div className="w-[3px] h-4 bg-gray-500"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <span className="text-[7px] text-gray-500 uppercase tracking-widest block mb-1">Venue</span>
              <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">AMC Empire 25</p>
            </div>
            <div>
              <span className="text-[7px] text-gray-500 uppercase tracking-widest block mb-1">Time</span>
              <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">19:30</p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <div>
              <span className="text-[7px] text-gray-500 uppercase tracking-widest block mb-1">Seats</span>
              <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">D7, D8</p>
            </div>
            <div className="text-right">
              <span className="text-[7px] text-gray-500 uppercase tracking-widest block mb-1">Ref #</span>
              <p className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">LX-889201</p>
            </div>
          </div>
        </div>
        
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="bg-white p-2 mb-4">
            <div className="w-28 h-28 border-[6px] border-[#1a1a1a] flex items-center justify-center bg-white">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=LX-889201" alt="QR Code" className="w-full h-full opacity-90" />
            </div>
          </div>
          <p className="text-[7px] text-gray-500 uppercase tracking-widest text-center mt-2 leading-relaxed">Scan at<br/>Entrance</p>
        </div>
      </div>

      <div className="w-full max-w-[340px] flex flex-col gap-4">
        <button className="w-full py-4 rounded bg-gradient-to-r from-[#FF8C6B] to-[#DAB254] text-black hover:opacity-90 transition-all shadow-[0_0_20px_rgba(255,140,107,0.2)] text-[10px] font-bold tracking-[0.2em] uppercase">
          Download Ticket
        </button>
        <button className="w-full py-4 rounded border border-gray-600 text-[#DAB254] hover:bg-[#1a1a1c] transition-all text-[10px] font-bold tracking-[0.2em] uppercase">
          Add to Apple Wallet
        </button>
        <Link 
          href="/"
          className="w-full py-4 rounded border-none text-gray-500 hover:text-white transition-all text-[10px] font-bold tracking-[0.2em] uppercase mt-2 text-center"
        >
          Return to Home
        </Link>
      </div>

      <p className="text-center text-[8px] text-gray-600 mt-10 tracking-[0.1em] leading-relaxed">
        A confirmation email has been sent to your registered address.<br/>Please arrive 15 minutes prior to the showtime.
      </p>
    </div>
  );
}
