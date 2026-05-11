"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth-utils";
import { ProfileForm } from "@/features/auth";

export default function ProfilePage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/?login=true");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null;
  return (
    <div className="min-h-screen bg-[#050505] p-4 py-32">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
            <h1 className="text-4xl font-bold italic tracking-tighter" style={{ color: "#c9a84c" }}>
                MY<span className="text-white">LUXE</span>
            </h1>
            <p className="text-white/40 text-sm mt-2 font-medium">Quản lý hồ sơ và bảo mật tài khoản của bạn</p>
        </div>
        <ProfileForm />
      </div>
    </div>
  );
}
