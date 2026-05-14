"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Camera,
  KeyRound,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { authService } from "../services/auth-service";
import { User as UserType } from "@/types";

/* ── Toast helper ── */
type ToastType = "success" | "error";
interface Toast { message: string; type: ToastType }

function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);
  const show = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };
  return { toast, show };
}

/* ── Styled input ── */
function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  disabled,
  placeholder,
  icon: Icon,
  required = true,
}: {
  label: string;
  id: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  icon?: React.ElementType;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[10px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: "rgba(201,168,76,0.7)" }}
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "rgba(255,255,255,0.2)" }}
          />
        )}
        <input
          id={id}
          type={type}
          required={required}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          placeholder={placeholder ?? ""}
          className={`w-full h-11 text-sm outline-none rounded-xl transition-all ${
            Icon ? "pl-9 pr-4" : "px-4"
          } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
          style={{
            background: disabled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "#e0e0e0",
          }}
          onFocus={(e) => {
            if (!disabled) e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
          }}
        />
      </div>
    </div>
  );
}

export default function ProfileForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<UserType>>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { toast, show } = useToast();

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile();
      setProfile(data);
    } catch {
      console.error("Error loading profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.fullName?.trim() || !profile.email?.trim() || !profile.phone?.trim()) {
      show("Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email || "")) {
      show("Email không đúng định dạng.", "error");
      return;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(profile.phone || "")) {
      show("Số điện thoại phải có đúng 10 chữ số.", "error");
      return;
    }
    setIsSaving(true);
    try {
      await authService.updateProfile(profile);
      show("Profile updated successfully.", "success");
    } catch {
      show("Failed to update profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      show("New passwords do not match.", "error");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      show("Password must be at least 6 characters.", "error");
      return;
    }
    setIsSaving(true);
    try {
      await authService.changePassword(passwordData.oldPassword, passwordData.newPassword);
      show("Password changed successfully.", "success");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      show("Incorrect current password.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "rgba(201,168,76,0.4)", borderTopColor: "#c9a84c" }}
          />
          <p className="text-xs text-white/30 uppercase tracking-widest">Loading profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium transition-all animate-in fade-in slide-in-from-top-2 ${
            toast.type === "success"
              ? "bg-emerald-950/90 border border-emerald-500/20 text-emerald-300"
              : "bg-red-950/90 border border-red-500/20 text-red-300"
          }`}
          style={{ backdropFilter: "blur(16px)" }}
        >
          {toast.type === "success" ? (
            <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle size={16} className="flex-shrink-0 text-red-400" />
          )}
          {toast.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        {/* ── Left: Avatar card ── */}
        <div className="space-y-4">
          <div
            className="rounded-2xl p-6 flex flex-col items-center text-center"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Avatar */}
            <div className="relative mb-5">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(201,168,76,0.1)",
                  border: "1.5px solid rgba(201,168,76,0.25)",
                }}
              >
                <User size={40} style={{ color: "#c9a84c" }} />
              </div>
              <button
                className="absolute bottom-0.5 right-0.5 w-7 h-7 rounded-full flex items-center justify-center text-black shadow-lg transition-transform hover:scale-105"
                style={{ background: "#c9a84c" }}
              >
                <Camera size={13} />
              </button>
            </div>

            <h3 className="text-base font-semibold text-white">{profile.fullName || "—"}</h3>
            <p
              className="text-[10px] uppercase tracking-[0.2em] font-medium mt-0.5"
              style={{ color: "rgba(201,168,76,0.6)" }}
            >
              Luxe Member
            </p>

            <div
              className="w-full mt-5 pt-5 space-y-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: "rgba(255,255,255,0.35)" }}>Role</span>
                <span className="font-semibold text-white/80">{profile.role ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: "rgba(255,255,255,0.35)" }}>Status</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Secure note */}
          <div
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: "rgba(52,211,153,0.04)",
              border: "1px solid rgba(52,211,153,0.1)",
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(52,211,153,0.1)" }}
            >
              <Lock size={14} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-400">Secure Account</p>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                Your data is encrypted.
              </p>
            </div>
          </div>
        </div>

        {/* ── Right: Forms ── */}
        <div className="space-y-5">
          {/* Personal Info */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <User size={15} style={{ color: "#c9a84c" }} />
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-white/80">
                Personal Information
              </h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Full Name"
                  id="fullName"
                  value={profile.fullName}
                  onChange={(v) => setProfile({ ...profile, fullName: v })}
                  icon={User}
                />
                <Field
                  label="Email"
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(v) => setProfile({ ...profile, email: v })}
                  icon={Mail}
                />
                <Field
                  label="Phone Number"
                  id="phone"
                  value={profile.phone}
                  onChange={(v) => setProfile({ ...profile, phone: v })}
                  icon={Phone}
                />
                <Field
                  label="Username"
                  id="username"
                  value={profile.username}
                  disabled
                  icon={User}
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 h-10 rounded-xl text-xs font-bold uppercase tracking-[0.12em] text-black transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #c9a84c, #e8c76a)" }}
                >
                  <Save size={14} />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-2.5 mb-6">
              <KeyRound size={15} style={{ color: "#c9a84c" }} />
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-white/80">
                Change Password
              </h2>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <Field
                label="Current Password"
                id="oldPassword"
                type="password"
                value={passwordData.oldPassword}
                onChange={(v) => setPasswordData({ ...passwordData, oldPassword: v })}
                placeholder="••••••••"
                icon={Lock}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="New Password"
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(v) => setPasswordData({ ...passwordData, newPassword: v })}
                  placeholder="••••••••"
                  icon={Lock}
                />
                <Field
                  label="Confirm New Password"
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(v) => setPasswordData({ ...passwordData, confirmPassword: v })}
                  placeholder="••••••••"
                  icon={Lock}
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 h-10 rounded-xl text-xs font-bold uppercase tracking-[0.12em] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(201,168,76,0.25)",
                    color: "rgba(201,168,76,0.9)",
                  }}
                >
                  <KeyRound size={14} />
                  {isSaving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
