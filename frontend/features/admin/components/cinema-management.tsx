"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, MapPin, X, AlertCircle } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { adminService } from "../services/admin-service";
import { Cinema } from "@/types";

const cardStyle = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" };
const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" };
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)");
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)");
function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5" style={{ color: "rgba(201,168,76,0.65)" }}>{children}</label>;
}
const inputCls = "w-full h-10 px-3 text-sm text-white/85 outline-none rounded-xl transition-all placeholder:text-white/20";

export default function CinemaManagement() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCinema, setEditingCinema] = useState<Partial<Cinema> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const itemsPerPage = 10;

  useEffect(() => { fetchCinemas(); }, []);

  const fetchCinemas = async () => {
    setIsLoading(true);
    try { setCinemas(await adminService.getCinemas()); }
    catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleDelete = async (id: number) => {
    try { await adminService.deleteCinema(id); fetchCinemas(); setDeleteConfirmId(null); }
    catch { setError("Error deleting cinema."); }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: any = { name: fd.get("name"), address: fd.get("address"), imageUrl: fd.get("imageUrl"), description: fd.get("description") };
    setIsSaving(true);
    try {
      if (editingCinema?.id) await adminService.updateCinema(editingCinema.id, data);
      else await adminService.addCinema(data);
      closeDialog(); fetchCinemas();
    } catch { setError("Error saving cinema."); }
    finally { setIsSaving(false); }
  };

  const closeDialog = () => { setIsDialogOpen(false); setEditingCinema(null); setError(""); };

  const filtered = cinemas.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const Pagination = () => totalPages <= 1 ? null : (
    <div className="flex justify-center">
      <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30" style={{ color: "rgba(255,255,255,0.5)" }}><ChevronLeft size={14} /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button key={page} onClick={() => setCurrentPage(page)} className="w-7 h-7 rounded-lg text-xs font-semibold" style={{ background: currentPage === page ? "#c9a84c" : "transparent", color: currentPage === page ? "#000" : "rgba(255,255,255,0.45)" }}>{page}</button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30" style={{ color: "rgba(255,255,255,0.5)" }}><ChevronRight size={14} /></button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Cinemas</h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Manage cinema branches and locations</p>
        </div>
        <button onClick={() => { setEditingCinema(null); setIsDialogOpen(true); }} className="flex items-center gap-2 px-4 h-9 rounded-xl text-xs font-bold text-black transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #c9a84c, #e8c76a)" }}>
          <Plus size={15} />Add Cinema
        </button>
      </div>

      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.25)" }} />
            <input type="text" placeholder="Search cinemas..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className={`${inputCls} pl-8`} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>{filtered.length} cinemas</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Cinema", "Address", "Actions"].map(h => (
                <th 
                  key={h} 
                  className={`py-3 text-xs font-bold uppercase tracking-[0.15em] ${h === "Actions" ? "px-8 text-center" : "pl-24 pr-8 text-left"}`} 
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={3} className="py-12 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Loading...</td></tr>
              : paginated.length === 0 ? <tr><td colSpan={3} className="py-12 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>No cinemas found</td></tr>
              : paginated.map(cinema => (
                <tr key={cinema.id} className="transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <td className="px-8 py-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.15)" }}>
                        {cinema.imageUrl ? <img src={cinema.imageUrl} alt={cinema.name} className="w-full h-full object-cover" /> : <MapPin size={14} style={{ color: "#c9a84c" }} />}
                      </div>
                      <span className="font-medium text-white/85 text-sm">{cinema.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-3 text-sm text-left" style={{ color: "rgba(255,255,255,0.45)" }}>{cinema.address}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-1">
                      <button onClick={() => { setEditingCinema(cinema); setIsDialogOpen(true); }} className="p-1.5 rounded-lg transition-colors" style={{ color: "rgba(96,165,250,0.7)" }} onMouseEnter={e => { e.currentTarget.style.color = "#60a5fa"; e.currentTarget.style.background = "rgba(96,165,250,0.08)"; }} onMouseLeave={e => { e.currentTarget.style.color = "rgba(96,165,250,0.7)"; e.currentTarget.style.background = "transparent"; }}><Edit2 size={14} /></button>
                      <div className="relative">
                        <button onClick={() => setDeleteConfirmId(deleteConfirmId === cinema.id ? null : cinema.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: deleteConfirmId === cinema.id ? "#ef4444" : "rgba(239,68,68,0.6)", background: deleteConfirmId === cinema.id ? "rgba(239,68,68,0.12)" : "transparent" }} onMouseEnter={e => { if (deleteConfirmId !== cinema.id) { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; } }} onMouseLeave={e => { if (deleteConfirmId !== cinema.id) { e.currentTarget.style.color = "rgba(239,68,68,0.6)"; e.currentTarget.style.background = "transparent"; } }}><Trash2 size={14} /></button>
                        
                        {deleteConfirmId === cinema.id && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 p-2 rounded-xl border flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200" style={{ background: "#1a1a1a", borderColor: "rgba(239,68,68,0.3)", backdropFilter: "blur(20px)", minWidth: "140px" }}>
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider ml-1">Delete?</span>
                            <div className="flex gap-1 ml-auto">
                              <button onClick={() => handleDelete(cinema.id)} className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all bg-[#ef4444] text-white hover:bg-[#dc2626]">Yes</button>
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
      <Pagination />

      {/* Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }} onClick={e => { if (e.target === e.currentTarget) closeDialog(); }}>
          <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.09)" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <h2 className="text-sm font-bold text-white">{editingCinema ? "Edit Cinema" : "Add Cinema"}</h2>
              <button onClick={closeDialog} className="p-1.5 rounded-lg transition-colors" style={{ color: "rgba(255,255,255,0.4)" }} onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Cinema Name</Label><input name="name" required defaultValue={editingCinema?.name} placeholder="Luxe Cinema Q1" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} /></div>
                <div><Label>Image URL</Label><input name="imageUrl" required defaultValue={editingCinema?.imageUrl} placeholder="https://..." className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} /></div>
              </div>
              <div><Label>Address</Label><input name="address" required defaultValue={editingCinema?.address} placeholder="123 Street, District 1" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} /></div>
              <div><Label>Description</Label><textarea name="description" required defaultValue={editingCinema?.description} rows={3} placeholder="Brief info..." className="w-full px-3 py-2.5 text-sm text-white/85 outline-none rounded-xl resize-none transition-all placeholder:text-white/20" style={inputStyle} onFocus={onFocus as any} onBlur={onBlur as any} /></div>
              {error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-3 text-xs text-red-400/80">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  {error}
                </div>
              )}
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={closeDialog} className="px-4 h-9 rounded-xl text-xs font-medium transition-colors" style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.09)" }}>Cancel</button>
                <button type="submit" disabled={isSaving} className="px-5 h-9 rounded-xl text-xs font-bold text-black transition-all hover:opacity-90 disabled:opacity-40" style={{ background: "linear-gradient(135deg, #c9a84c, #e8c76a)" }}>{isSaving ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
