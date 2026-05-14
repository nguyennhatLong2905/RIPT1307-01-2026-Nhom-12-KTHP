"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Film, AlertCircle } from "lucide-react";
import { authService, RegisterRequest } from "../services/auth-service";

/* ── Shared input component ── */
function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  rightSlot,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: React.ElementType;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: "rgba(201,168,76,0.65)" }}
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "rgba(255,255,255,0.22)" }}
          />
        )}
        <input
          id={id}
          type={type}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-11 text-sm outline-none rounded-xl transition-all"
          style={{
            paddingLeft: Icon ? "2.375rem" : "1rem",
            paddingRight: rightSlot ? "2.75rem" : "1rem",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "#e0e0e0",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
    </div>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterRequest>({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const set = (key: keyof RegisterRequest) => (v: string) =>
    setFormData((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.username.trim() || !formData.fullName.trim() || !formData.email.trim() || !formData.phone?.trim() || !formData.password.trim()) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email không đúng định dạng.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone || "")) {
      setError("Số điện thoại phải có đúng 10 chữ số.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    setIsLoading(true);
    try {
      await authService.register(formData);
      router.push("/?registered=1");
    } catch {
      setError("Registration failed. Username or email may already be taken.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full max-w-lg relative overflow-hidden rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-[#c9a84c]/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-[#c9a84c]/5 blur-3xl" />

      <div className="relative px-8 pt-10 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
          >
            <Film size={18} style={{ color: "#c9a84c" }} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Create account</h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              Join Luxe Cinema as a premium member
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Username"
              id="reg-username"
              value={formData.username}
              onChange={set("username")}
              placeholder="yourname"
              icon={User}
            />
            <Field
              label="Full Name"
              id="reg-fullname"
              value={formData.fullName}
              onChange={set("fullName")}
              placeholder="John Doe"
              icon={User}
            />
          </div>

          <Field
            label="Email"
            id="reg-email"
            type="email"
            value={formData.email}
            onChange={set("email")}
            placeholder="example@gmail.com"
            icon={Mail}
          />

          <Field
            label="Phone Number"
            id="reg-phone"
            value={formData.phone || ""}
            onChange={set("phone")}
            placeholder="09xx xxx xxx"
            icon={Phone}
          />

          <Field
            label="Password"
            id="reg-password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={set("password")}
            placeholder="Min. 6 characters"
            icon={Lock}
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ color: "rgba(255,255,255,0.25)" }}
                className="hover:text-white/50 transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            }
          />

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-3 text-xs text-red-400/80">
              <AlertCircle size={13} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl text-sm font-bold text-black flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #c9a84c, #e8c76a)" }}
            >
              {isLoading ? (
                "Creating account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/")}
                className="font-semibold transition-colors hover:opacity-80"
                style={{ color: "#c9a84c" }}
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
