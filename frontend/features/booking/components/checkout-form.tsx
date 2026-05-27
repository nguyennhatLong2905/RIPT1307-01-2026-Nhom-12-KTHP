"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { ChevronLeft, CreditCard, Wallet, Loader2 } from "lucide-react";
import { bookingService } from "../services/booking-service";
import { showtimeService } from "../services/showtime-service";

export function CheckoutForm() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const movieId = params.id as string;
  const showtimeId = searchParams.get("showtimeId");
  const seats = searchParams.get("seats")?.split(",") || [];
  
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showtime, setShowtime] = useState<any>(null);

  useEffect(() => {
    if (showtimeId) {
      showtimeService.getShowtimeById(parseInt(showtimeId))
        .then(setShowtime)
        .catch(err => console.error("Lỗi tải thông tin suất chiếu:", err));
    }
  }, [showtimeId]);

  const handlePay = async () => {
    if (!showtimeId || seats.length === 0) {
      alert("Thiếu thông tin suất chiếu hoặc ghế!");
      return;
    }
    
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const booking = await bookingService.createBooking(parseInt(showtimeId), seats);
      console.log("Booking created:", booking);
      const redirectUrl = `/movies/${movieId}/ticket?bookingId=${booking.id}`;
      console.log("Redirecting to:", redirectUrl);
      router.push(redirectUrl);
    } catch (error: any) {
      console.error("Lỗi đặt vé:", error);
      alert(error.response?.data?.message || "Lỗi thanh toán và đặt vé!");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPrice = showtime ? seats.length * showtime.price : seats.length * 90000;

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white flex flex-col items-center py-20 px-4">
      <div className="w-full max-w-xl">
        <div className="mb-12">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-[10px] font-bold tracking-[0.15em] text-gray-400 hover:text-[#c9a84c] transition-colors mb-10 uppercase"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <h1 className="text-3xl font-light mb-4">Checkout</h1>
          <div className="w-16 h-[2px] bg-[#c9a84c]"></div>
        </div>

        <div className="bg-[#141414] border-b border-gray-800/80 p-6 mb-12 flex items-center justify-between focus-within:border-[#c9a84c]/50 transition-colors">
          <div className="flex flex-col w-full">
            <label className="text-[9px] text-gray-500 uppercase tracking-[0.2em] mb-3 font-bold">Promo Code</label>
            <input 
              type="text" 
              placeholder="ENTER CODE"
              className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-700 uppercase"
            />
          </div>
          <button className="text-[#c9a84c] text-[10px] font-bold tracking-wider uppercase ml-4 mt-4">Apply</button>
        </div>

        <div className="mb-12">
          <h2 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-6">Payment Method</h2>
          
          <div className="space-y-4">
            <div 
              className={`border rounded-xl p-6 transition-all cursor-pointer ${
                paymentMethod === "card" 
                  ? "border-[#c9a84c] bg-[#141414]" 
                  : "border-gray-800 bg-[#0a0a0a] hover:border-gray-600"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center ${
                    paymentMethod === "card" ? "border-[#c9a84c]" : "border-gray-600"
                  }`}>
                    {paymentMethod === "card" && <div className="w-2 h-2 rounded-full bg-[#c9a84c]"></div>}
                  </div>
                  <span className={`text-[11px] font-bold tracking-wider ${paymentMethod === "card" ? "text-[#c9a84c]" : "text-gray-400"}`}>
                    CREDIT/DEBIT CARD
                  </span>
                </div>
                <CreditCard className={`w-4 h-4 ${paymentMethod === "card" ? "text-gray-400" : "text-gray-600"}`} />
              </div>
              
              {paymentMethod === "card" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-300 mt-8">
                  <div className="border-b border-gray-800 pb-2">
                    <label className="text-[9px] text-gray-500 uppercase tracking-[0.15em] font-bold block mb-2">Cardholder Name</label>
                    <input type="text" className="w-full bg-transparent border-none outline-none text-sm text-white" placeholder="NAME ON CARD" />
                  </div>
                  <div className="border-b border-gray-800 pb-2">
                    <label className="text-[9px] text-gray-500 uppercase tracking-[0.15em] font-bold block mb-2">Card Number</label>
                    <input type="text" className="w-full bg-transparent border-none outline-none text-sm text-white" placeholder="XXXX XXXX XXXX XXXX" />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="border-b border-gray-800 pb-2">
                      <label className="text-[9px] text-gray-500 uppercase tracking-[0.15em] font-bold block mb-2">Expiry (MM/YY)</label>
                      <input type="text" className="w-full bg-transparent border-none outline-none text-sm text-white" placeholder="MM/YY" />
                    </div>
                    <div className="border-b border-gray-800 pb-2">
                      <label className="text-[9px] text-gray-500 uppercase tracking-[0.15em] font-bold block mb-2">CVV</label>
                      <input type="password" placeholder="***" className="w-full bg-transparent border-none outline-none text-sm text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div 
              className={`border rounded-xl p-6 transition-all cursor-pointer flex items-center justify-between ${
                paymentMethod === "momo" 
                  ? "border-[#c9a84c] bg-[#141414]" 
                  : "border-gray-800 bg-[#0a0a0a] hover:border-gray-600"
              }`}
              onClick={() => setPaymentMethod("momo")}
            >
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center ${
                  paymentMethod === "momo" ? "border-[#c9a84c]" : "border-gray-600"
                }`}>
                  {paymentMethod === "momo" && <div className="w-2 h-2 rounded-full bg-[#c9a84c]"></div>}
                </div>
                <span className={`text-[11px] font-bold tracking-wider ${paymentMethod === "momo" ? "text-[#c9a84c]" : "text-gray-400"}`}>
                  MOMO E-WALLET
                </span>
              </div>
              <Wallet className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        <button 
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#c9a84c] to-[#f0d78c] text-black hover:opacity-90 transition-all shadow-[0_10px_30px_rgba(201,168,76,0.2)] flex flex-col items-center justify-center gap-1 mt-12 disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <span className="text-[12px] font-bold tracking-[0.2em] uppercase">Confirm Payment</span>
              <span className="text-[20px] font-bold tracking-wider">{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
            </>
          )}
        </button>

        <p className="text-center text-[9px] text-gray-600 uppercase tracking-[0.2em] mt-8 leading-relaxed">
          SECURE ENCRYPTED TRANSACTION<br/>
          <span className="text-[7px]">Processed by Luxe Cinema Gateway</span>
        </p>
      </div>
    </div>
  );
}
