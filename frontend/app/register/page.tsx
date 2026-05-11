"use client";

import { RegisterForm } from "@/features/auth";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 py-20">
      <RegisterForm />
    </div>
  );
}
