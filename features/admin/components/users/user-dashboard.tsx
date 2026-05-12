"use client";
import { useState, useMemo } from "react";
import { Search, Lock, Unlock, Eye, Plus, X, Check, Users, Crown, Shield } from "lucide-react";
import {
  mockCustomers, mockBookingHistory, mockStaff, TIER_RULES,
  Customer, StaffAccount, StaffRole, MembershipTier,
  tierConfig, statusConfig, roleConfig,
} from "./user-types";

type Tab = "customers" | "tiers" | "staff";

const inputCls = "w-full rounded-xl border border-[#1F2532] bg-[#0D1117] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60 transition-colors";
const selectCls = inputCls + " cursor-pointer";

function Badge({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ color, background: bg, border: `1px solid ${color}30` }}>
      {children}
    </span>
  );
}

function ActionBtn({ icon: Icon, tip, color, onClick }: { icon: React.ComponentType<{ className?: string }>; tip: string; color: string; onClick: () => void }) {
  return (
    <button title={tip} onClick={onClick} className="rounded-lg p-2 transition-all duration-200" style={{ color: "#8B949E" }}
      onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.background = color + "18"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "#8B949E"; e.currentTarget.style.background = "transparent"; }}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

function CustomerDetail({ customer, onClose, onToggleLock }: { customer: Customer; onClose: () => void; onToggleLock: (id: string) => void }) {
  const history = mockBookingHistory[customer.id] ?? [];
  const tc = tierConfig[customer.tier];
  const sc = statusConfig[customer.status];
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-0 right-0 z-50 h-full w-full max-w-lg overflow-y-auto" style={{ background: "#0D1117", borderLeft: "1px solid #1F2532", animation: "slideIn .3s ease-out" }}>
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4" style={{ background: "rgba(13,17,23,.95)", borderBottom: "1px solid #1F2532", backdropFilter: "blur(8px)" }}>
          <h2 className="text-base font-bold text-white">Chi tiết Khách hàng</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-[#8B949E] hover:text-white hover:bg-white/5 transition-all"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4 p-6">
          <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-lg font-bold text-white">{customer.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#8B949E" }}>{customer.id}</p>
              </div>
              <div className="flex gap-2">
                <Badge color={tc.color} bg={tc.bg}><Crown className="h-3 w-3" />{customer.tier}</Badge>
                <Badge color={sc.color} bg={sc.bg}>{sc.label}</Badge>
              </div>
            </div>
            {[["Email", customer.email], ["SĐT", customer.phone], ["Ngày tham gia", customer.joinedAt]].map(([l, v]) => (
              <div key={l} className="flex justify-between py-2 border-b border-[#1F2532]">
                <span className="text-xs text-[#8B949E]">{l}</span>
                <span className="text-xs font-medium text-white">{v}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Tổng chi tiêu", value: customer.totalSpend.toLocaleString("vi-VN") + "đ", color: "#2DD4BF" },
              { label: "Điểm thưởng",  value: customer.points.toLocaleString("vi-VN"),            color: "#F59E0B" },
              { label: "Số vé đã mua", value: customer.bookingCount.toString(),                     color: "#A78BFA" },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
                <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] mt-0.5 text-[#8B949E]">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-4" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8B949E] mb-3">Lịch sử mua vé</p>
            {history.length === 0 ? <p className="text-sm text-[#8B949E]">Chưa có giao dịch nào.</p> : history.map(b => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-[#1F2532] last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{b.movieTitle}</p>
                  <p className="text-xs text-[#8B949E]">{b.showDate} · {b.showtime} · {b.seats.join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#2DD4BF]">{b.amount.toLocaleString("vi-VN")}đ</p>
                  <p className="text-[10px]" style={{ color: b.status === "Đã thanh toán" ? "#10B981" : "#EF4444" }}>{b.status}</p>
                </div>
              </div>
            ))}
          </div>
          {customer.status !== "locked" ? (
            <button onClick={() => onToggleLock(customer.id)} className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-[#F87171] border border-red-500/30 hover:bg-red-500/10 transition-all">
              <Lock className="h-4 w-4" /> Khóa tài khoản
            </button>
          ) : (
            <button onClick={() => onToggleLock(customer.id)} className="w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-[#10B981] border border-emerald-500/30 hover:bg-emerald-500/10 transition-all">
              <Unlock className="h-4 w-4" /> Mở khóa tài khoản
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function StaffModal({ staff, onClose, onSave }: { staff: StaffAccount | null; onClose: () => void; onSave: (s: Omit<StaffAccount, "id" | "createdAt">) => void }) {
  const [form, setForm] = useState({ name: staff?.name ?? "", email: staff?.email ?? "", role: (staff?.role ?? "customer_support") as StaffRole, assignedCinema: staff?.assignedCinema ?? "", isActive: staff?.isActive ?? true });
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl" style={{ background: "#0D1117", border: "1px solid #1F2532", boxShadow: "0 25px 60px rgba(0,0,0,.7)", animation: "scaleIn .2s ease-out" }}>
          <style>{`@keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2532]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">{staff ? "Chỉnh sửa tài khoản" : "Tạo tài khoản nhân viên"}</h2>
            <button onClick={onClose} className="rounded-lg p-1.5 text-[#8B949E] hover:text-white transition-all"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-6 space-y-4">
            {[{ l: "Họ tên *", k: "name" as const }, { l: "Email *", k: "email" as const }].map(({ l, k }) => (
              <div key={k}>
                <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">{l}</label>
                <input className={inputCls} value={form[k] as string} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Vai trò</label>
              <select className={selectCls} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as StaffRole }))}>
                <option value="super_admin">Super Admin</option>
                <option value="cinema_manager">Quản lý Rạp</option>
                <option value="customer_support">CSKH</option>
              </select>
            </div>
            {form.role === "cinema_manager" && (
              <div>
                <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Cụm rạp phụ trách</label>
                <input className={inputCls} value={form.assignedCinema} onChange={e => setForm(f => ({ ...f, assignedCinema: e.target.value }))} placeholder="VD: CGV Vincom Center" />
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-[#1F2532] text-[#8B949E] hover:text-white transition-all">Hủy</button>
              <button onClick={() => { if (form.name && form.email) { onSave(form); onClose(); } }}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all"
                style={{ background: "linear-gradient(90deg,#7C3AED,#2DD4BF)", boxShadow: "0 4px 14px rgba(124,58,237,.3)", opacity: form.name && form.email ? 1 : 0.5 }}>
                {staff ? "Lưu thay đổi" : "Tạo tài khoản"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function UserDashboard() {
  const [tab, setTab] = useState<Tab>("customers");
  const [customers, setCustomers] = useState(mockCustomers);
  const [staff, setStaff] = useState(mockStaff);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<MembershipTier | "">("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [staffModal, setStaffModal] = useState<StaffAccount | null | "new">(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter(c => {
      const matchTier = !tierFilter || c.tier === tierFilter;
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
      return matchTier && matchQ;
    });
  }, [customers, search, tierFilter]);

  function toggleLock(id: string) {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: c.status === "active" ? "locked" : "active" } : c));
    setSelectedCustomer(prev => prev?.id === id ? { ...prev, status: prev.status === "active" ? "locked" : "active" } : prev);
  }

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "customers", label: "Khách hàng", icon: Users },
    { key: "tiers",     label: "Hạng thành viên", icon: Crown },
    { key: "staff",     label: "Phân quyền nhân sự", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Quản lý Người dùng</h1>
        <p className="mt-1 text-sm text-[#8B949E]">Khách hàng, hạng thành viên và phân quyền nhân sự.</p>
      </div>

      <div className="flex gap-1 border-b border-[#1F2532]">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className="flex items-center gap-2 px-4 pb-3 text-sm font-semibold border-b-2 transition-colors"
            style={{ borderColor: tab === t.key ? "#7C3AED" : "transparent", color: tab === t.key ? "#A78BFA" : "#8B949E" }}>
            <t.icon className="h-4 w-4" />{t.label}
          </button>
        ))}
      </div>

      {tab === "customers" && (
        <div className="space-y-4">
          <div className="rounded-2xl p-4" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B949E]" />
                <input className={inputCls + " pl-11"} value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên, email, SĐT..." />
              </div>
              <select className="rounded-xl border border-[#1F2532] bg-[#0D1117] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60 cursor-pointer lg:w-48"
                value={tierFilter} onChange={e => setTierFilter(e.target.value as MembershipTier | "")}>
                <option value="">Tất cả hạng</option>
                {(["Standard", "VIP", "VVIP"] as MembershipTier[]).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #1F2532" }}>
                    {["Khách hàng", "Liên hệ", "Hạng", "Tổng chi tiêu", "Điểm", "Trạng thái", "Hành động"].map(h => (
                      <th key={h} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#8B949E]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-16 text-center text-sm text-[#8B949E]">Không tìm thấy khách hàng nào.</td></tr>
                  ) : filtered.map(c => {
                    const tc = tierConfig[c.tier];
                    const sc = statusConfig[c.status];
                    return (
                      <tr key={c.id} className="cursor-pointer transition-colors" style={{ borderBottom: "1px solid #1F2532" }}
                        onClick={() => setSelectedCustomer(c)}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,.05)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td className="px-5 py-3">
                          <p className="font-medium text-white">{c.name}</p>
                          <p className="text-xs text-[#8B949E]">{c.id}</p>
                        </td>
                        <td className="px-5 py-3">
                          <p className="text-xs text-[#C9D1D9]">{c.email}</p>
                          <p className="text-xs text-[#8B949E]">{c.phone}</p>
                        </td>
                        <td className="px-5 py-3"><Badge color={tc.color} bg={tc.bg}>{c.tier}</Badge></td>
                        <td className="px-5 py-3 font-semibold text-[#2DD4BF]">{c.totalSpend.toLocaleString("vi-VN")}đ</td>
                        <td className="px-5 py-3 text-[#F59E0B] font-semibold">{c.points.toLocaleString("vi-VN")}</td>
                        <td className="px-5 py-3"><Badge color={sc.color} bg={sc.bg}>{sc.label}</Badge></td>
                        <td className="px-5 py-3" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-1">
                            <ActionBtn icon={Eye} tip="Xem" color="#2DD4BF" onClick={() => setSelectedCustomer(c)} />
                            <ActionBtn icon={c.status === "active" ? Lock : Unlock} tip={c.status === "active" ? "Khóa" : "Mở khóa"} color={c.status === "active" ? "#F43F5E" : "#10B981"} onClick={() => toggleLock(c.id)} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length > 0 && (
              <div className="px-5 py-3 border-t border-[#1F2532]">
                <p className="text-xs text-[#8B949E]">Hiển thị <span className="text-white font-semibold">{filtered.length}</span> / {customers.length} khách hàng</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "tiers" && (
        <div className="space-y-4">
          <p className="text-sm text-[#8B949E]">Quy tắc thăng hạng tự động dựa trên tổng chi tiêu tích lũy của khách hàng.</p>
          <div className="grid gap-4">
            {TIER_RULES.map(rule => (
              <div key={rule.tier} className="rounded-2xl p-6" style={{ background: "#161B22", border: `1px solid ${rule.color}30` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: rule.bg, border: `1px solid ${rule.color}40` }}>
                      <Crown className="h-5 w-5" style={{ color: rule.color }} />
                    </div>
                    <div>
                      <p className="font-bold text-white">{rule.tier}</p>
                      <p className="text-xs text-[#8B949E]">Chi tiêu tối thiểu: <span style={{ color: rule.color }}>{rule.minSpend.toLocaleString("vi-VN")}đ</span></p>
                    </div>
                  </div>
                  <span className="text-xs text-[#8B949E]">{customers.filter(c => c.tier === rule.tier).length} thành viên</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {rule.perks.map(perk => (
                    <span key={perk} className="flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs" style={{ background: rule.bg, color: rule.color, border: `1px solid ${rule.color}30` }}>
                      <Check className="h-3 w-3" />{perk}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "staff" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setStaffModal("new")} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all"
              style={{ background: "linear-gradient(90deg,#7C3AED,#2DD4BF)", boxShadow: "0 4px 20px rgba(124,58,237,.3)" }}>
              <Plus className="h-4 w-4" /> Tạo tài khoản nhân viên
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #1F2532" }}>
                  {["Nhân viên", "Email", "Vai trò", "Cụm rạp", "Trạng thái", "Hành động"].map(h => (
                    <th key={h} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#8B949E]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff.map(s => {
                  const rc = roleConfig[s.role];
                  return (
                    <tr key={s.id} style={{ borderBottom: "1px solid #1F2532" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,.05)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-white">{s.name}</p>
                        <p className="text-xs text-[#8B949E]">{s.id}</p>
                      </td>
                      <td className="px-5 py-3 text-sm text-[#C9D1D9]">{s.email}</td>
                      <td className="px-5 py-3"><Badge color={rc.color} bg={rc.bg}>{rc.label}</Badge></td>
                      <td className="px-5 py-3 text-sm text-[#8B949E]">{s.assignedCinema ?? "—"}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                          style={{ color: s.isActive ? "#10B981" : "#EF4444", background: s.isActive ? "rgba(16,185,129,.12)" : "rgba(239,68,68,.12)", border: `1px solid ${s.isActive ? "#10B981" : "#EF4444"}30` }}>
                          {s.isActive ? "Đang hoạt động" : "Đã vô hiệu"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <ActionBtn icon={Eye} tip="Sửa" color="#60A5FA" onClick={() => setStaffModal(s)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedCustomer && <CustomerDetail customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} onToggleLock={toggleLock} />}
      {staffModal !== null && (
        <StaffModal
          staff={staffModal === "new" ? null : staffModal}
          onClose={() => setStaffModal(null)}
          onSave={data => {
            if (staffModal === "new") {
              setStaff(prev => [...prev, { ...data, id: `S${String(prev.length + 1).padStart(3, "0")}`, createdAt: new Date().toISOString().split("T")[0] }]);
            } else {
              setStaff(prev => prev.map(s => s.id === (staffModal as StaffAccount).id ? { ...s, ...data } : s));
            }
          }}
        />
      )}
    </div>
  );
}
