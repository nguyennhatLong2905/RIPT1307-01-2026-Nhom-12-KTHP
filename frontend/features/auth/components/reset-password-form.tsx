"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Key, Lock, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "../services/auth-service";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    token: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Confirmation password does not match!");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(formData.token, formData.newPassword);
      alert("Password reset successful! Please log in again.");
      router.push("/");
    } catch (error) {
      console.error("Password reset error:", error);
      alert("Password reset failed. Please check your OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-[#0d0d0d] border border-[#c9a84c]/20 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="text-center">
        <h2 className="text-3xl font-bold italic tracking-tighter" style={{ color: "#c9a84c" }}>
          LUXE<span className="text-white">RESET</span>
        </h2>
        <p className="text-white/40 text-xs uppercase tracking-widest mt-2">Set new password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-2">
          <Label className="text-[#c9a84c] text-[10px] uppercase tracking-widest font-bold">OTP Code (6 digits)</Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/40" size={18} />
            <Input
              required
              className="pl-10 bg-white/5 border-white/10 focus:border-[#c9a84c]/50 rounded-xl font-mono tracking-[0.5em] text-center text-xl"
              placeholder="000000"
              maxLength={6}
              value={formData.token}
              onChange={(e) => setFormData({ ...formData, token: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-[#c9a84c] text-[10px] uppercase tracking-widest font-bold">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/40" size={18} />
            <Input
              required
              type="password"
              className="pl-10 bg-white/5 border-white/10 focus:border-[#c9a84c]/50 rounded-xl"
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-[#c9a84c] text-[10px] uppercase tracking-widest font-bold">Confirm Password</Label>
          <div className="relative">
            <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/40" size={18} />
            <Input
              required
              type="password"
              className="pl-10 bg-white/5 border-white/10 focus:border-[#c9a84c]/50 rounded-xl"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-[#c9a84c] hover:bg-[#b09340] text-black font-bold rounded-xl shadow-lg shadow-[#c9a84c]/20 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isLoading ? "PROCESSING..." : (
            <>
              UPDATE PASSWORD
              <ArrowRight size={18} />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
