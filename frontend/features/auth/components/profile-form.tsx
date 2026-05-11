"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Save, Camera, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "../services/auth-service";
import { User as UserType } from "@/types";

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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await authService.updateProfile(profile);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setIsSaving(true);
    try {
      await authService.changePassword(passwordData.oldPassword, passwordData.newPassword);
      alert("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      alert("Incorrect old password or an error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-center py-20 text-[#c9a84c] animate-pulse">LOADING PROFILE...</div>;

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Cột trái: Ảnh đại diện & Thông tin nhanh */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-[#0d0d0d] border border-[#c9a84c]/20 p-8 rounded-3xl text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-[#c9a84c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative inline-block mb-4">
            <div className="w-32 h-32 rounded-full border-2 border-[#c9a84c] p-1">
              <div className="w-full h-full rounded-full bg-[#c9a84c]/10 flex items-center justify-center text-[#c9a84c]">
                <User size={64} />
              </div>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-[#c9a84c] text-black rounded-full shadow-lg hover:scale-110 transition-transform">
              <Camera size={16} />
            </button>
          </div>

          <h3 className="text-xl font-bold text-white">{profile.fullName}</h3>
          <p className="text-[#c9a84c] text-[10px] uppercase tracking-widest font-bold mt-1">LUXE MEMBER</p>
          
          <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
             <div className="flex items-center justify-between text-xs">
                <span className="text-white/40">Role</span>
                <span className="text-white font-bold">{profile.role}</span>
             </div>
             <div className="flex items-center justify-between text-xs">
                <p className="text-white/40 text-sm mt-2 font-medium">Manage your profile and account security</p>
                <span className="text-emerald-400 font-bold">Active</span>
             </div>
          </div>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Shield size={20} />
          </div>
          <div>
            <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Secure Account</div>
            <div className="text-xs text-white/40">Your information is securely encrypted.</div>
          </div>
        </div>
      </div>

      {/* Cột phải: Form cập nhật & Đổi mật khẩu */}
      <div className="md:col-span-2 space-y-8">
        {/* Form Thông tin cá nhân */}
        <div className="bg-[#0d0d0d] border border-[#c9a84c]/20 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <User size={20} className="text-[#c9a84c]" />
            PERSONAL INFORMATION
          </h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Full Name</Label>
                <Input 
                  value={profile.fullName} 
                  onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                  className="bg-white/5 border-white/10 focus:border-[#c9a84c]/50 rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Email</Label>
                <Input 
                  type="email"
                  value={profile.email} 
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="bg-white/5 border-white/10 focus:border-[#c9a84c]/50 rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Phone Number</Label>
                <Input 
                  value={profile.phone} 
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="bg-white/5 border-white/10 focus:border-[#c9a84c]/50 rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Username</Label>
                <Input 
                  value={profile.username} 
                  disabled
                  className="bg-white/5 border-white/5 rounded-xl h-12 opacity-50 cursor-not-allowed"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSaving}
              className="bg-[#c9a84c] hover:bg-[#b09340] text-black font-bold rounded-xl px-8 h-12 flex items-center gap-2"
            >
              <Save size={18} />
              {isSaving ? "SAVING..." : "SAVE CHANGES"}
            </Button>
          </form>
        </div>

        {/* Form Đổi mật khẩu */}
        <div className="bg-[#0d0d0d] border border-[#c9a84c]/20 p-8 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Lock size={20} className="text-[#c9a84c]" />
            CHANGE PASSWORD
          </h2>
          
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Old Password</Label>
              <Input 
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                className="bg-white/5 border-white/10 focus:border-[#c9a84c]/50 rounded-xl h-12"
                placeholder="••••••••"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">New Password</Label>
                <Input 
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="bg-white/5 border-white/10 focus:border-[#c9a84c]/50 rounded-xl h-12"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Confirm Password</Label>
                <Input 
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="bg-white/5 border-white/10 focus:border-[#c9a84c]/50 rounded-xl h-12"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSaving}
              variant="outline"
              className="border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c] hover:text-black font-bold rounded-xl px-8 h-12 transition-all"
            >
              {isSaving ? "PROCESSING..." : "UPDATE PASSWORD"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
