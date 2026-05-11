"use client";

import { X, Play, ExternalLink } from "lucide-react";
import { Movie, statusConfig, ratingConfig, AgeRating } from "./movie-data";
import Image from "next/image";

interface MovieDetailPanelProps {
    movie: Movie | null;
    onClose: () => void;
    onEdit?: (movie: Movie) => void;
}

const allRatings: AgeRating[] = ["P", "T13", "T16", "T18"];

export default function MovieDetailPanel({ movie, onClose, onEdit }: MovieDetailPanelProps) {
    if (!movie) return null;

    const stCfg = statusConfig[movie.status];

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className="fixed inset-0 z-40"
                style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                onClick={onClose}
            />

            {/* Side Panel */}
            <div
                className="fixed top-0 right-0 z-50 h-full w-full max-w-lg overflow-y-auto"
                style={{
                    background: "#0D1117",
                    borderLeft: "1px solid #1F2532",
                    boxShadow: "-8px 0 40px rgba(0,0,0,0.6)",
                    animation: "slideInRight 0.3s ease-out",
                }}
            >
                <style>{`
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `}</style>

                {/* Header */}
                <div
                    className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
                    style={{
                        background: "rgba(13,17,23,0.95)",
                        borderBottom: "1px solid #1F2532",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <h2 className="text-lg font-bold" style={{ color: "#FFFFFF" }}>
                        Thông tin Phim
                    </h2>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 transition-colors duration-200"
                        style={{ color: "#8B949E" }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(124,58,237,0.15)";
                            e.currentTarget.style.color = "#FFFFFF";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#8B949E";
                        }}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-5 p-6">
                    {/* Card 1: Info */}
                    <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
                        <div className="flex gap-4">
                            <div className="relative h-44 w-28 shrink-0 overflow-hidden rounded-xl" style={{ border: "1px solid #1F2532" }}>
                                <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-bold mb-1 truncate" style={{ color: "#FFFFFF" }}>
                                    {movie.title}
                                </h3>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {movie.genres.map((g) => (
                                        <span
                                            key={g}
                                            className="rounded-md px-2 py-0.5 text-xs"
                                            style={{ background: "rgba(124,58,237,0.15)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.3)" }}
                                        >
                                            {g}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs mb-1" style={{ color: "#8B949E" }}>
                                    <span style={{ color: "#C9D1D9" }}>Đạo diễn:</span> {movie.director}
                                </p>
                                <div className="mb-1">
                                    <p className="text-xs mb-1" style={{ color: "#C9D1D9" }}>Diễn viên chính:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {movie.actors.split(",").map((actor) => (
                                            <span
                                                key={actor.trim()}
                                                className="rounded-md px-2 py-0.5 text-xs"
                                                style={{
                                                    background: "rgba(251,191,36,0.12)",
                                                    color: "#FBBF24",
                                                    border: "1px solid rgba(251,191,36,0.3)",
                                                }}
                                            >
                                                {actor.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs mb-1" style={{ color: "#8B949E" }}>
                                    <span style={{ color: "#C9D1D9" }}>Thời lượng:</span> {movie.duration} phút
                                </p>
                                <p className="text-xs" style={{ color: "#8B949E" }}>
                                    <span style={{ color: "#C9D1D9" }}>Khởi chiếu:</span> {movie.releaseDate}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs font-semibold mb-2" style={{ color: "#C9D1D9" }}>Tóm tắt</p>
                            <div
                                className="rounded-xl p-3 text-xs leading-relaxed"
                                style={{ background: "#0D1117", border: "1px solid #1F2532", color: "#8B949E" }}
                            >
                                {movie.summary}
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Media & Rating */}
                    <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
                        <p className="text-xs font-semibold mb-3" style={{ color: "#C9D1D9" }}>Trailer URL</p>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                defaultValue={movie.trailerUrl}
                                className="flex-1 rounded-lg px-3 py-2 text-xs outline-none transition-all"
                                style={{ background: "#0D1117", border: "1px solid #1F2532", color: "#FFFFFF" }}
                                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.6)"; }}
                                onBlur={(e) => { e.currentTarget.style.borderColor = "#1F2532"; }}
                            />
                            <button
                                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200"
                                style={{ background: "rgba(45,212,191,0.15)", color: "#2DD4BF", border: "1px solid rgba(45,212,191,0.3)" }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(45,212,191,0.25)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(45,212,191,0.15)"; }}
                            >
                                <Play className="h-3 w-3" /> Xem thử
                            </button>
                        </div>

                        <p className="text-xs font-semibold mb-3" style={{ color: "#C9D1D9" }}>Phân loại độ tuổi</p>
                        <div className="flex gap-2">
                            {allRatings.map((r) => {
                                const rc = ratingConfig[r];
                                const isSelected = movie.ageRating === r;
                                return (
                                    <button
                                        key={r}
                                        className="rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200"
                                        style={{
                                            background: isSelected ? rc.bg : "rgba(255,255,255,0.03)",
                                            color: isSelected ? rc.color : "#8B949E",
                                            border: `1px solid ${isSelected ? rc.color + "60" : "#1F2532"}`,
                                            boxShadow: isSelected ? `0 0 12px ${rc.bg}` : "none",
                                        }}
                                    >
                                        {r}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Card 3: Publish Status */}
                    <div className="rounded-2xl p-5" style={{ background: "#161B22", border: "1px solid #1F2532" }}>
                        <p className="text-sm font-semibold mb-4" style={{ color: "#C9D1D9" }}>
                            Cài đặt hiển thị & Trạng thái chiếu
                        </p>

                        {/* Toggle */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs" style={{ color: "#8B949E" }}>Công khai</span>
                            <div
                                className="relative h-6 w-11 rounded-full cursor-pointer transition-colors duration-300"
                                style={{
                                    background: movie.isPublic
                                        ? "linear-gradient(90deg, #7C3AED, #2DD4BF)"
                                        : "#1F2532",
                                }}
                            >
                                <div
                                    className="absolute top-0.5 h-5 w-5 rounded-full transition-transform duration-300"
                                    style={{
                                        background: "#FFFFFF",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                                        transform: movie.isPublic ? "translateX(22px)" : "translateX(2px)",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Status badge */}
                        <div className="flex items-center justify-between mb-5">
                            <span className="text-xs" style={{ color: "#8B949E" }}>Trạng thái</span>
                            <span
                                className="rounded-full px-3 py-1 text-xs font-semibold"
                                style={{ background: stCfg.bg, color: stCfg.color, border: `1px solid ${stCfg.color}40` }}
                            >
                                {movie.status}
                            </span>
                        </div>

                        {/* Edit button */}
                        <button
                            onClick={() => onEdit?.(movie)}
                            className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-300"
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
                            Chỉnh sửa
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
