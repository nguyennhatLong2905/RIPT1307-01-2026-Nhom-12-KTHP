"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { authService } from "../services/auth-service";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setIsSent(true);
    } catch {
      setError("No account found with this email address.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-sm relative overflow-hidden rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#c9a84c]/8 blur-3xl" />

      <div className="relative px-8 pt-10 pb-8">
        {!isSent ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <Mail size={18} style={{ color: "#c9a84c" }} />
              </div>
              <h1 className="text-lg font-bold text-white tracking-tight">Forgot password?</h1>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                Enter your email and we'll send a 6-digit OTP code to restore access.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="fp-email"
                  className="block text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: "rgba(201,168,76,0.65)" }}
                >
                  Account Email
                </label>
                <div className="relative">
                  <Mail
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "rgba(255,255,255,0.22)" }}
                  />
                  <input
                    id="fp-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full h-11 pl-9 pr-4 text-sm outline-none rounded-xl transition-all"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      color: "#e0e0e0",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-3 text-xs text-red-400/80">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="pt-1 space-y-3">
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full h-11 rounded-xl text-sm font-bold text-black flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #c9a84c, #e8c76a)" }}
                >
                  {isLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      Send OTP Code
                      <Send size={14} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-colors"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                >
                  <ArrowLeft size={13} />
                  Go back
                </button>
              </div>
            </form>
          </>
        ) : (
          /* ── Sent state ── */
          <div className="text-center py-4 space-y-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.2)" }}
            >
              <CheckCircle2 size={28} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Check your inbox</h2>
              <p className="text-xs mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
                A 6-digit code has been sent to <br />
                <span style={{ color: "rgba(201,168,76,0.8)" }}>{email}</span>
              </p>
            </div>
            <button
              onClick={() => router.push("/reset-password")}
              className="w-full h-11 rounded-xl text-sm font-bold text-black transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #c9a84c, #e8c76a)" }}
            >
              Enter OTP Code
            </button>
            <button
              onClick={() => setIsSent(false)}
              className="text-xs transition-colors"
              style={{ color: "rgba(255,255,255,0.3)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
            >
              Didn't receive it? Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
