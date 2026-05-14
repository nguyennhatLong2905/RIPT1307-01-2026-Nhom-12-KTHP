"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, DoorOpen, X, ChevronLeft, ChevronRight, ChevronDown, AlertCircle } from "lucide-react";
import { adminService } from "../services/admin-service";
import { Room, Cinema } from "@/types";

const cardStyle = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" };
const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" };
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)");
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)");
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: "rgba(201,168,76,0.65)" }}>{children}</label>;
}
const inputCls = "w-full h-10 px-3 text-sm text-white/85 outline-none rounded-xl transition-all placeholder:text-white/20";

function CustomSelect({
  name,
  value,
  onChange,
  options,
  placeholder = "Select...",
}: {
  name?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative">
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-3 text-sm text-left flex items-center justify-between outline-none rounded-xl transition-all cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: isOpen ? "1px solid rgba(201,168,76,0.4)" : "1px solid rgba(255,255,255,0.09)",
          color: selectedOption ? "#ffffff" : "rgba(255,255,255,0.25)",
        }}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          size={14}
          className="transition-transform duration-200 flex-shrink-0 ml-2"
          style={{
            color: isOpen ? "#c9a84c" : "rgba(255,255,255,0.3)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div
            className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-[#c9a84c]/15 bg-[#0d0d0d] p-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl max-h-60 overflow-y-auto z-50"
            style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(201,168,76,0.2) transparent" }}
          >
            <div className="space-y-1">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl p-2 transition-colors text-left group cursor-pointer ${
                      isSelected ? "bg-white/8" : "hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`text-xs font-semibold truncate transition-colors ${
                        isSelected ? "text-[#c9a84c]" : "text-white/85 group-hover:text-[#c9a84c]"
                      }`}
                    >
                      {option.label}
                    </span>
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);
  const [selectedCinemaId, setSelectedCinemaId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const itemsPerPage = 10;

  useEffect(() => { fetchRooms(); fetchCinemasData(); }, []);
  useEffect(() => {
    setSelectedCinemaId(editingRoom?.cinema ? editingRoom.cinema.id.toString() : "");
  }, [editingRoom]);

  const fetchRooms = async () => {
    setIsLoading(true);
    try { setRooms(await adminService.getRooms()); }
    catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };
  const fetchCinemasData = async () => {
    try { setCinemas(await adminService.getCinemas()); }
    catch (e) { console.error(e); }
  };

  const handleDelete = async (id: number) => {
    try { await adminService.deleteRoom(id); fetchRooms(); setDeleteConfirmId(null); }
    catch { setError("Error deleting room."); }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    if (!selectedCinemaId) {
      setError("Vui lòng chọn rạp cho phòng chiếu!");
      return;
    }
    const data: any = {
      name: fd.get("name"),
      rowsCount: parseInt(fd.get("rowsCount") as string),
      colsCount: parseInt(fd.get("colsCount") as string),
      cinema: { id: parseInt(selectedCinemaId) },
    };
    setIsSaving(true);
    try {
      if (editingRoom?.id) await adminService.updateRoom(editingRoom.id, data);
      else await adminService.addRoom(data);
      closeDialog(); fetchRooms();
    } catch { setError("Error saving room."); }
    finally { setIsSaving(false); }
  };

  const closeDialog = () => { setIsDialogOpen(false); setEditingRoom(null); setSelectedCinemaId(""); setError(""); };

  const filtered = rooms.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.cinema?.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Rooms</h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Configure seating layout for each room</p>
        </div>
        <button onClick={() => { setEditingRoom(null); setIsDialogOpen(true); }} className="flex items-center gap-2 px-4 h-9 rounded-xl text-xs font-bold text-black transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #c9a84c, #e8c76a)" }}>
          <Plus size={15} />Add Room
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.25)" }} />
            <input type="text" placeholder="Search rooms..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className={`${inputCls} pl-8`} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{filtered.length} rooms</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Cinema", "Room", "Rows", "Cols", "Seats", "Actions"].map(h => (
                <th 
                  key={h} 
                  className={`py-3 text-xs font-bold uppercase tracking-[0.15em] ${
                    h === "Actions" ? "px-8 text-center" : 
                    h === "Room" ? "pl-12 pr-8 text-left" :
                    h === "Cinema" ? "pl-24 pr-8 text-left" :
                    ["Rows", "Cols", "Seats"].includes(h) ? "px-8 text-center" : "px-8 text-left"
                  }`} 
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={6} className="py-12 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Loading...</td></tr>
              : paginated.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>No rooms found</td></tr>
              : paginated.map(room => (
                <tr key={room.id} className="transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <td className="px-8 py-3 text-sm text-left" style={{ color: "rgba(201,168,76,0.8)" }}>{room.cinema?.name || "—"}</td>
                  <td className="px-8 py-3 text-left">
                    <div className="flex items-center justify-start gap-2">
                      <DoorOpen size={13} style={{ color: "rgba(255,255,255,0.3)" }} />
                      <span className="font-medium text-white/85 text-sm">{room.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-3 text-sm text-white/45 text-center">{room.rowsCount}</td>
                  <td className="px-8 py-3 text-sm text-white/45 text-center">{room.colsCount}</td>
                  <td className="px-8 py-3 text-sm font-bold text-center" style={{ color: "#c9a84c" }}>{room.rowsCount * room.colsCount}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-1">
                      <button onClick={() => { setEditingRoom(room); setIsDialogOpen(true); }} className="p-1.5 rounded-lg transition-colors" style={{ color: "rgba(96,165,250,0.7)" }} onMouseEnter={e => { e.currentTarget.style.color = "#60a5fa"; e.currentTarget.style.background = "rgba(96,165,250,0.08)"; }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(96,165,250,0.7)"; e.currentTarget.style.background = "transparent"; }}><Edit2 size={14} /></button>
                      <div className="relative">
                        <button onClick={() => setDeleteConfirmId(deleteConfirmId === room.id ? null : room.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: deleteConfirmId === room.id ? "#ef4444" : "rgba(239,68,68,0.6)", background: deleteConfirmId === room.id ? "rgba(239,68,68,0.12)" : "transparent" }} onMouseEnter={e => { if (deleteConfirmId !== room.id) { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; } }} onMouseLeave={e => { if (deleteConfirmId !== room.id) { e.currentTarget.style.color = "rgba(239,68,68,0.6)"; e.currentTarget.style.background = "transparent"; } }}><Trash2 size={14} /></button>
                        
                        {deleteConfirmId === room.id && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 p-2 rounded-xl border flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200" style={{ background: "#1a1a1a", borderColor: "rgba(239,68,68,0.3)", backdropFilter: "blur(20px)", minWidth: "140px" }}>
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider ml-1">Delete?</span>
                            <div className="flex gap-1 ml-auto">
                              <button onClick={() => handleDelete(room.id)} className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all bg-[#ef4444] text-white hover:bg-[#dc2626]">Yes</button>
                              <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60">No</button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30" style={{ color: "rgba(255,255,255,0.5)" }}><ChevronLeft size={14} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className="w-7 h-7 rounded-lg text-xs font-semibold" style={{ background: currentPage === page ? "#c9a84c" : "transparent", color: currentPage === page ? "#000" : "rgba(255,255,255,0.45)" }}>{page}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30" style={{ color: "rgba(255,255,255,0.5)" }}><ChevronRight size={14} /></button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }} onClick={e => { if (e.target === e.currentTarget) closeDialog(); }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.09)" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <h2 className="text-sm font-bold text-white">{editingRoom ? "Edit Room" : "Add Room"}</h2>
              <button onClick={closeDialog} className="p-1.5 rounded-lg" style={{ color: "rgba(255,255,255,0.4)" }} onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <Label>Cinema Branch</Label>
                <CustomSelect
                  value={selectedCinemaId}
                  onChange={setSelectedCinemaId}
                  options={cinemas.map((c) => ({ value: c.id.toString(), label: c.name }))}
                  placeholder="Select a cinema..."
                />
              </div>
              <div>
                <Label>Room Name</Label>
                <input name="name" required defaultValue={editingRoom?.name} placeholder="Room 01, IMAX..." className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Rows (max 15)</Label>
                  <input name="rowsCount" type="number" min="1" max="15" required defaultValue={editingRoom?.rowsCount} className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <Label>Columns (max 20)</Label>
                  <input name="colsCount" type="number" min="1" max="20" required defaultValue={editingRoom?.colsCount} className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-3 text-xs text-red-400/80">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  {error}
                </div>
              )}
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={closeDialog} className="px-4 h-9 rounded-xl text-xs font-medium" style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.09)" }}>Cancel</button>
                <button type="submit" disabled={isSaving} className="px-5 h-9 rounded-xl text-xs font-bold text-black hover:opacity-90 disabled:opacity-40" style={{ background: "linear-gradient(135deg, #c9a84c, #e8c76a)" }}>{isSaving ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
