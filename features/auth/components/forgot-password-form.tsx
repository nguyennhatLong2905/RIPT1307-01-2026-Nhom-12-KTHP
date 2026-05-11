"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/features/auth/services/auth.service";

const GOLD = "#c9a84c";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gửi thất bại. Thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle size={48} style={{ color: GOLD }} />
        <h3 className="text-lg font-bold tracking-widest" style={{ color: GOLD }}>
          EMAIL ĐÃ ĐƯỢC GỬI
        </h3>
        <p className="text-sm text-neutral-400 max-w-xs">
          Vui lòng kiểm tra hộp thư{" "}
          <span style={{ color: GOLD }}>{email}</span> và làm theo hướng dẫn để đặt lại mật khẩu.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="forgot-email" style={{ color: GOLD, fontSize: "0.75rem", letterSpacing: "0.05em" }}>
          EMAIL ĐÃ ĐĂNG KÝ
        </Label>
        <Input
          id="forgot-email"
          type="email"
          placeholder="email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/50"
          style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e0e0e0" }}
        />
      </div>

      {error && (
        <p className="text-xs text-red-400 text-center">{error}</p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full font-bold tracking-widest hover:opacity-90 transition-opacity"
        style={{ backgroundColor: GOLD, color: "#000" }}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : "GỬI LINK ĐẶT LẠI"}
      </Button>
    </form>
  );
}
