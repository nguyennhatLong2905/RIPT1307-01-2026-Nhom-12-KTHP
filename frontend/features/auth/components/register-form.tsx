"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, UserCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService, RegisterRequest } from "../services/auth-service";

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.register(formData);
      alert("Registration successful! Please log in.");
      router.push("/");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please check your information.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-[#0d0d0d] border border-[#c9a84c]/20 rounded-3xl shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#c9a84c]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#c9a84c]/5 rounded-full blur-3xl" />

      <div className="text-center relative z-10">
        <h2 className="text-3xl font-bold italic tracking-tighter" style={{ color: "#c9a84c" }}>
          LUXE<span className="text-white">JOIN</span>
        </h2>
        <p className="text-white/40 text-xs uppercase tracking-widest mt-2">Become a premium member</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div className="grid gap-2">
          <Label className="text-[#c9a84c] text-[10px] uppercase tracking-widest font-bold">Username</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/40" size={18} />
            <Input
              required
              className="pl-10 bg-white/5 border-white/10 focus:border-[#c9a84c]/50 rounded-xl transition-all"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-[#c9a84c] text-[10px] uppercase tracking-widest font-bold">Full Name</Label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/40" size={18} />
            <Input
              required
              className="pl-10 bg-white/5 border-white/10 focus:border-[#c9a84c]/50 rounded-xl transition-all"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-[#c9a84c] text-[10px] uppercase tracking-widest font-bold">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/40" size={18} />
            <Input
              required
              type="email"
              className="pl-10 bg-white/5 border-white/10 focus:border-[#c9a84c]/50 rounded-xl transition-all"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-[#c9a84c] text-[10px] uppercase tracking-widest font-bold">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/40" size={18} />
            <Input
              required
              className="pl-10 bg-white/5 border-white/10 focus:border-[#c9a84c]/50 rounded-xl transition-all"
              placeholder="09xx xxx xxx"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label className="text-[#c9a84c] text-[10px] uppercase tracking-widest font-bold">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/40" size={18} />
            <Input
              required
              type="password"
              className="pl-10 bg-white/5 border-white/10 focus:border-[#c9a84c]/50 rounded-xl transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              REGISTER NOW
              <ArrowRight size={18} />
            </>
          )}
        </Button>
      </form>

      <div className="text-center relative z-10 pt-4">
        <p className="text-white/40 text-xs">
          Already have an account?{" "}
          <button onClick={() => router.push("/")} className="text-[#c9a84c] hover:underline font-bold">
            Log in now
          </button>
        </p>
      </div>
    </div>
  );
}
