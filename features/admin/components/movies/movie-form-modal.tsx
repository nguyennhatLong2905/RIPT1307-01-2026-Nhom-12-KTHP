"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Movie, AgeRating, MovieStatus, ratingConfig } from "./movie-data";

interface MovieFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (movie: Omit<Movie, "id"> & { id?: number }) => void;
    movie?: Movie | null; // null = add mode, Movie = edit mode
}

const allRatings: AgeRating[] = ["P", "T13", "T16", "T18"];
const allStatuses: MovieStatus[] = ["Đang chiếu", "Sắp chiếu", "Ngừng chiếu"];

const emptyForm = {
    title: "",
    genres: "",
    ageRating: "P" as AgeRating,
    director: "",
    actors: "",
    status: "Sắp chiếu" as MovieStatus,
    poster: "/images/mai.jpg",
    summary: "",
    trailerUrl: "",
    isPublic: true,
    duration: 120,
    releaseDate: "",
};

export default function MovieFormModal({ isOpen, onClose, onSave, movie }: MovieFormModalProps) {
    const [form, setForm] = useState(emptyForm);
    const isEdit = !!movie;

    useEffect(() => {
        if (movie) {
            setForm({
                title: movie.title,
                genres: movie.genres.join(", "),
                ageRating: movie.ageRating,
                director: movie.director,
                actors: movie.actors,
                status: movie.status,
                poster: movie.poster,
                summary: movie.summary,
                trailerUrl: movie.trailerUrl,
                isPublic: movie.isPublic,
                duration: movie.duration,
                releaseDate: movie.releaseDate,
            });
        } else {
            setForm(emptyForm);
        }
    }, [movie]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!form.title.trim() || !form.director.trim()) return;
        onSave({
            ...(movie ? { id: movie.id } : {}),
            title: form.title,
            genres: form.genres.split(",").map((g) => g.trim()).filter(Boolean),
            ageRating: form.ageRating,
            director: form.director,
            actors: form.actors,
            status: form.status,
            poster: form.poster,
            summary: form.summary,
            trailerUrl: form.trailerUrl,
            isPublic: form.isPublic,
            duration: form.duration,
            releaseDate: form.releaseDate,
        });
    };

    const inputStyle = {
        background: "#0D1117",
        border: "1px solid #1F2532",
        color: "#FFFFFF",
    };

    return (
        <>
            <div
                className="fixed inset-0 z-40"
                style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
                onClick={onClose}
            />
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div
                    className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
                    style={{
                        background: "#0D1117",
                        border: "1px solid #1F2532",
                        boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
                        animation: "scaleIn 0.25s ease-out",
                    }}
                >
                    <style>{`@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>

                    {/* Header */}
                    <div
                        className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
                        style={{ background: "rgba(13,17,23,0.95)", borderBottom: "1px solid #1F2532", backdropFilter: "blur(8px)" }}
                    >
                        <h2 className="text-lg font-bold" style={{ color: "#FFFFFF" }}>
                            {isEdit ? "Chỉnh sửa Phim" : "Thêm Phim Mới"}
                        </h2>
                        <button onClick={onClose} className="rounded-lg p-2 transition-colors" style={{ color: "#8B949E" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,58,237,0.15)"; e.currentTarget.style.color = "#FFF"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#8B949E"; }}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-5 p-6">
                        {/* Row 1: Title + Director */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Tên phim *" value={form.title} onChange={(v) => setForm({ ...form, title: v })} style={inputStyle} />
                            <FormField label="Đạo diễn *" value={form.director} onChange={(v) => setForm({ ...form, director: v })} style={inputStyle} />
                        </div>

                        {/* Row 2: Genres + Actors */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Thể loại (cách nhau bằng dấu phẩy)" value={form.genres} onChange={(v) => setForm({ ...form, genres: v })} style={inputStyle} />
                            <FormField label="Diễn viên chính" value={form.actors} onChange={(v) => setForm({ ...form, actors: v })} style={inputStyle} />
                        </div>

                        {/* Row 3: Duration + Release Date + Poster URL */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8B949E" }}>Thời lượng (phút)</label>
                                <input
                                    type="number"
                                    value={form.duration}
                                    onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
                                    style={inputStyle}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)"; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = "#1F2532"; }}
                                />
                            </div>
                            <FormField label="Ngày khởi chiếu" value={form.releaseDate} onChange={(v) => setForm({ ...form, releaseDate: v })} placeholder="YYYY-MM-DD" style={inputStyle} />
                            <FormField label="Poster URL" value={form.poster} onChange={(v) => setForm({ ...form, poster: v })} style={inputStyle} />
                        </div>

                        {/* Trailer */}
                        <FormField label="Trailer URL" value={form.trailerUrl} onChange={(v) => setForm({ ...form, trailerUrl: v })} style={inputStyle} />

                        {/* Summary */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8B949E" }}>Tóm tắt nội dung</label>
                            <textarea
                                value={form.summary}
                                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                                rows={3}
                                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all resize-none"
                                style={inputStyle}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "#1F2532"; }}
                            />
                        </div>

                        {/* Age Rating */}
                        <div>
                            <label className="mb-2 block text-xs font-semibold" style={{ color: "#8B949E" }}>Phân loại độ tuổi</label>
                            <div className="flex gap-2">
                                {allRatings.map((r) => {
                                    const rc = ratingConfig[r];
                                    const sel = form.ageRating === r;
                                    return (
                                        <button key={r} type="button" onClick={() => setForm({ ...form, ageRating: r })}
                                            className="rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200"
                                            style={{
                                                background: sel ? rc.bg : "rgba(255,255,255,0.03)",
                                                color: sel ? rc.color : "#8B949E",
                                                border: `1px solid ${sel ? rc.color + "60" : "#1F2532"}`,
                                                boxShadow: sel ? `0 0 12px ${rc.bg}` : "none",
                                            }}
                                        >{r}</button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="mb-2 block text-xs font-semibold" style={{ color: "#8B949E" }}>Trạng thái chiếu</label>
                            <div className="flex gap-2">
                                {allStatuses.map((s) => {
                                    const sel = form.status === s;
                                    const colors: Record<MovieStatus, string> = { "Đang chiếu": "#2DD4BF", "Sắp chiếu": "#60A5FA", "Ngừng chiếu": "#8B949E" };
                                    const c = colors[s];
                                    return (
                                        <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                                            className="rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200"
                                            style={{
                                                background: sel ? c + "20" : "rgba(255,255,255,0.03)",
                                                color: sel ? c : "#8B949E",
                                                border: `1px solid ${sel ? c + "50" : "#1F2532"}`,
                                            }}
                                        >{s}</button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Public toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold" style={{ color: "#8B949E" }}>Công khai</span>
                            <div
                                onClick={() => setForm({ ...form, isPublic: !form.isPublic })}
                                className="relative h-6 w-11 rounded-full cursor-pointer transition-colors duration-300"
                                style={{ background: form.isPublic ? "linear-gradient(90deg, #7C3AED, #2DD4BF)" : "#1F2532" }}
                            >
                                <div className="absolute top-0.5 h-5 w-5 rounded-full transition-transform duration-300"
                                    style={{ background: "#FFF", boxShadow: "0 2px 6px rgba(0,0,0,0.3)", transform: form.isPublic ? "translateX(22px)" : "translateX(2px)" }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid #1F2532" }}>
                        <button onClick={onClose}
                            className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200"
                            style={{ color: "#8B949E", border: "1px solid #1F2532" }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#8B949E"; e.currentTarget.style.color = "#FFF"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1F2532"; e.currentTarget.style.color = "#8B949E"; }}
                        >
                            Hủy
                        </button>
                        <button onClick={handleSubmit}
                            className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300"
                            style={{
                                background: "linear-gradient(90deg, #7C3AED, #2DD4BF)",
                                color: "#FFFFFF",
                                boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
                                opacity: (!form.title.trim() || !form.director.trim()) ? 0.5 : 1,
                                cursor: (!form.title.trim() || !form.director.trim()) ? "not-allowed" : "pointer",
                            }}
                            onMouseEnter={(e) => { if (form.title.trim() && form.director.trim()) e.currentTarget.style.boxShadow = "0 4px 30px rgba(124,58,237,0.5)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(124,58,237,0.3)"; }}
                        >
                            {isEdit ? "Lưu thay đổi" : "Thêm phim"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

function FormField({ label, value, onChange, placeholder, style }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string;
    style: React.CSSProperties;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "#8B949E" }}>{label}</label>
            <input
                type="text" value={value} onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || ""}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-all"
                style={style}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#1F2532"; }}
            />
        </div>
    );
}
