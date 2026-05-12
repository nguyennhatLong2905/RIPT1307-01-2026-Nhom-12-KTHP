"use client";
import { useState, useMemo } from "react";
import { Image, Info, Settings, CreditCard, ClipboardList, Plus, Trash2, Eye, EyeOff, Search } from "lucide-react";
import {
  mockBanners, mockContactInfo, mockPointConfig, mockGateways, mockAuditLogs,
  Banner, ContactInfo, PointConfig, PaymentGateway, AuditModule,
  auditActionConfig, auditModuleConfig,
} from "./settings-types";

type Tab = "banners" | "contact" | "points" | "payments" | "audit";

const inputCls = "w-full rounded-xl border border-[#1F2532] bg-[#0D1117] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500/60 transition-colors";
const textareaCls = inputCls + " resize-none";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#8B949E] mb-4">{title}</p>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">{children}</label>;
}

function SaveBtn({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-end pt-2">
      <button onClick={onClick} className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all"
        style={{ background: "linear-gradient(90deg,#7C3AED,#2DD4BF)", boxShadow: "0 4px 14px rgba(124,58,237,.3)" }}>
        Lưu thay đổi
      </button>
    </div>
  );
}

function BannersTab() {
  const [banners, setBanners] = useState(mockBanners);
  function toggleActive(id: string) { setBanners(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b)); }
  function remove(id: string) { setBanners(prev => prev.filter(b => b.id !== id)); }
  function add() {
    setBanners(prev => [...prev, { id: `B${String(prev.length + 1).padStart(3, "0")}`, title: "Banner mới", imageUrl: "", linkUrl: "", order: prev.length + 1, isActive: false }]);
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-[#8B949E]">Quản lý các banner/slider hiển thị trên trang chủ.</p>
        <button onClick={add} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(90deg,#7C3AED,#2DD4BF)", boxShadow: "0 4px 14px rgba(124,58,237,.25)" }}>
          <Plus className="h-4 w-4" /> Thêm banner
        </button>
      </div>
      {banners.map((b, idx) => (
        <div key={b.id} className="rounded-2xl p-4" style={{ background: "#161B22", border: `1px solid ${b.isActive ? "rgba(45,212,191,.3)" : "#1F2532"}` }}>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl overflow-hidden" style={{ background: "#0D1117", border: "1px solid #1F2532" }}>
              {b.imageUrl
                ? <img src={b.imageUrl} alt={b.title} className="h-full w-full object-cover" onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                : <Image className="h-5 w-5 text-[#8B949E]" />}
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              <input className={inputCls} value={b.title} onChange={e => setBanners(prev => prev.map(x => x.id === b.id ? { ...x, title: e.target.value } : x))} placeholder="Tiêu đề banner" />
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} value={b.imageUrl} onChange={e => setBanners(prev => prev.map(x => x.id === b.id ? { ...x, imageUrl: e.target.value } : x))} placeholder="URL hình ảnh" />
                <input className={inputCls} value={b.linkUrl} onChange={e => setBanners(prev => prev.map(x => x.id === b.id ? { ...x, linkUrl: e.target.value } : x))} placeholder="URL liên kết khi click" />
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-[#8B949E]">#{idx + 1}</span>
              <button onClick={() => toggleActive(b.id)} title={b.isActive ? "Ẩn" : "Hiện"}
                className="rounded-lg p-2 transition-all" style={{ color: b.isActive ? "#2DD4BF" : "#8B949E" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(45,212,191,.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
                {b.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => remove(b.id)} title="Xóa"
                className="rounded-lg p-2 transition-all text-[#8B949E] hover:text-red-400 hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactTab() {
  const [info, setInfo] = useState<ContactInfo>(mockContactInfo);
  const set = <K extends keyof ContactInfo>(k: K, v: ContactInfo[K]) => setInfo(f => ({ ...f, [k]: v }));
  return (
    <div className="space-y-4">
      <SectionCard title="Thông tin liên hệ">
        <div className="grid grid-cols-2 gap-4">
          {[{ l: "Tên công ty", k: "companyName" as const }, { l: "Địa chỉ", k: "address" as const }, { l: "Hotline", k: "hotline" as const }, { l: "Email hỗ trợ", k: "email" as const }, { l: "Facebook", k: "facebook" as const }, { l: "Instagram", k: "instagram" as const }].map(({ l, k }) => (
            <div key={k}>
              <FieldLabel>{l}</FieldLabel>
              <input className={inputCls} value={info[k]} onChange={e => set(k, e.target.value)} />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <FieldLabel>Footer text</FieldLabel>
          <input className={inputCls} value={info.footer} onChange={e => set("footer", e.target.value)} />
        </div>
      </SectionCard>
      <SectionCard title="Chính sách & Điều khoản">
        <div className="space-y-4">
          <div>
            <FieldLabel>Chính sách bảo mật</FieldLabel>
            <textarea rows={4} className={textareaCls} value={info.privacyPolicy} onChange={e => set("privacyPolicy", e.target.value)} />
          </div>
          <div>
            <FieldLabel>Điều khoản sử dụng</FieldLabel>
            <textarea rows={4} className={textareaCls} value={info.termsOfService} onChange={e => set("termsOfService", e.target.value)} />
          </div>
        </div>
      </SectionCard>
      <SaveBtn onClick={() => {}} />
    </div>
  );
}

function PointsTab() {
  const [cfg, setCfg] = useState<PointConfig>(mockPointConfig);
  return (
    <div className="space-y-4">
      <SectionCard title="Cấu hình tích lũy điểm thưởng">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <FieldLabel>Chi tiêu để được 1 điểm (đ)</FieldLabel>
            <input type="number" className={inputCls} value={cfg.spendPerPoint} onChange={e => setCfg(f => ({ ...f, spendPerPoint: Number(e.target.value) }))} />
            <p className="text-[10px] text-[#8B949E] mt-1">VD: 10,000đ = 1 điểm</p>
          </div>
          <div>
            <FieldLabel>Điểm đổi 1,000đ (điểm)</FieldLabel>
            <input type="number" className={inputCls} value={cfg.redeemRatio} onChange={e => setCfg(f => ({ ...f, redeemRatio: Number(e.target.value) }))} />
            <p className="text-[10px] text-[#8B949E] mt-1">VD: 1,000 điểm = 1,000đ</p>
          </div>
          <div>
            <FieldLabel>Hạn điểm (ngày)</FieldLabel>
            <input type="number" className={inputCls} value={cfg.pointExpiryDays} onChange={e => setCfg(f => ({ ...f, pointExpiryDays: Number(e.target.value) }))} />
            <p className="text-[10px] text-[#8B949E] mt-1">Kể từ ngày tích lũy</p>
          </div>
        </div>
        <div className="mt-4 rounded-xl p-3 text-xs" style={{ background: "#0D1117", border: "1px solid #1F2532" }}>
          <p className="text-[#8B949E]">Xem trước: <span className="text-white font-semibold">Mua 100,000đ</span> → <span className="text-[#F59E0B] font-bold">{Math.floor(100000 / cfg.spendPerPoint)} điểm</span> · Đổi <span className="text-white font-semibold">{cfg.redeemRatio} điểm</span> → <span className="text-[#2DD4BF] font-bold">1,000đ</span></p>
        </div>
      </SectionCard>
      <SaveBtn onClick={() => {}} />
    </div>
  );
}

function PaymentsTab() {
  const [gateways, setGateways] = useState<PaymentGateway[]>(mockGateways);
  function toggle(id: string) { setGateways(prev => prev.map(g => g.id === id ? { ...g, isActive: !g.isActive } : g)); }
  function toggleSandbox(id: string) { setGateways(prev => prev.map(g => g.id === id ? { ...g, sandbox: !g.sandbox } : g)); }
  return (
    <div className="space-y-4">
      <p className="text-sm text-[#8B949E]">Cấu hình kết nối các cổng thanh toán. API Key sẽ được mã hóa khi lưu.</p>
      {gateways.map(g => (
        <div key={g.id} className="rounded-2xl p-5" style={{ background: "#161B22", border: `1px solid ${g.isActive ? "rgba(45,212,191,.3)" : "#1F2532"}` }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "rgba(124,58,237,.15)", border: "1px solid rgba(124,58,237,.3)" }}>
                <CreditCard className="h-4 w-4 text-[#A78BFA]" />
              </div>
              <div>
                <p className="font-semibold text-white">{g.name}</p>
                <p className="text-xs text-[#8B949E]">Provider: {g.provider}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-[#8B949E]">Sandbox</span>
                <div onClick={() => toggleSandbox(g.id)} className="relative w-9 h-5 rounded-full cursor-pointer transition-colors" style={{ background: g.sandbox ? "rgba(245,158,11,.4)" : "#1F2532" }}>
                  <div className="absolute top-0.5 h-4 w-4 rounded-full transition-transform" style={{ background: g.sandbox ? "#F59E0B" : "#8B949E", transform: g.sandbox ? "translateX(16px)" : "translateX(2px)" }} />
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs text-[#8B949E]">{g.isActive ? "Đang bật" : "Đã tắt"}</span>
                <div onClick={() => toggle(g.id)} className="relative w-9 h-5 rounded-full cursor-pointer transition-colors" style={{ background: g.isActive ? "rgba(45,212,191,.4)" : "#1F2532" }}>
                  <div className="absolute top-0.5 h-4 w-4 rounded-full transition-transform" style={{ background: g.isActive ? "#2DD4BF" : "#8B949E", transform: g.isActive ? "translateX(16px)" : "translateX(2px)" }} />
                </div>
              </label>
            </div>
          </div>
          <div>
            <FieldLabel>API Key</FieldLabel>
            <input type="password" className={inputCls} value={g.apiKey} onChange={e => setGateways(prev => prev.map(x => x.id === g.id ? { ...x, apiKey: e.target.value } : x))} placeholder="Nhập API Key mới..." />
          </div>
        </div>
      ))}
      <SaveBtn onClick={() => {}} />
    </div>
  );
}

function AuditTab() {
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<AuditModule | "">("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mockAuditLogs.filter(l => {
      const mm = !moduleFilter || l.module === moduleFilter;
      const mq = !q || l.staffName.toLowerCase().includes(q) || l.target.toLowerCase().includes(q) || l.detail.toLowerCase().includes(q);
      return mm && mq;
    });
  }, [search, moduleFilter]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B949E]" />
            <input className={inputCls + " pl-11"} value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo nhân viên, đối tượng, mô tả..." />
          </div>
          <select className="rounded-xl border border-[#1F2532] bg-[#0D1117] px-3 py-2.5 text-sm text-white outline-none cursor-pointer lg:w-48"
            value={moduleFilter} onChange={e => setModuleFilter(e.target.value as AuditModule | "")}>
            <option value="">Tất cả module</option>
            {(Object.keys(auditModuleConfig) as AuditModule[]).map(m => (
              <option key={m} value={m}>{auditModuleConfig[m].label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid #1F2532" }}>
              {["Thời gian", "Nhân viên", "Hành động", "Module", "Đối tượng", "Mô tả", "IP"].map(h => (
                <th key={h} className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-[#8B949E] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-5 py-16 text-center text-sm text-[#8B949E]">Không tìm thấy nhật ký nào.</td></tr>
            ) : filtered.map(log => {
              const ac = auditActionConfig[log.action];
              return (
                <tr key={log.id} style={{ borderBottom: "1px solid #1F2532" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,.05)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="px-4 py-3 text-xs text-[#8B949E] whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-white">{log.staffName}</p>
                    <p className="text-[10px] text-[#8B949E]">{log.staffId}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold" style={{ color: ac.color, background: ac.bg, border: `1px solid ${ac.color}30` }}>{ac.label}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#C9D1D9] whitespace-nowrap">{auditModuleConfig[log.module].label}</td>
                  <td className="px-4 py-3 text-xs text-[#A78BFA] font-mono">{log.target}</td>
                  <td className="px-4 py-3 text-xs text-[#8B949E] max-w-[220px]">
                    <p className="truncate">{log.detail}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#8B949E] font-mono whitespace-nowrap">{log.ipAddress}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-[#1F2532]">
            <p className="text-xs text-[#8B949E]">Hiển thị <span className="text-white font-semibold">{filtered.length}</span> / {mockAuditLogs.length} bản ghi</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsDashboard() {
  const [tab, setTab] = useState<Tab>("banners");
  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "banners",  label: "Banner & Slider", icon: Image },
    { key: "contact",  label: "Liên hệ & Nội dung", icon: Info },
    { key: "points",   label: "Điểm thưởng", icon: Settings },
    { key: "payments", label: "Cổng thanh toán", icon: CreditCard },
    { key: "audit",    label: "Nhật ký hệ thống", icon: ClipboardList },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Cấu hình Hệ thống</h1>
        <p className="mt-1 text-sm text-[#8B949E]">Giao diện, vận hành và nhật ký thao tác hệ thống.</p>
      </div>
      <div className="flex gap-1 border-b border-[#1F2532] overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className="flex items-center gap-2 px-4 pb-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap"
            style={{ borderColor: tab === t.key ? "#7C3AED" : "transparent", color: tab === t.key ? "#A78BFA" : "#8B949E" }}>
            <t.icon className="h-4 w-4" />{t.label}
          </button>
        ))}
      </div>
      {tab === "banners"  && <BannersTab />}
      {tab === "contact"  && <ContactTab />}
      {tab === "points"   && <PointsTab />}
      {tab === "payments" && <PaymentsTab />}
      {tab === "audit"    && <AuditTab />}
    </div>
  );
}
