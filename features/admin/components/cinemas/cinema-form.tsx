"use client";

import { useState, useMemo } from "react";
import { Search, Eye, Pencil, Trash2, Plus, Building2 } from "lucide-react";
import { Cinema, CinemaStatus, mockCinemas, statusConfig } from "./cinema-types";
import CinemaModal from "./cinema-modal";

type FilterKey = "all" | CinemaStatus;

const filterTabs: { key: FilterKey; label: string; status?: CinemaStatus }[] = [
  { key: "all",      label: "Tất cả" },
  { key: "Active",   label: "Đang hoạt động", status: "Active" },
  { key: "Pending",  label: "Sắp chiếu",      status: "Pending" },
  { key: "Inactive", label: "Ngừng chiếu",    status: "Inactive" },
];

export default function CinemaForm() {
  const [cinemas,      setCinemas]      = useState<Cinema[]>(mockCinemas);
  const [search,       setSearch]       = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editing,      setEditing]      = useState<Cinema | null>(null);
  const [deleteId,     setDeleteId]     = useState<string | null>(null);
  const [viewCinema,   setViewCinema]   = useState<Cinema | null>(null);

  const counts = useMemo(() => ({
    all:      cinemas.length,
    Active:   cinemas.filter(c => c.status === "Active").length,
    Pending:  cinemas.filter(c => c.status === "Pending").length,
    Inactive: cinemas.filter(c => c.status === "Inactive").length,
  }), [cinemas]);

  const filtered = useMemo(() => {
    let res = cinemas;
    if (activeFilter !== "all") res = res.filter(c => c.status === activeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(c => c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q));
    }
    return res;
  }, [cinemas, search, activeFilter]);

  const openAdd  = () => { setEditing(null);    setModalOpen(true); };
  const openEdit = (c: Cinema) => { setEditing(c); setModalOpen(true); };
  const handleSave = (cinema: Cinema) => {
    setCinemas(prev => {
      const exists = prev.find(c => c.id === cinema.id);
      return exists ? prev.map(c => c.id === cinema.id ? cinema : c) : [cinema, ...prev];
    });
    setModalOpen(false);
  };
  const handleDelete = () => {
    if (deleteId) { setCinemas(prev => prev.filter(c => c.id !== deleteId)); setDeleteId(null); }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Quản lý Cụm Rạp</h1>
            <p className="mt-1 text-sm text-[#8B949E]">Quản lý danh sách rạp chiếu phim, phòng chiếu và sơ đồ ghế.</p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300"
            style={{ background: "linear-gradient(90deg,#7C3AED,#2DD4BF)", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 30px rgba(124,58,237,0.5)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.3)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <Plus className="h-4 w-4" /> Thêm Cụm Rạp
          </button>
        </div>

        {/* Filter + Search bar */}
        <div className="rounded-2xl border border-[#1F2532] bg-[#161B22] p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-4 w-4 text-[#8B949E]" />
              </div>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Tìm kiếm rạp (Tên, Địa chỉ)..."
                className="w-full rounded-xl py-2.5 pl-11 pr-4 text-sm bg-[#0D1117] border border-[#1F2532] text-white outline-none transition-all"
                onFocus={e => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = "#1F2532"; e.currentTarget.style.boxShadow = "none"; }} />
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
              {filterTabs.map(tab => {
                const count = tab.key === "all" ? counts.all : counts[tab.key as CinemaStatus];
                const active = activeFilter === tab.key;
                return (
                  <button key={tab.key} onClick={() => setActiveFilter(tab.key)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium border transition-all duration-200"
                    style={{
                      background: active ? "rgba(124,58,237,0.2)" : "transparent",
                      color: active ? "#A78BFA" : "#8B949E",
                      borderColor: active ? "rgba(124,58,237,0.4)" : "transparent",
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#FFF"; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = "#8B949E"; }}>
                    {tab.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[#1F2532] bg-[#161B22]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#1F2532]">
                  {["TÊN CỤM RẠP", "ĐỊA CHỈ", "HOTLINE", "SỐ PHÒNG", "TRẠNG THÁI", "HÀNH ĐỘNG"].map(h => (
                    <th key={h} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#8B949E]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center text-sm text-[#8B949E]">
                      <Building2 className="mx-auto h-10 w-10 mb-3 opacity-30" />
                      Không tìm thấy cụm rạp nào.
                    </td>
                  </tr>
                ) : filtered.map(cinema => {
                  const cfg = statusConfig[cinema.status];
                  return (
                    <tr key={cinema.id}
                      className="border-b border-[#1F2532] cursor-pointer transition-colors duration-150"
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(124,58,237,0.05)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      onClick={() => setViewCinema(cinema)}>
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
                            <Building2 className="h-4 w-4 text-violet-400" />
                          </div>
                          <span className="font-semibold text-white">{cinema.name}</span>
                        </div>
                      </td>
                      {/* Address */}
                      <td className="px-5 py-4 max-w-[220px]">
                        <p className="truncate text-sm text-[#C9D1D9]">{cinema.address}</p>
                      </td>
                      {/* Hotline */}
                      <td className="px-5 py-4 whitespace-nowrap text-[#C9D1D9]">{cinema.hotline}</td>
                      {/* Rooms */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {cinema.rooms.length === 0
                            ? <span className="text-xs text-[#8B949E]">—</span>
                            : cinema.rooms.map(r => (
                              <span key={r.id} className="rounded-md px-2 py-0.5 text-[10px] font-semibold"
                                style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.25)" }}>
                                {r.name || r.format}
                              </span>
                            ))}
                        </div>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                          <span className="h-1.5 w-1.5 rounded-full"
                            style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.glow}` }} />
                          {cfg.label}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <ActionBtn icon={Eye}    tip="Xem"  color="#2DD4BF" onClick={() => setViewCinema(cinema)} />
                          <ActionBtn icon={Pencil} tip="Sửa"  color="#60A5FA" onClick={() => openEdit(cinema)} />
                          <ActionBtn icon={Trash2} tip="Xóa"  color="#F43F5E" onClick={() => setDeleteId(cinema.id)} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      <CinemaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} cinema={editing} />

      {/* ── Quick View Panel ── */}
      {viewCinema && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setViewCinema(null)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto p-6 space-y-5"
            style={{ background: "#0D1117", borderLeft: "1px solid #1F2532", animation: "slideIn 0.25s ease-out" }}
            onClick={e => e.stopPropagation()}>
            <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{viewCinema.name}</h2>
                <p className="text-xs text-[#8B949E] mt-1">{viewCinema.address}</p>
              </div>
              <button onClick={() => setViewCinema(null)} className="rounded-lg p-2 text-[#8B949E] hover:text-white hover:bg-white/5 transition-all"><span>✕</span></button>
            </div>

            <div className="space-y-2">
              <InfoRow label="Hotline" value={viewCinema.hotline} />
              <InfoRow label="Trạng thái" value={statusConfig[viewCinema.status].label} />
              <InfoRow label="Số phòng"  value={`${viewCinema.rooms.length} phòng`} />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#8B949E] mb-3 uppercase tracking-wider">Danh sách phòng chiếu</p>
              <div className="space-y-2">
                {viewCinema.rooms.length === 0
                  ? <p className="text-sm text-[#8B949E]">Chưa có phòng chiếu nào.</p>
                  : viewCinema.rooms.map(r => (
                    <div key={r.id} className="rounded-xl border border-[#1F2532] bg-[#161B22] p-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white text-sm">{r.name}</p>
                        <p className="text-xs text-[#8B949E]">{r.seatLayout.rows} × {r.seatLayout.cols} ghế</p>
                      </div>
                      <span className="rounded-md px-2 py-0.5 text-xs font-bold"
                        style={{ background: "rgba(124,58,237,0.2)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.3)" }}>
                        {r.format}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => { setViewCinema(null); openEdit(viewCinema); }}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all"
                style={{ background: "linear-gradient(90deg,#7C3AED,#2DD4BF)", boxShadow: "0 4px 16px rgba(124,58,237,0.3)" }}>
                Chỉnh sửa
              </button>
              <button onClick={() => { setDeleteId(viewCinema.id); setViewCinema(null); }}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold border border-[#F43F5E]/30 text-[#F43F5E] hover:bg-[#F43F5E]/10 transition-all">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl p-6 space-y-4"
              style={{ background: "#0D1117", border: "1px solid #1F2532", boxShadow: "0 25px 60px rgba(0,0,0,0.7)", animation: "scaleIn 0.2s ease-out" }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F43F5E]/10 border border-[#F43F5E]/30 mx-auto">
                <Trash2 className="h-5 w-5 text-[#F43F5E]" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-white mb-1">Xác nhận xóa cụm rạp</h3>
                <p className="text-sm text-[#8B949E]">Hành động này không thể hoàn tác. Tất cả phòng chiếu liên quan cũng sẽ bị xóa.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold border border-[#1F2532] text-[#8B949E] hover:border-[#8B949E] hover:text-white transition-all">
                  Hủy
                </button>
                <button onClick={handleDelete}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white bg-[#F43F5E] hover:bg-[#e1294d] transition-all shadow-[0_4px_16px_rgba(244,63,94,0.3)]">
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function ActionBtn({ icon: Icon, tip, color, onClick }: {
  icon: React.ComponentType<{ className?: string }>; tip: string; color: string; onClick: () => void;
}) {
  return (
    <button title={tip} onClick={onClick}
      className="rounded-lg p-2 text-[#8B949E] transition-all duration-200"
      onMouseEnter={e => { e.currentTarget.style.color = color; e.currentTarget.style.background = color + "15"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "#8B949E"; e.currentTarget.style.background = "transparent"; }}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#1F2532]">
      <span className="text-xs text-[#8B949E]">{label}</span>
      <span className="text-xs font-semibold text-white">{value}</span>
    </div>
  );
}
