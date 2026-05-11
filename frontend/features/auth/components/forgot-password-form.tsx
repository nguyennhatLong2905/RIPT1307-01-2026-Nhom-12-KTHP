"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "../services/auth-service";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setIsSent(true);
      alert("Mã khôi phục đã được gửi tới email của bạn!");
      router.push("/reset-password");
    } catch (error) {
      console.error("Lỗi quên mật khẩu:", error);
      alert("Gửi yêu cầu thất bại. Vui lòng kiểm tra lại email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-[#0d0d0d] border border-[#c9a84c]/20 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="text-center">
        <h2 className="text-3xl font-bold italic tracking-tighter" style={{ color: "#c9a84c" }}>
          LUXE<span className="text-white">RECOVERY</span>
        </h2>
        <p className="text-white/40 text-xs uppercase tracking-widest mt-2">Khôi phục quyền truy cập</p>
      </div>

      {!isSent ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label className="text-[#c9a84c] text-[10px] uppercase tracking-widest font-bold">Email tài khoản</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/40" size={18} />
              <Input
                required
                type="email"
                className="pl-10 bg-white/5 border-white/10 focus:border-[#c9a84c]/50 rounded-xl"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <p className="text-[10px] text-white/40 italic">Chúng tôi sẽ gửi mã OTP gồm 6 chữ số qua email này.</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#c9a84c] hover:bg-[#b09340] text-black font-bold rounded-xl shadow-lg shadow-[#c9a84c]/20 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? "ĐANG GỬI..." : (
                <>
                  GỬI MÃ KHÔI PHỤC
                  <Send size={18} />
                </>
              )}
            </Button>
            
            <button 
              type="button"
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest py-2"
            >
              <ArrowLeft size={16} />
              Quay lại
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-6">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm">
            Mã OTP đã được gửi. Vui lòng kiểm tra hộp thư đến của bạn.
          </div>
          <Button
            onClick={() => router.push("/reset-password")}
            className="w-full h-12 bg-[#c9a84c] text-black font-bold rounded-xl"
          >
            ĐẾN TRANG ĐỔI MẬT KHẨU
          </Button>
        </div>
      )}
    </div>
  );
}
