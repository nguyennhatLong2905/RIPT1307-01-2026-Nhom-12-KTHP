"use client";

import React, { useState, useEffect } from "react";
import { Search, Trash2, Mail, Phone, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { adminService } from "../services/admin-service";
import { User, UserRole } from "@/types";

const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
};
const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
};
const onFocus = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)");
const onBlur = (e: React.FocusEvent<HTMLInputElement>) =>
  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)");

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const itemsPerPage = 10;

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      setUsers(await adminService.getUsers());
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try { await adminService.deleteUser(id); fetchUsers(); setDeleteConfirmId(null); }
    catch { alert("Error deleting user."); }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Users</h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
          Manage customer and admin accounts
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        {/* Search */}
        <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.25)" }} />
            <input
              type="text"
              placeholder="Search by name, email, username..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full h-10 pl-8 pr-4 text-sm text-white/85 outline-none rounded-xl transition-all placeholder:text-white/20"
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            {filteredUsers.length} users
          </span>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["User", "Contact", "Role", "Actions"].map((h) => (
                  <th
                    key={h}
                    className={`py-3 text-xs font-bold uppercase tracking-[0.15em] ${
                      h === "Actions" ? "px-8 text-center" : 
                      h === "Role" ? "pl-14 pr-8 text-left" :
                      h === "User" || h === "Contact" ? "pl-24 pr-8 text-left" : "px-8 text-left"
                    }`}
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {h}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Loading...</td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>No users found</td>
              </tr>
            ) : paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className="transition-colors"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                 <td className="px-8 py-3 text-left">
                  <div className="flex items-center justify-start gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: "rgba(201,168,76,0.12)", color: "#c9a84c" }}
                    >
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="text-white/85 font-medium text-sm">{user.fullName}</div>
                      <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>@{user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-3 text-left">
                  <div className="space-y-1">
                    <div className="flex items-center justify-start gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                      <Mail size={11} style={{ color: "rgba(255,255,255,0.2)" }} />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center justify-start gap-1.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <Phone size={11} style={{ color: "rgba(255,255,255,0.2)" }} />
                        {user.phone}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-8 py-3 text-left">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                    style={
                      user.role === UserRole.ADMIN
                        ? { background: "rgba(201,168,76,0.12)", color: "#c9a84c", border: "1px solid rgba(201,168,76,0.2)" }
                        : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.08)" }
                    }
                  >
                    {user.role === UserRole.ADMIN && <ShieldCheck size={10} />}
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {user.role !== UserRole.ADMIN && (
                    <div className="relative inline-block">
                      <button
                        onClick={() => setDeleteConfirmId(deleteConfirmId === user.id ? null : user.id)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: deleteConfirmId === user.id ? "#ef4444" : "rgba(239,68,68,0.6)", background: deleteConfirmId === user.id ? "rgba(239,68,68,0.12)" : "transparent" }}
                        onMouseEnter={e => { if (deleteConfirmId !== user.id) { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; } }}
                        onMouseLeave={e => { if (deleteConfirmId !== user.id) { e.currentTarget.style.color = "rgba(239,68,68,0.6)"; e.currentTarget.style.background = "transparent"; } }}
                      >
                        <Trash2 size={14} />
                      </button>

                      {deleteConfirmId === user.id && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 p-2 rounded-xl border flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200" style={{ background: "#1a1a1a", borderColor: "rgba(239,68,68,0.3)", backdropFilter: "blur(20px)", minWidth: "140px" }}>
                          <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider ml-1">Delete?</span>
                          <div className="flex gap-1 ml-auto">
                            <button onClick={() => handleDelete(user.id)} className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all bg-[#ef4444] text-white hover:bg-[#dc2626]">Yes</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60">No</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="w-7 h-7 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: currentPage === page ? "#c9a84c" : "transparent",
                  color: currentPage === page ? "#000" : "rgba(255,255,255,0.45)",
                }}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
