"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Film,
  Upload,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
} from "lucide-react";
import { adminService } from "../services/admin-service";
import { Movie } from "@/types";

/* ── Shared UI primitives ── */
const cardStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.07)",
};

const inputCls =
  "w-full h-10 px-3 text-sm text-white/85 outline-none rounded-xl transition-all placeholder:text-white/20";
const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
};
const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  (e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)");
const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)");

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-[10px] font-semibold uppercase tracking-[0.18em] mb-1.5"
      style={{ color: "rgba(201,168,76,0.65)" }}
    >
      {children}
    </label>
  );
}

export default function MovieManagement() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Partial<Movie> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const itemsPerPage = 10;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchMovies(); }, []);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getMovies();
      setMovies(data);
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try { await adminService.deleteMovie(id); fetchMovies(); setDeleteConfirmId(null); }
    catch { setError("Error deleting movie."); }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let trailerUrl = formData.get("trailerUrl") as string;

    if (!selectedFile && !trailerUrl) {
      setError("Vui lòng chọn video trailer cho phim!");
      return;
    }

    if (selectedFile) {
      setError("");
      setIsUploading(true);
      try {
        trailerUrl = await adminService.uploadTrailer(selectedFile);
      } catch {
        setError("Error uploading trailer.");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const movieData: any = {
      title: formData.get("title"),
      director: formData.get("director"),
      genre: formData.get("genre"),
      duration: parseInt(formData.get("duration") as string),
      description: formData.get("description"),
      posterUrl: formData.get("posterUrl"),
      trailerUrl,
      releaseDate: formData.get("releaseDate"),
    };

    setIsSaving(true);
    try {
      if (editingMovie?.id) {
        await adminService.updateMovie(editingMovie.id, movieData);
      } else {
        await adminService.addMovie(movieData);
      }
      closeDialog();
      fetchMovies();
    } catch (err: any) {
      const msg = err.response?.data || err.message || "Unknown error";
      setError(typeof msg === "object" ? JSON.stringify(msg) : msg);
    } finally {
      setIsSaving(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingMovie(null);
    setSelectedFile(null);
    setError("");
  };

  const filteredMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.genre.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / itemsPerPage));
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Movies</h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            Manage movie catalog
          </p>
        </div>
        <button
          onClick={() => { setEditingMovie(null); setIsDialogOpen(true); }}
          className="flex items-center gap-2 px-4 h-9 rounded-xl text-xs font-bold text-black transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #c9a84c, #e8c76a)" }}
        >
          <Plus size={15} />
          Add Movie
        </button>
      </div>

      {/* Table card */}
      <div className="rounded-2xl overflow-hidden" style={cardStyle}>
        {/* Search bar */}
        <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(255,255,255,0.25)" }} />
            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className={`${inputCls} pl-8`}
              style={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </div>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            {filteredMovies.length} movies
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Poster", "Title", "Genre", "Duration", "Release Date", "Actions"].map((h) => (
                  <th
                    key={h}
                    className={`py-3 text-xs font-bold uppercase tracking-[0.15em] ${
                      h === "Actions" ? "px-8 text-center" : 
                      h === "Title" || h === "Genre" ? "pl-24 pr-8 text-left" : "px-8 text-left"
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
                  <td colSpan={6} className="py-12 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Loading...
                  </td>
                </tr>
              ) : paginatedMovies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                    No movies found
                  </td>
                </tr>
              ) : paginatedMovies.map((movie) => (
                <tr
                  key={movie.id}
                  className="transition-colors"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-8 py-3 text-left">
                    <div className="w-9 h-13 rounded-lg overflow-hidden bg-white/5 border border-white/8 flex items-center justify-center" style={{ height: "52px", width: "36px" }}>
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x600/0d0d0d/c9a84c?text=?"; }}
                        />
                      ) : (
                        <Film size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-3 font-medium text-white/85 text-sm text-left">{movie.title}</td>
                  <td className="px-8 py-3 text-white/45 text-sm text-left">{movie.genre}</td>
                  <td className="px-8 py-3 text-white/45 text-sm text-left">{movie.duration} min</td>
                  <td className="px-8 py-3 text-white/45 text-sm text-left">{movie.releaseDate}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => { setEditingMovie(movie); setIsDialogOpen(true); }}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: "rgba(96,165,250,0.7)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#60a5fa";
                          e.currentTarget.style.background = "rgba(96,165,250,0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(96,165,250,0.7)";
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setDeleteConfirmId(deleteConfirmId === movie.id ? null : movie.id)}
                          className="p-1.5 rounded-lg transition-colors"
                          style={{ color: deleteConfirmId === movie.id ? "#ef4444" : "rgba(239,68,68,0.6)", background: deleteConfirmId === movie.id ? "rgba(239,68,68,0.12)" : "transparent" }}
                          onMouseEnter={e => { if (deleteConfirmId !== movie.id) { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; } }}
                          onMouseLeave={e => { if (deleteConfirmId !== movie.id) { e.currentTarget.style.color = "rgba(239,68,68,0.6)"; e.currentTarget.style.background = "transparent"; } }}
                        >
                          <Trash2 size={14} />
                        </button>

                        {deleteConfirmId === movie.id && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 p-2 rounded-xl border flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200" style={{ background: "#1a1a1a", borderColor: "rgba(239,68,68,0.3)", backdropFilter: "blur(20px)", minWidth: "140px" }}>
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider ml-1">Delete?</span>
                            <div className="flex gap-1 ml-auto">
                              <button onClick={() => handleDelete(movie.id)} className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all bg-[#ef4444] text-white hover:bg-[#dc2626]">Yes</button>
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
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
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Dialog / Modal */}
      {isDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeDialog(); }}
        >
          <div
            className="w-full max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
            style={{ background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.09)" }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <h2 className="text-sm font-bold text-white">
                {editingMovie ? "Edit Movie" : "Add New Movie"}
              </h2>
              <button
                onClick={closeDialog}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Movie Title", name: "title", defaultValue: editingMovie?.title },
                  { label: "Director", name: "director", defaultValue: editingMovie?.director },
                  { label: "Genre", name: "genre", defaultValue: editingMovie?.genre, placeholder: "Action, Sci-fi..." },
                  { label: "Duration (min)", name: "duration", type: "number", defaultValue: editingMovie?.duration },
                  { label: "Release Date", name: "releaseDate", type: "date", defaultValue: editingMovie?.releaseDate },
                  { label: "Poster URL", name: "posterUrl", defaultValue: editingMovie?.posterUrl },
                ].map((field) => (
                  <div key={field.name}>
                    <FieldLabel>{field.label}</FieldLabel>
                    <input
                      name={field.name}
                      type={field.type || "text"}
                      defaultValue={field.defaultValue as string}
                      required
                      placeholder={field.placeholder}
                      className={inputCls}
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                ))}
              </div>

              {/* Trailer upload */}
              <div>
                <FieldLabel>Video Trailer (local file)</FieldLabel>
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept="video/*"
                    ref={fileInputRef}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 h-10 rounded-xl text-xs font-medium transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    <Upload size={13} />
                    {selectedFile ? selectedFile.name : "Choose file"}
                  </button>
                  {selectedFile && (
                    <button type="button" onClick={() => setSelectedFile(null)} className="text-red-400/60 hover:text-red-400">
                      <X size={14} />
                    </button>
                  )}
                </div>
                {editingMovie?.trailerUrl && !selectedFile && (
                  <p className="text-[10px] mt-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Current: {editingMovie.trailerUrl}
                  </p>
                )}
                <input type="hidden" name="trailerUrl" defaultValue={editingMovie?.trailerUrl} />
              </div>

              {/* Description */}
              <div>
                <FieldLabel>Description</FieldLabel>
                <textarea
                  name="description"
                  required
                  defaultValue={editingMovie?.description}
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm text-white/85 outline-none rounded-xl resize-none transition-all placeholder:text-white/20"
                  style={inputStyle}
                  onFocus={onFocus as any}
                  onBlur={onBlur as any}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2.5 rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-3 text-xs text-red-400/80">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Modal footer */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-4 h-9 rounded-xl text-xs font-medium transition-colors"
                  style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.09)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || isSaving}
                  className="flex items-center gap-2 px-5 h-9 rounded-xl text-xs font-bold text-black transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #c9a84c, #e8c76a)" }}
                >
                  {(isUploading || isSaving) && <Loader2 size={13} className="animate-spin" />}
                  {isUploading ? "Uploading..." : isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
