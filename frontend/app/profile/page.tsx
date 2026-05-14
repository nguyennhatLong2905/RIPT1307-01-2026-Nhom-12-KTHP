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
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Page header */}
        <div className="mb-10">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "#c9a84c" }}
          >
            My Account
          </h1>
          <p className="text-white/35 text-sm mt-1">
            Manage your profile and account security
          </p>
        </div>

        <ProfileForm />
      </div>
    </div>
  );
}
