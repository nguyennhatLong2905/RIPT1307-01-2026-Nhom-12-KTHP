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
  ShieldCheck,
} from "lucide-react";
import { authService } from "../services/auth-service";
import { User as UserType } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

/* ── Minimal Input Field (Professional UI) ── */
function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  disabled,
  placeholder,
  icon: Icon,
}: {
  label: string;
  id: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="space-y-1.5 group">
      <label htmlFor={id} className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 group-focus-within:text-[#c9a84c] transition-colors">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          placeholder={placeholder ?? ""}
          className={`w-full h-12 text-sm bg-white/[0.03] border-b-2 border-transparent px-4 rounded-t-lg transition-all outline-none focus:bg-white/[0.06] focus:border-[#c9a84c] ${
            disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-white/[0.05]"
          }`}
        />
        {Icon && (
          <Icon
            size={14}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 group-focus-within:text-[#c9a84c]/50 transition-colors pointer-events-none"
          />
        )}
      </div>
    </div>
  );
}

export default function ProfileForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [profile, setProfile] = useState<Partial<UserType>>({
    fullName: "",
    email: "",
    phone: "",
    username: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { toast, show } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

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
    setIsSaving(true);
    try {
      await authService.updateProfile(profile);
      show("Hồ sơ đã được cập nhật.", "success");
    } catch {
      show("Cập nhật thất bại.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      show("Mật khẩu mới không khớp.", "error");
      return;
    }
    setIsChangingPassword(true);
    try {
      await authService.changePassword(passwordData.oldPassword, passwordData.newPassword);
      show("Đổi mật khẩu thành công.", "success");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setIsPasswordModalOpen(false);
    } catch {
      show("Mật khẩu cũ không chính xác.", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-40">
        <div className="w-10 h-10 border-2 border-white/5 border-t-[#c9a84c] animate-spin rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 animate-in fade-in duration-700">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-sm font-bold backdrop-blur-xl border ${
          toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-12 items-start">
        {/* ── Left Column: User Card ── */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/5 shadow-2xl relative">
              <User size={64} className="text-[#c9a84c]/20" />
            </div>
            <button className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[#c9a84c] text-black flex items-center justify-center shadow-xl hover:scale-110 transition-all">
              <Camera size={16} />
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">{profile.fullName}</h2>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Customer</span>
            </div>
          </div>

        </div>

        {/* ── Right Column: Main Content ── */}
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em]">Personal Information</h3>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <Field label="Full Name" id="fullName" value={profile.fullName} onChange={(v) => setProfile({ ...profile, fullName: v })} icon={User} placeholder="John Doe" />
                <Field label="Email Address" id="email" type="email" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} icon={Mail} placeholder="john@example.com" />
                <Field label="Phone Number" id="phone" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} icon={Phone} placeholder="0123456789" />
                <Field label="Username" id="username" value={profile.username} disabled icon={User} />
              </div>

              <div className="pt-4 flex flex-col space-y-6">
                <div className="flex justify-start">
                  <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                    <DialogTrigger asChild>
                      <button type="button" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#c9a84c] hover:text-white transition-all">
                        <KeyRound size={14} />
                        Change Password
                      </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0a0a0a] border border-white/10 text-white rounded-2xl p-8 sm:max-w-[420px] shadow-2xl">
                      <DialogHeader className="mb-8">
                        <DialogTitle className="text-lg font-bold uppercase tracking-widest">Change Password</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleChangePassword} className="space-y-6">
                        <Field label="Current Password" id="oldP" type="password" value={passwordData.oldPassword} onChange={(v) => setPasswordData({ ...passwordData, oldPassword: v })} icon={Lock} />
                        <div className="h-px bg-white/5 my-2" />
                        <Field label="New Password" id="newP" type="password" value={passwordData.newPassword} onChange={(v) => setPasswordData({ ...passwordData, newPassword: v })} icon={Lock} />
                        <Field label="Confirm New Password" id="confP" type="password" value={passwordData.confirmPassword} onChange={(v) => setPasswordData({ ...passwordData, confirmPassword: v })} icon={Lock} />
                        
                        <div className="flex gap-3 pt-4">
                          <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="flex-1 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-white/5 hover:bg-white/5 text-white/40 transition-all">
                            Cancel
                          </button>
                          <button type="submit" disabled={isChangingPassword} className="flex-[2] h-12 rounded-xl bg-[#c9a84c] text-black text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[#c9a84c]/20">
                            {isChangingPassword ? "Updating..." : "Update Password"}
                          </button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSaving} 
                    className="px-10 h-12 rounded-xl bg-[#c9a84c] text-black text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-[#c9a84c]/20"
                  >
                    {isSaving ? <div className="w-4 h-4 border-2 border-black/20 border-t-black animate-spin rounded-full" /> : <Save size={16} />}
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
