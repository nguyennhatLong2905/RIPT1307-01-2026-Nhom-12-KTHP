"use client";
import { useState, useMemo } from "react";
import { Plus, X, Tag, Percent, DollarSign, Copy, Check } from "lucide-react";
import { mockCoupons, couponStatusConfig, ALL_CINEMAS, ALL_TIERS, Coupon, CouponStatus, DiscountType, CouponScope } from "./promotion-types";
import { MembershipTier } from "../users/user-types";

const inputCls = "w-full rounded-xl border border-[#1F2532] bg-[#0D1117] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60 transition-colors";
const selectCls = inputCls + " cursor-pointer";

const emptyForm = {
  code: "", name: "", discountType: "percent" as DiscountType, discountValue: 10,
  scope: "ticket_only" as CouponScope, minOrderValue: 0, maxDiscount: 0,
  startDate: "", endDate: "", usageLimit: 100,
  applicableTiers: ["Standard", "VIP", "VVIP"] as MembershipTier[],
  applicableCinemas: ["Tất cả rạp"],
};

function CouponModal({ coupon, onClose, onSave }: {
  coupon: Coupon | null; onClose: () => void;
  onSave: (data: typeof emptyForm) => void;
}) {
  const [form, setForm] = useState(coupon ? {
    code: coupon.code, name: coupon.name, discountType: coupon.discountType,
    discountValue: coupon.discountValue, scope: coupon.scope,
    minOrderValue: coupon.minOrderValue, maxDiscount: coupon.maxDiscount ?? 0,
    startDate: coupon.startDate, endDate: coupon.endDate, usageLimit: coupon.usageLimit,
    applicableTiers: coupon.applicableTiers, applicableCinemas: coupon.applicableCinemas,
  } : emptyForm);

  function toggleTier(t: MembershipTier) {
    setForm(f => ({ ...f, applicableTiers: f.applicableTiers.includes(t) ? f.applicableTiers.filter(x => x !== t) : [...f.applicableTiers, t] }));
  }
  function toggleCinema(c: string) {
    if (c === "Tất cả rạp") { setForm(f => ({ ...f, applicableCinemas: ["Tất cả rạp"] })); return; }
    setForm(f => {
      const next = f.applicableCinemas.filter(x => x !== "Tất cả rạp");
      return { ...f, applicableCinemas: next.includes(c) ? next.filter(x => x !== c) : [...next, c] };
    });
  }

  const set = <K extends keyof typeof emptyForm>(k: K, v: (typeof emptyForm)[K]) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-lg rounded-2xl my-4" style={{ background: "#0D1117", border: "1px solid #1F2532", boxShadow: "0 25px 60px rgba(0,0,0,.7)", animation: "scaleIn .2s ease-out" }}>
          <style>{`@keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2532]">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white">{coupon ? "Chỉnh sửa mã" : "Tạo mã giảm giá"}</h2>
            <button onClick={onClose} className="rounded-lg p-1.5 text-[#8B949E] hover:text-white transition-all"><X className="h-4 w-4" /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Mã giảm giá *</label>
                <input className={inputCls} value={form.code} onChange={e => set("code", e.target.value.toUpperCase())} placeholder="VD: LUXE20" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Loại áp dụng</label>
                <select className={selectCls} value={form.scope} onChange={e => set("scope", e.target.value as CouponScope)}>
                  <option value="ticket_only">Chỉ vé xem phim</option>
                  <option value="all">Tất cả đơn hàng</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Tên khuyến mãi *</label>
              <input className={inputCls} value={form.name} onChange={e => set("name", e.target.value)} placeholder="VD: Giảm 20% cho thành viên VIP" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Kiểu giảm giá</label>
                <div className="flex gap-2">
                  {(["percent", "fixed"] as DiscountType[]).map(type => (
                    <button key={type} onClick={() => set("discountType", type)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold border transition-all"
                      style={{ background: form.discountType === type ? "rgba(124,58,237,.2)" : "transparent", borderColor: form.discountType === type ? "rgba(124,58,237,.5)" : "#1F2532", color: form.discountType === type ? "#A78BFA" : "#8B949E" }}>
                      {type === "percent" ? <Percent className="h-3 w-3" /> : <DollarSign className="h-3 w-3" />}
                      {type === "percent" ? "Phần trăm" : "Số tiền cố định"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Giá trị giảm {form.discountType === "percent" ? "(%)" : "(đ)"}</label>
                <input type="number" className={inputCls} value={form.discountValue} onChange={e => set("discountValue", Number(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Đơn tối thiểu (đ)</label>
                <input type="number" className={inputCls} value={form.minOrderValue} onChange={e => set("minOrderValue", Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Giảm tối đa (đ)</label>
                <input type="number" className={inputCls} value={form.maxDiscount} onChange={e => set("maxDiscount", Number(e.target.value))} placeholder="0 = không giới hạn" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Ngày bắt đầu</label>
                <input type="date" className={inputCls} value={form.startDate} onChange={e => set("startDate", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Ngày kết thúc</label>
                <input type="date" className={inputCls} value={form.endDate} onChange={e => set("endDate", e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Số lần dùng</label>
                <input type="number" className={inputCls} value={form.usageLimit} onChange={e => set("usageLimit", Number(e.target.value))} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8B949E] mb-2">Hạng thành viên áp dụng</label>
              <div className="flex gap-2">
                {ALL_TIERS.map(t => (
                  <button key={t} onClick={() => toggleTier(t)}
                    className="flex-1 rounded-lg py-2 text-xs font-semibold border transition-all"
                    style={{ background: form.applicableTiers.includes(t) ? "rgba(124,58,237,.2)" : "transparent", borderColor: form.applicableTiers.includes(t) ? "rgba(124,58,237,.5)" : "#1F2532", color: form.applicableTiers.includes(t) ? "#A78BFA" : "#8B949E" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#8B949E] mb-2">Rạp áp dụng</label>
              <div className="flex flex-wrap gap-2">
                {ALL_CINEMAS.map(c => (
                  <button key={c} onClick={() => toggleCinema(c)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all"
                    style={{ background: form.applicableCinemas.includes(c) ? "rgba(45,212,191,.15)" : "transparent", borderColor: form.applicableCinemas.includes(c) ? "rgba(45,212,191,.4)" : "#1F2532", color: form.applicableCinemas.includes(c) ? "#2DD4BF" : "#8B949E" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-[#1F2532] text-[#8B949E] hover:text-white transition-all">Hủy</button>
              <button onClick={() => { if (form.code && form.name) { onSave(form); onClose(); } }}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all"
                style={{ background: "linear-gradient(90deg,#7C3AED,#2DD4BF)", boxShadow: "0 4px 14px rgba(124,58,237,.3)" }}>
                {coupon ? "Lưu thay đổi" : "Tạo mã giảm giá"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PromotionDashboard() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [modal, setModal] = useState<Coupon | null | "new">(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CouponStatus | "">("");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return coupons.filter(c => {
      const ms = !statusFilter || c.status === statusFilter;
      const mq = !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
      return ms && mq;
    });
  }, [coupons, search, statusFilter]);

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  }

  function handleSave(data: typeof emptyForm) {
    if (modal === "new") {
      setCoupons(prev => [...prev, {
        ...data, id: `CP${String(prev.length + 1).padStart(3, "0")}`,
        usedCount: 0, status: "active" as CouponStatus,
        maxDiscount: data.maxDiscount || undefined,
      }]);
    } else if (modal) {
      setCoupons(prev => prev.map(c => c.id === (modal as Coupon).id ? { ...c, ...data, maxDiscount: data.maxDiscount || undefined } : c));
    }
  }

  const stats = useMemo(() => ({
    active: coupons.filter(c => c.status === "active").length,
    totalUsed: coupons.reduce((a, c) => a + c.usedCount, 0),
    expired: coupons.filter(c => c.status === "expired").length,
  }), [coupons]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Quản lý Khuyến Mãi</h1>
          <p className="mt-1 text-sm text-[#8B949E]">Tạo và quản lý mã giảm giá theo điều kiện sử dụng.</p>
        </div>
        <button onClick={() => setModal("new")} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all"
          style={{ background: "linear-gradient(90deg,#7C3AED,#2DD4BF)", boxShadow: "0 4px 20px rgba(124,58,237,.3)" }}>
          <Plus className="h-4 w-4" /> Tạo mã giảm giá
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Đang hoạt động", value: stats.active,    color: "#10B981", glow: "rgba(16,185,129,.2)" },
          { label: "Lượt đã dùng",   value: stats.totalUsed, color: "#A78BFA", glow: "rgba(167,139,250,.2)" },
          { label: "Đã hết hạn",     value: stats.expired,   color: "#8B949E", glow: "rgba(139,148,158,.2)" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
            <p className="text-2xl font-bold" style={{ color: s.color, textShadow: `0 0 20px ${s.glow}` }}>{s.value}</p>
            <p className="text-xs mt-1 text-[#8B949E]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-4" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B949E]" />
            <input className={inputCls + " pl-11"} value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo mã hoặc tên..." />
          </div>
          <select className="rounded-xl border border-[#1F2532] bg-[#0D1117] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60 cursor-pointer lg:w-52"
            value={statusFilter} onChange={e => setStatusFilter(e.target.value as CouponStatus | "")}>
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="expired">Hết hạn</option>
            <option value="disabled">Đã tắt</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #1F2532" }}>
                {["Mã", "Tên", "Giảm giá", "Điều kiện", "Thời hạn", "Lượt dùng", "Trạng thái", ""].map(h => (
                  <th key={h} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#8B949E] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-16 text-center text-sm text-[#8B949E]">Không tìm thấy mã giảm giá nào.</td></tr>
              ) : filtered.map(c => {
                const sc = couponStatusConfig[c.status];
                return (
                  <tr key={c.id} style={{ borderBottom: "1px solid #1F2532" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#A78BFA]">{c.code}</span>
                        <button onClick={() => handleCopy(c.code)} className="rounded p-1 text-[#8B949E] hover:text-white transition-colors">
                          {copied === c.code ? <Check className="h-3 w-3 text-[#10B981]" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3 max-w-[180px]">
                      <p className="truncate text-[#C9D1D9]">{c.name}</p>
                      <p className="text-[10px] text-[#8B949E]">{c.scope === "ticket_only" ? "Chỉ vé xem phim" : "Tất cả đơn"}</p>
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#2DD4BF] whitespace-nowrap">
                      {c.discountType === "percent" ? `${c.discountValue}%` : `${c.discountValue.toLocaleString("vi-VN")}đ`}
                    </td>
                    <td className="px-5 py-3 text-xs text-[#8B949E]">
                      {c.minOrderValue > 0 ? `Từ ${c.minOrderValue.toLocaleString("vi-VN")}đ` : "Không giới hạn"}
                    </td>
                    <td className="px-5 py-3 text-xs text-[#8B949E] whitespace-nowrap">
                      {c.startDate} → {c.endDate}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ width: 60, background: "#1F2532" }}>
                          <div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.min((c.usedCount / c.usageLimit) * 100, 100)}%` }} />
                        </div>
                        <span className="text-xs text-[#8B949E]">{c.usedCount}/{c.usageLimit}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap"
                        style={{ color: sc.color, background: sc.bg, border: `1px solid ${sc.color}30` }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: sc.color, boxShadow: `0 0 6px ${sc.glow}` }} />{sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => setModal(c)} className="rounded-lg px-3 py-1.5 text-xs font-semibold border border-[#1F2532] text-[#8B949E] hover:text-white hover:border-[#8B949E] transition-all">Sửa</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {modal !== null && <CouponModal coupon={modal === "new" ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}
    </div>
  );
}
