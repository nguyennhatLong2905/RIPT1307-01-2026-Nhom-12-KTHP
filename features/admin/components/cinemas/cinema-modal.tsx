"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Cinema, Room, RoomFormat, CinemaStatus, roomFormatOptions, generateSeatMap } from "./cinema-types";
import SeatLayoutEditor from "./seat-layout-editor";

interface CinemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cinema: Cinema) => void;
  cinema?: Cinema | null;
}

type Tab = "info" | "rooms" | "seat";

const emptyRoom = (): Room => ({
  id: `room_${Date.now()}`,
  name: "",
  format: "Standard",
  seatLayout: generateSeatMap(6, 10),
});

const emptyForm = (): Omit<Cinema, "id"> => ({
  name: "", address: "", hotline: "", status: "Active", rooms: [],
});

export default function CinemaModal({ isOpen, onClose, onSave, cinema }: CinemaModalProps) {
  const [tab,         setTab]         = useState<Tab>("info");
  const [form,        setForm]        = useState<Omit<Cinema, "id">>(emptyForm());
  const [seatRoomIdx, setSeatRoomIdx] = useState<number | null>(null);
  const isEdit = !!cinema;

  useEffect(() => {
    if (cinema) {
      setForm({ name: cinema.name, address: cinema.address, hotline: cinema.hotline, status: cinema.status, rooms: cinema.rooms });
    } else {
      setForm(emptyForm());
    }
    setTab("info");
    setSeatRoomIdx(null);
  }, [cinema, isOpen]);

  if (!isOpen) return null;

  const valid = form.name.trim() && form.address.trim();

  const handleSubmit = () => {
    if (!valid) return;
    onSave({ id: cinema?.id ?? `cin_${Date.now()}`, ...form });
  };

  const addRoom = () => setForm(f => ({ ...f, rooms: [...f.rooms, emptyRoom()] }));
  const removeRoom = (i: number) => setForm(f => ({ ...f, rooms: f.rooms.filter((_, idx) => idx !== i) }));
  const updateRoom = (i: number, patch: Partial<Room>) =>
    setForm(f => ({ ...f, rooms: f.rooms.map((r, idx) => idx === i ? { ...r, ...patch } : r) }));

  const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm bg-[#0D1117] border border-[#1F2532] text-white outline-none focus:border-violet-500/60 transition-colors";
  const statusList: { key: CinemaStatus; label: string; color: string }[] = [
    { key: "Active",   label: "Đang hoạt động", color: "#2DD4BF" },
    { key: "Pending",  label: "Sắp chiếu",      color: "#60A5FA" },
    { key: "Inactive", label: "Ngừng chiếu",    color: "#8B949E" },
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: "info",  label: "Thông tin rạp" },
    { key: "rooms", label: `Phòng chiếu (${form.rooms.length})` },
    ...(seatRoomIdx !== null ? [{ key: "seat" as Tab, label: `Sơ đồ: ${form.rooms[seatRoomIdx]?.name || "Phòng"}` }] : []),
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="w-full max-w-2xl max-h-[92vh] overflow-hidden rounded-2xl flex flex-col"
          style={{ background: "#0D1117", border: "1px solid #1F2532", boxShadow: "0 25px 60px rgba(0,0,0,0.7)", animation: "scaleIn 0.25s ease-out" }}>
          <style>{`@keyframes scaleIn{from{transform:scale(0.95);opacity:0}to{transform:scale(1);opacity:1}}`}</style>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2532] bg-[#0D1117]/95 backdrop-blur-lg shrink-0">
            <h2 className="text-lg font-bold text-white">{isEdit ? "Chỉnh sửa Cụm Rạp" : "Thêm Cụm Rạp Mới"}</h2>
            <button onClick={onClose} className="rounded-lg p-2 text-[#8B949E] hover:text-white hover:bg-violet-600/15 transition-all"><X className="h-5 w-5" /></button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-6 pt-3 shrink-0 border-b border-[#1F2532]">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className="px-3 pb-3 text-xs font-semibold border-b-2 transition-colors"
                style={{ borderColor: tab === t.key ? "#7C3AED" : "transparent", color: tab === t.key ? "#A78BFA" : "#8B949E" }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-6">
            {/* ── TAB: Info ── */}
            {tab === "info" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Tên Rạp *</label>
                    <input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: CGV Vincom Center" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Hotline</label>
                    <input className={inputCls} value={form.hotline} onChange={e => setForm(f => ({ ...f, hotline: e.target.value }))} placeholder="1900 xxxx" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Địa chỉ *</label>
                  <input className={inputCls} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Số nhà, Đường, Quận, Thành phố" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#8B949E] mb-2">Trạng thái</label>
                  <div className="flex gap-2">
                    {statusList.map(s => (
                      <button key={s.key} type="button" onClick={() => setForm(f => ({ ...f, status: s.key }))}
                        className="rounded-lg px-3 py-2 text-xs font-semibold border transition-all duration-200"
                        style={{
                          background: form.status === s.key ? s.color + "20" : "rgba(255,255,255,0.03)",
                          color: form.status === s.key ? s.color : "#8B949E",
                          borderColor: form.status === s.key ? s.color + "50" : "#1F2532",
                        }}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Rooms ── */}
            {tab === "rooms" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#8B949E]">Thêm các phòng chiếu cho cụm rạp này.</p>
                  <button onClick={addRoom}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-cyan-500 shadow-[0_4px_16px_rgba(124,58,237,0.3)] hover:-translate-y-px transition-all duration-200">
                    <Plus className="h-3.5 w-3.5" /> Thêm phòng
                  </button>
                </div>

                {form.rooms.length === 0 ? (
                  <div className="text-center py-10 text-[#8B949E] text-sm border-2 border-dashed border-[#1F2532] rounded-2xl">
                    Chưa có phòng chiếu nào. Nhấn &quot;Thêm phòng&quot; để bắt đầu.
                  </div>
                ) : (
                  form.rooms.map((room, i) => (
                    <div key={room.id} className="rounded-xl border border-[#1F2532] bg-[#161B22] p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#A78BFA]">Phòng #{i + 1}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setSeatRoomIdx(i); setTab("seat"); }}
                            className="text-xs text-[#60A5FA] hover:text-white transition-colors underline underline-offset-2">
                            Chỉnh sơ đồ ghế
                          </button>
                          <button onClick={() => removeRoom(i)} className="text-[#F43F5E] hover:text-white p-1 rounded transition-colors"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Tên Phòng</label>
                          <input className={inputCls} value={room.name} onChange={e => updateRoom(i, { name: e.target.value })} placeholder="VD: Phòng 1, Phòng Gold..." />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Phân loại định dạng</label>
                          <select className={inputCls + " cursor-pointer"}
                            value={room.format} onChange={e => updateRoom(i, { format: e.target.value as RoomFormat })}>
                            {roomFormatOptions.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="text-xs text-[#8B949E]">
                        Sơ đồ: {room.seatLayout.rows} hàng × {room.seatLayout.cols} cột
                        ({room.seatLayout.rows * room.seatLayout.cols} ghế)
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── TAB: Seat Layout ── */}
            {tab === "seat" && seatRoomIdx !== null && form.rooms[seatRoomIdx] && (
              <SeatLayoutEditor
                initial={form.rooms[seatRoomIdx].seatLayout}
                onSave={map => { updateRoom(seatRoomIdx, { seatLayout: map }); setTab("rooms"); }}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#1F2532] shrink-0">
            <button onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-[#8B949E] border border-[#1F2532] hover:border-[#8B949E] hover:text-white transition-all duration-200">
              Hủy
            </button>
            <button onClick={handleSubmit}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300"
              style={{
                background: "linear-gradient(90deg,#7C3AED,#2DD4BF)",
                boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
                opacity: valid ? 1 : 0.5,
                cursor: valid ? "pointer" : "not-allowed",
              }}>
              {isEdit ? "Lưu thay đổi" : "Thêm cụm rạp"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
