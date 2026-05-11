"use client";

import BookingHistory from "@/features/booking/components/booking-history";
import { useEffect, useState } from "react";
import { isLoggedIn } from "@/lib/auth-utils";
import { useRouter } from "next/navigation";

export default function BookingsPage() {
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
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
            <h1 className="text-4xl font-bold italic tracking-tighter" style={{ color: "#c9a84c" }}>
                BOOKING<span className="text-white">HISTORY</span>
            </h1>
            <p className="text-white/40 text-sm mt-2 font-medium">Theo dõi các giao dịch và suất chiếu của bạn</p>
        </div>
        <BookingHistory />
      </div>
    </div>
  );
}
