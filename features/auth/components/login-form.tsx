"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/context/auth-context";

const GOLD = "#c9a84c";

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <h2
          className="text-2xl font-bold tracking-widest"
          style={{ color: GOLD }}
        >
          ĐĂNG NHẬP
        </h2>
        <p className="text-xs text-neutral-500 mt-1 tracking-wide">
          Chào mừng trở lại LUXE CINEMA
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="login-email" style={{ color: GOLD, fontSize: "0.75rem", letterSpacing: "0.05em" }}>
          EMAIL
        </Label>
        <Input
          id="login-email"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/50"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e0e0e0" }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="login-password" style={{ color: GOLD, fontSize: "0.75rem", letterSpacing: "0.05em" }}>
          MẬT KHẨU
        </Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/50 pr-10"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e0e0e0" }}
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs tracking-wide hover:underline"
          style={{ color: GOLD }}
          onClick={onSuccess}
        >
          Quên mật khẩu?
        </Link>
      </div>

      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full font-bold tracking-widest hover:opacity-90 transition-opacity"
        style={{ backgroundColor: GOLD, color: "#000" }}
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : "ĐĂNG NHẬP"}
      </Button>

      {onSwitchToRegister && (
        <p className="text-xs text-center text-neutral-500">
          Chưa có tài khoản?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="hover:underline"
            style={{ color: GOLD }}
          >
            Đăng ký
          </button>
        </p>
      )}
    </form>
  );
}
