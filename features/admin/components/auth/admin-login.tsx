"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";

const inputCls = "w-full rounded-xl border border-[#1F2532] bg-[#0D1117] px-4 py-3 pl-11 text-sm text-white outline-none transition-all focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setLoading(true);

    try {
      // Mock API call delay. 
      // Replace with: await axios.post('/api/auth/admin/login', { email, password })
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email === "admin@luxecinema.vn" && password === "admin123") {
        // Mock token storage.
        // Replace with: localStorage.setItem('admin_token', response.data.token)
        localStorage.setItem("admin_token", "mock_jwt_token_123");
        router.push("/admin");
      } else {
        setError("Email hoặc mật khẩu không chính xác.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4" style={{ background: "#0B0E14" }}>
      <div className="w-full max-w-[420px] rounded-3xl p-8" style={{ background: "#161B22", border: "1px solid #1F2532", boxShadow: "0 25px 60px rgba(0,0,0,.5)" }}>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-widest"
            style={{
              background: "linear-gradient(90deg, #7C3AED, #2DD4BF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
            LUXE ADMIN
          </h1>
          <p className="mt-2 text-sm text-[#8B949E]">Hệ thống quản trị LUXE CINEMA</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="rounded-xl bg-red-500/10 p-3 text-center text-xs font-medium text-red-500 border border-red-500/20">
              {error}
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B949E]" />
            <input
              type="email"
              placeholder="Email đăng nhập"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B949E]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              className={inputCls}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8B949E] hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(90deg, #7C3AED, #2DD4BF)",
              boxShadow: "0 4px 20px rgba(124,58,237,.3)",
            }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Đăng Nhập"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-xs font-medium text-[#8B949E] hover:text-white transition-colors">
            Quên mật khẩu?
          </a>
        </div>
      </div>
    </div>
  );
}
