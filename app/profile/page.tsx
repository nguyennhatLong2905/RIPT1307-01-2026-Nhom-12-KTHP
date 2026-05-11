"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileCard } from "@/features/auth";
import { useAuth } from "@/features/auth";

export default function ProfilePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.replace("/");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "linear-gradient(180deg, #0d0d0d 0%, #111111 100%)" }}
    >
      <div className="w-full max-w-md mb-8 text-center">
        <h1
          className="text-3xl font-bold tracking-[0.15em]"
          style={{ color: "#c9a84c" }}
        >
          HỒ SƠ CÁ NHÂN
        </h1>
        <div
          className="mt-3 mx-auto h-[1.5px] w-24"
          style={{
            background:
              "linear-gradient(90deg, transparent, #c9a84c, transparent)",
          }}
        />
      </div>
      <ProfileCard />
    </div>
  );
}
