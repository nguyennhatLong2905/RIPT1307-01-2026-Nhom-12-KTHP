"use client";

import { useState } from "react";
import { User as UserIcon, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/context/auth-context";

const GOLD = "#c9a84c";

export default function ProfileCard() {
  const { user, updateProfile, isLoading } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    try {
      await updateProfile({ name, phone });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cập nhật thất bại.");
    }
  };

  if (!user) return null;

  return (
    <div
      className="w-full max-w-md mx-auto rounded-2xl p-8 flex flex-col gap-6"
      style={{ backgroundColor: "#111111", border: "1px solid rgba(201,168,76,0.2)" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
          style={{ backgroundColor: "rgba(201,168,76,0.15)", border: "2px solid rgba(201,168,76,0.4)" }}
        >
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <UserIcon size={36} style={{ color: GOLD }} />
          )}
        </div>
        <div className="text-center">
          <p className="font-bold tracking-widest text-sm" style={{ color: GOLD }}>
            {user.name}
          </p>
          <p className="text-xs text-neutral-500 mt-1">{user.email}</p>
          {user.memberSince && (
            <p className="text-xs text-neutral-600 mt-1">
              Thành viên từ {new Date(user.memberSince).toLocaleDateString("vi-VN")}
            </p>
          )}
        </div>
      </div>

      <div
        className="w-full h-px"
        style={{ backgroundColor: "rgba(201,168,76,0.15)" }}
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="profile-name" style={{ color: GOLD, fontSize: "0.75rem", letterSpacing: "0.05em" }}>
            HỌ VÀ TÊN
          </Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/50"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e0e0e0" }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="profile-email" style={{ color: GOLD, fontSize: "0.75rem", letterSpacing: "0.05em" }}>
            EMAIL
          </Label>
          <Input
            id="profile-email"
            value={user.email}
            disabled
            className="border-[#c9a84c]/10 cursor-not-allowed"
            style={{ backgroundColor: "rgba(255,255,255,0.03)", color: "#666" }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="profile-phone" style={{ color: GOLD, fontSize: "0.75rem", letterSpacing: "0.05em" }}>
            SỐ ĐIỆN THOẠI
          </Label>
          <Input
            id="profile-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0901234567"
            className="border-[#c9a84c]/20 focus-visible:ring-[#c9a84c]/50"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#e0e0e0" }}
          />
        </div>

        {error && <p className="text-xs text-red-400 text-center">{error}</p>}

        {saved && (
          <div className="flex items-center justify-center gap-2 text-xs" style={{ color: GOLD }}>
            <CheckCircle size={14} />
            <span>Cập nhật thành công!</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full font-bold tracking-widest hover:opacity-90 transition-opacity mt-2"
          style={{ backgroundColor: GOLD, color: "#000" }}
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : "LƯU THAY ĐỔI"}
        </Button>
      </form>
    </div>
  );
}
