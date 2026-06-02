"use client";

import { RegisterForm } from "@/features/auth";

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 py-24"
      style={{ background: "#080808" }}
    >
      <RegisterForm />
    </div>
  );
}
