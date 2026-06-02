"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Key, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { authService } from "../services/auth-service";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    token: "",
    newPassword: "",
    confirmPassword: "",
  });

  const set = (key: keyof typeof formData) => (v: string) =>
    setFormData((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword(formData.token, formData.newPassword);
      router.push("/?login=true");
    } catch {
      setError("Invalid or expired OTP code.");
    } finally {
      setIsLoading(false);
    }
  };

  /* Shared input style */
  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.09)",
    color: "#e0e0e0",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)");
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) =>
    (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)");

  return (
    <div
      className="w-full max-w-sm relative overflow-hidden rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="pointer-events-none absolute -top-16 -left-16 w-40 h-40 rounded-full bg-[#c9a84c]/8 blur-3xl" />

      <div className="relative px-8 pt-10 pb-8 space-y-6">
        {/* Header */}
        <div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
            style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
          >
            <Key size={18} style={{ color: "#c9a84c" }} />
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">Set new password</h1>
          <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
            Enter the 6-digit code from your email and choose a new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* OTP field */}
          <div className="space-y-1.5">
            <label
              htmlFor="otp-token"
              className="block text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "rgba(201,168,76,0.65)" }}
            >
              OTP Code
            </label>
            <input
              id="otp-token"
              required
              maxLength={6}
              value={formData.token}
              onChange={(e) => set("token")(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full h-12 text-center text-2xl font-mono tracking-[0.5em] outline-none rounded-xl transition-all"
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>

          {/* New password */}
          <div className="space-y-1.5">
            <label
              htmlFor="new-password"
              className="block text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "rgba(201,168,76,0.65)" }}
            >
              New Password
            </label>
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "rgba(255,255,255,0.22)" }}
              />
              <input
                id="new-password"
                required
                type={showNew ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => set("newPassword")(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-9 pr-10 text-sm outline-none rounded-xl transition-all"
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirm-password"
              className="block text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: "rgba(201,168,76,0.65)" }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "rgba(255,255,255,0.22)" }}
              />
              <input
                id="confirm-password"
                required
                type={showConfirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => set("confirmPassword")(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-9 pr-10 text-sm outline-none rounded-xl transition-all"
                style={inputStyle}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-3 text-xs text-red-400/80">
              <AlertCircle size={13} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl text-sm font-bold text-black flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #c9a84c, #e8c76a)" }}
            >
              {isLoading ? (
                "Updating..."
              ) : (
                <>
                  Update Password
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
