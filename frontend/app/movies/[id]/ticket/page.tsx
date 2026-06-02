import { TicketCard } from "@/features/booking";
import { Suspense } from "react";

export default function TicketPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f11] flex items-center justify-center text-[#c9a84c]">ĐANG TẢI...</div>}>
      <TicketCard />
    </Suspense>
  );
}
