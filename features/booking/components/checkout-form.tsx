"use client";

import { useState } from "react";
import { ChevronLeft, CreditCard, Wallet } from "lucide-react";

export function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white flex flex-col items-center py-20 px-4">
      <div className="w-full max-w-xl">
        <div className="mb-12">
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center text-[10px] font-bold tracking-[0.15em] text-gray-400 hover:text-[#DAB254] transition-colors mb-10 uppercase"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <h1 className="text-3xl font-light mb-4">Checkout</h1>
          <div className="w-16 h-[2px] bg-[#DAB254]"></div>
        </div>

        <div className="bg-[#141414] border-b border-gray-800/80 p-6 mb-12 flex items-center justify-between focus-within:border-[#DAB254]/50 transition-colors">
          <div className="flex flex-col w-full">
            <label className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-3 font-bold">Promo Code</label>
            <input 
              type="text" 
              className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-700 uppercase"
            />
          </div>
          <button className="text-[#DAB254] text-[10px] font-bold tracking-wider uppercase ml-4 mt-4">Apply</button>
        </div>

        <div className="mb-12">
          <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-6">Payment Method</h2>
          
          <div className="space-y-4">
            <div 
              className={`border rounded-xl p-6 transition-all cursor-pointer ${
                paymentMethod === "card" 
                  ? "border-[#DAB254] bg-[#141414]" 
                  : "border-gray-800 bg-[#0a0a0a] hover:border-gray-600"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center ${
                    paymentMethod === "card" ? "border-[#DAB254]" : "border-gray-600"
                  }`}>
                    {paymentMethod === "card" && <div className="w-2 h-2 rounded-full bg-[#DAB254]"></div>}
                  </div>
                  <span className={`text-[11px] font-bold tracking-wider ${paymentMethod === "card" ? "text-[#DAB254]" : "text-gray-400"}`}>
                    CREDIT/DEBIT CARD
                  </span>
                </div>
                <CreditCard className={`w-4 h-4 ${paymentMethod === "card" ? "text-gray-400" : "text-gray-600"}`} />
              </div>
              
              {paymentMethod === "card" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300 mt-8">
                  <div className="border-b border-gray-800 pb-2">
                    <label className="text-[9px] text-gray-500 uppercase tracking-[0.15em] font-bold block mb-2">Cardholder Name</label>
                    <input type="text" className="w-full bg-transparent border-none outline-none text-sm text-white" />
                  </div>
                  <div className="border-b border-gray-800 pb-2">
                    <label className="text-[9px] text-gray-500 uppercase tracking-[0.15em] font-bold block mb-2">Card Number</label>
                    <input type="text" className="w-full bg-transparent border-none outline-none text-sm text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="border-b border-gray-800 pb-2">
                      <label className="text-[9px] text-gray-500 uppercase tracking-[0.15em] font-bold block mb-2">Expiry (MM/YY)</label>
                      <input type="text" className="w-full bg-transparent border-none outline-none text-sm text-white" />
                    </div>
                    <div className="border-b border-gray-800 pb-2">
                      <label className="text-[9px] text-gray-500 uppercase tracking-[0.15em] font-bold block mb-2">CVV</label>
                      <input type="password" className="w-full bg-transparent border-none outline-none text-sm text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div 
              className={`border rounded-xl p-6 transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === "apple" 
                  ? "border-[#DAB254] bg-[#141414]" 
                  : "border-gray-800 bg-[#0a0a0a] hover:border-gray-600"
              }`}
              onClick={() => setPaymentMethod("apple")}
            >
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center ${
                  paymentMethod === "apple" ? "border-[#DAB254]" : "border-gray-600"
                }`}>
                  {paymentMethod === "apple" && <div className="w-2 h-2 rounded-full bg-[#DAB254]"></div>}
                </div>
                <span className={`text-[11px] font-bold tracking-wider ${paymentMethod === "apple" ? "text-[#DAB254]" : "text-gray-400"}`}>
                  APPLE PAY
                </span>
              </div>
              <span className="text-[10px] font-bold text-gray-500">iOS</span>
            </div>

            <div 
              className={`border rounded-xl p-6 transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === "momo" 
                  ? "border-[#DAB254] bg-[#141414]" 
                  : "border-gray-800 bg-[#0a0a0a] hover:border-gray-600"
              }`}
              onClick={() => setPaymentMethod("momo")}
            >
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center ${
                  paymentMethod === "momo" ? "border-[#DAB254]" : "border-gray-600"
                }`}>
                  {paymentMethod === "momo" && <div className="w-2 h-2 rounded-full bg-[#DAB254]"></div>}
                </div>
                <span className={`text-[11px] font-bold tracking-wider ${paymentMethod === "momo" ? "text-[#DAB254]" : "text-gray-400"}`}>
                  MOMO
                </span>
              </div>
              <Wallet className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        <button 
          onClick={() => window.location.href = "/movies/m1/ticket"}
          className="w-full py-4 rounded-lg bg-gradient-to-r from-[#FF8C6B] to-[#DAB254] text-black hover:opacity-90 transition-all shadow-[0_0_30px_rgba(255,140,107,0.3)] flex flex-col items-center justify-center gap-1 mt-12"
        >
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Pay</span>
          <span className="text-[13px] font-bold tracking-wider">$48.00</span>
        </button>

        <p className="text-center text-[8px] text-gray-600 uppercase tracking-widest mt-6 leading-relaxed">
          Secure checkout processed by Velvet Vault<br/>Encryption
        </p>
      </div>
    </div>
  );
}
