"use client";

import { ForgotPasswordForm } from "@/features/auth";

export default function ForgotPasswordPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "#080808" }}
    >
      <ForgotPasswordForm />
    </div>
  );
}
