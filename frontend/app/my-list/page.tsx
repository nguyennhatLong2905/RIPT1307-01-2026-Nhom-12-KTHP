"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/lib/auth-utils";
import MyListContent from "@/features/my-list/components/my-list-content";

export default function MyListPage() {
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
    <div className="w-full h-full min-h-screen">
      <MyListContent />
    </div>
  );
}
