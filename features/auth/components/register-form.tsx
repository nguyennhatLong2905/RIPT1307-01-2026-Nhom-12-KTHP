"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/context/auth-context";

const GOLD = "#c9a84c";

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    try {
      await register({ name, email, password });
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="text-center mb-2">
        <h2
          className="text-2xl font-bold tracking-widest"
          style={{ color: GOLD }}
        >
          ĐĂNG KÝ
        </h2>
        <p className="text-xs text-neutral-500 mt-1 tracking-wide">
          Tạo tài khoản LUXE CINEMA
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="reg-name" style={{ color: GOLD, fontSize: "0.75rem", letterSpacing: "0.05em" }}>
          HỌ VÀ TÊN
        </Label>
        <Input
          id="reg-name"
          type="text"
          placeholder="Nguyễn Văn A"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/50"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e0e0e0" }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="reg-email" style={{ color: GOLD, fontSize: "0.75rem", letterSpacing: "0.05em" }}>
          EMAIL
        </Label>
        <Input
          id="reg-email"
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
        <Label htmlFor="reg-password" style={{ color: GOLD, fontSize: "0.75rem", letterSpacing: "0.05em" }}>
          MẬT KHẨU
        </Label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPw ? "text" : "password"}
            placeholder="Tối thiểu 6 ký tự"
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

      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full font-bold tracking-widest hover:opacity-90 transition-opacity"
        style={{ backgroundColor: GOLD, color: "#000" }}
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : "ĐĂNG KÝ"}
      </Button>

      {onSwitchToLogin && (
        <p className="text-xs text-center text-neutral-500">
          Đã có tài khoản?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="hover:underline"
            style={{ color: GOLD }}
          >
            Đăng nhập
          </button>
        </p>
      )}
    </form>
  );
}
