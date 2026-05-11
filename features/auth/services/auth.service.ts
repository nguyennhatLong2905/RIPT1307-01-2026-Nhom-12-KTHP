import { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types";
import { MOCK_USER } from "@/constants";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const TOKEN_KEY = "luxe_token";
const USER_KEY = "luxe_user";

// ── TOKEN HELPERS ──────────────────────────────────────────────
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

function persistSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ── API CALLS (Backend: Java Spring / MySQL) ───────────────────
// Khi backend sẵn sàng, thay MOCK_USER bằng fetch(API_BASE + "/auth/...").
// Tất cả hàm trả về Promise<AuthResponse | void> giống REST API thật.

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Email hoặc mật khẩu không đúng.");
    return res.json() as Promise<AuthResponse>;
  }

  await new Promise((r) => setTimeout(r, 600));
  if (payload.password.length < 6) throw new Error("Email hoặc mật khẩu không đúng.");
  const mockResponse: AuthResponse = { user: MOCK_USER, token: "mock-jwt-token" };
  persistSession(mockResponse.token, mockResponse.user);
  return mockResponse;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Đăng ký thất bại. Email đã được sử dụng.");
    return res.json() as Promise<AuthResponse>;
  }

  await new Promise((r) => setTimeout(r, 600));
  const newUser: User = { ...MOCK_USER, name: payload.name, email: payload.email };
  const mockResponse: AuthResponse = { user: newUser, token: "mock-jwt-token" };
  persistSession(mockResponse.token, newUser);
  return mockResponse;
}

export async function logout(): Promise<void> {
  if (API_BASE) {
    const token = getStoredToken();
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  clearSession();
}

export async function forgotPassword(email: string): Promise<void> {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error("Không tìm thấy tài khoản với email này.");
    return;
  }
  await new Promise((r) => setTimeout(r, 800));
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  if (API_BASE) {
    const token = getStoredToken();
    const res = await fetch(`${API_BASE}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Cập nhật thất bại.");
    return res.json() as Promise<User>;
  }

  await new Promise((r) => setTimeout(r, 500));
  const current = getStoredUser() ?? MOCK_USER;
  const updated: User = { ...current, ...data };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  return updated;
}
