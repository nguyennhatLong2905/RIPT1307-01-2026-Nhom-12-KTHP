import Link from "next/link";
import { ForgotPasswordForm } from "@/features/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quên Mật Khẩu — LUXE CINEMA",
  description: "Đặt lại mật khẩu tài khoản LUXE CINEMA của bạn",
};

export default function ForgotPasswordPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "linear-gradient(180deg, #0d0d0d 0%, #111111 100%)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col gap-6"
        style={{ backgroundColor: "#111111", border: "1px solid rgba(201,168,76,0.2)" }}
      >
        <div className="text-center">
          <h1
            className="text-2xl font-bold tracking-[0.15em]"
            style={{ color: "#c9a84c" }}
          >
            QUÊN MẬT KHẨU
          </h1>
          <p className="text-xs text-neutral-500 mt-2 tracking-wide">
            Nhập email để nhận link đặt lại mật khẩu
          </p>
        </div>

        <ForgotPasswordForm />

        <Link
          href="/"
          className="text-xs text-center tracking-wide text-neutral-600 hover:text-neutral-400 transition-colors"
        >
          ← Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
