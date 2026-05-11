"use client";

import { useState, useMemo } from "react";
import { Search, Eye, Pencil, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import { moviesData, statusConfig, ratingConfig, Movie, MovieStatus } from "./movie-data";
import MovieDetailPanel from "./movie-detail-panel";
import MovieFormModal from "./movie-form-modal";
import DeleteConfirmModal from "./delete-confirm-modal";

type FilterTab = "all" | MovieStatus;

const filterTabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "Tất cả Phim" },
    { key: "Đang chiếu", label: "Đang chiếu" },
    { key: "Sắp chiếu", label: "Sắp chiếu" },
    { key: "Ngừng chiếu", label: "Ngừng chiếu" },
];

export default function MovieTable() {
    const [movies, setMovies] = useState<Movie[]>(moviesData);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<FilterTab>("all");
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    // Form modal state
    const [formOpen, setFormOpen] = useState(false);
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

    // Delete modal state
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);

    const counts = useMemo(() => {
        const all = movies.length;
        const dc = movies.filter((m) => m.status === "Đang chiếu").length;
        const sc = movies.filter((m) => m.status === "Sắp chiếu").length;
        const nc = movies.filter((m) => m.status === "Ngừng chiếu").length;
        return { all, "Đang chiếu": dc, "Sắp chiếu": sc, "Ngừng chiếu": nc } as Record<string, number>;
    }, [movies]);

    const filtered = useMemo(() => {
        let result = movies;
        if (activeFilter !== "all") result = result.filter((m) => m.status === activeFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (m) => m.title.toLowerCase().includes(q) || m.director.toLowerCase().includes(q)
            );
        }
        return result;
    }, [movies, search, activeFilter]);

    // ========== Handlers ==========

    const handleOpenAdd = () => {
        setEditingMovie(null);
        setFormOpen(true);
    };

    const handleOpenEdit = (movie: Movie) => {
        setEditingMovie(movie);
        setFormOpen(true);
    };

    const handleSave = (data: Omit<Movie, "id"> & { id?: number }) => {
        if (data.id) {
            // Edit
            setMovies((prev) => prev.map((m) => (m.id === data.id ? { ...m, ...data, id: m.id } : m)));
            // Update selected movie if it's the one being edited
            if (selectedMovie?.id === data.id) {
                setSelectedMovie((prev) => prev ? { ...prev, ...data, id: prev.id } : null);
            }
        } else {
            // Add
            const newId = Math.max(...movies.map((m) => m.id), 0) + 1;
            setMovies((prev) => [{ ...data, id: newId } as Movie, ...prev]);
        }
        setFormOpen(false);
        setEditingMovie(null);
    };

    const handleOpenDelete = (movie: Movie) => {
        setDeletingMovie(movie);
        setDeleteOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingMovie) {
            setMovies((prev) => prev.filter((m) => m.id !== deletingMovie.id));
            if (selectedMovie?.id === deletingMovie.id) setSelectedMovie(null);
        }
        setDeleteOpen(false);
        setDeletingMovie(null);
    };

    return (
        <>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#FFFFFF" }}>
                            Quản lý Phim
                        </h1>
                        <p className="text-sm mt-1" style={{ color: "#8B949E" }}>
                            Quản lý danh sách phim, lịch chiếu và thông tin chi tiết.
                        </p>
                    </div>
                    <button
                        onClick={handleOpenAdd}
                        className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300"
                        style={{
                            background: "linear-gradient(90deg, #7C3AED, #2DD4BF)",
                            color: "#FFFFFF",
                            boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = "0 4px 30px rgba(124,58,237,0.5)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.3)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        <Plus className="h-4 w-4" /> Thêm Phim
                    </button>
                </div>

                {/* Search + Filter bar */}
                <div className="rounded-2xl p-4" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="relative w-full max-w-md">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                <Search className="h-4 w-4" style={{ color: "#8B949E" }} />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Tìm kiếm phim (Tên, Đạo diễn)..."
                                className="w-full rounded-xl py-2.5 pl-11 pr-4 text-sm outline-none transition-all"
                                style={{ background: "#0D1117", border: "1px solid #1F2532", color: "#FFFFFF" }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)";
                                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.15)";
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor = "#1F2532";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            />
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {filterTabs.map((tab) => {
                                const isActive = activeFilter === tab.key;
                                const count = tab.key === "all" ? counts.all : counts[tab.key];
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveFilter(tab.key)}
                                        className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200"
                                        style={{
                                            background: isActive ? "rgba(124,58,237,0.2)" : "transparent",
                                            color: isActive ? "#A78BFA" : "#8B949E",
                                            border: `1px solid ${isActive ? "rgba(124,58,237,0.4)" : "transparent"}`,
                                        }}
                                        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "#FFFFFF"; }}
                                        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "#8B949E"; }}
                                    >
                                        {tab.label} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr style={{ borderBottom: "1px solid #1F2532" }}>
                                    {["Poster", "Tên Phim / Thể loại / Nhãn", "Đạo diễn", "Diễn viên chính", "Trạng thái", "Hành động"].map(
                                        (h) => (
                                            <th key={h} className="px-5 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "#8B949E" }}>
                                                {h}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-16 text-center text-sm" style={{ color: "#8B949E" }}>
                                            Không tìm thấy phim nào.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((movie) => {
                                        const stCfg = statusConfig[movie.status];
                                        const rtCfg = ratingConfig[movie.ageRating];
                                        return (
                                            <tr
                                                key={movie.id}
                                                className="transition-colors duration-150 cursor-pointer"
                                                style={{ borderBottom: "1px solid #1F2532" }}
                                                onClick={() => setSelectedMovie(movie)}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.05)"; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                                            >
                                                <td className="px-5 py-3">
                                                    <div className="relative h-20 w-14 overflow-hidden rounded-lg" style={{ border: "1px solid #1F2532" }}>
                                                        <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 max-w-xs">
                                                    <p className="font-semibold truncate mb-1" style={{ color: "#FFFFFF" }}>{movie.title}</p>
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        {movie.genres.map((g) => (
                                                            <span key={g} className="text-xs" style={{ color: "#8B949E" }}>{g}</span>
                                                        ))}
                                                        <span className="text-xs" style={{ color: "#1F2532" }}>|</span>
                                                        <span className="rounded px-1.5 py-0.5 text-xs font-bold" style={{ background: rtCfg.bg, color: rtCfg.color }}>
                                                            {movie.ageRating}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 whitespace-nowrap" style={{ color: "#C9D1D9" }}>{movie.director}</td>
                                                <td className="px-5 py-3 max-w-[200px]">
                                                    <p className="truncate text-xs" style={{ color: "#8B949E" }}>{movie.actors}</p>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                                                        style={{ background: stCfg.bg, color: stCfg.color, border: `1px solid ${stCfg.color}30` }}>
                                                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: stCfg.color, boxShadow: `0 0 6px ${stCfg.glow}` }} />
                                                        {movie.status}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                        <ActionBtn icon={Eye} tip="Xem" color="#2DD4BF" onClick={() => setSelectedMovie(movie)} />
                                                        <ActionBtn icon={Pencil} tip="Sửa" color="#60A5FA" onClick={() => handleOpenEdit(movie)} />
                                                        <ActionBtn icon={Trash2} tip="Xóa" color="#F43F5E" onClick={() => handleOpenDelete(movie)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* View detail panel */}
            {selectedMovie && (
                <MovieDetailPanel
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                    onEdit={(movie) => { setSelectedMovie(null); handleOpenEdit(movie); }}
                />
            )}

            {/* Add/Edit form modal */}
            <MovieFormModal
                isOpen={formOpen}
                onClose={() => { setFormOpen(false); setEditingMovie(null); }}
                onSave={handleSave}
                movie={editingMovie}
            />

            {/* Delete confirmation modal */}
            <DeleteConfirmModal
                isOpen={deleteOpen}
                movie={deletingMovie}
                onClose={() => { setDeleteOpen(false); setDeletingMovie(null); }}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}

function ActionBtn({ icon: Icon, tip, color, onClick }: {
    icon: React.ComponentType<{ className?: string }>; tip: string; color: string; onClick: () => void;
}) {
    return (
        <button title={tip} onClick={onClick}
            className="rounded-lg p-2 transition-all duration-200" style={{ color: "#8B949E" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = color; e.currentTarget.style.background = color + "15"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#8B949E"; e.currentTarget.style.background = "transparent"; }}
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}
