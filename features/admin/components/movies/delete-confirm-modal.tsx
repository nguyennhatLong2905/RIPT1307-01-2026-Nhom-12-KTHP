"use client";

import { AlertTriangle, X } from "lucide-react";
import { Movie } from "./movie-data";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    movie: Movie | null;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteConfirmModal({ isOpen, movie, onClose, onConfirm }: DeleteConfirmModalProps) {
    if (!isOpen || !movie) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-50"
                style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
                onClick={onClose}
            />
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div
                    className="w-full max-w-md rounded-2xl"
                    style={{
                        background: "#0D1117",
                        border: "1px solid #1F2532",
                        boxShadow: "0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(244,63,94,0.1)",
                        animation: "scaleIn 0.25s ease-out",
                    }}
                >
                    <style>{`@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>

                    <div className="p-6 text-center">
                        <div
                            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                            style={{ background: "rgba(244,63,94,0.15)", border: "1px solid rgba(244,63,94,0.3)" }}
                        >
                            <AlertTriangle className="h-7 w-7" style={{ color: "#F43F5E" }} />
                        </div>

                        <h3 className="text-lg font-bold mb-2" style={{ color: "#FFFFFF" }}>
                            Xác nhận xóa phim
                        </h3>
                        <p className="text-sm mb-1" style={{ color: "#8B949E" }}>
                            Bạn có chắc chắn muốn xóa phim:
                        </p>
                        <p className="text-sm font-semibold mb-4" style={{ color: "#F43F5E" }}>
                            &ldquo;{movie.title}&rdquo;
                        </p>
                        <p className="text-xs mb-6" style={{ color: "#8B949E" }}>
                            Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
                        </p>

                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={onClose}
                                className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200"
                                style={{ color: "#8B949E", border: "1px solid #1F2532" }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#8B949E"; e.currentTarget.style.color = "#FFF"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1F2532"; e.currentTarget.style.color = "#8B949E"; }}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={onConfirm}
                                className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300"
                                style={{
                                    background: "linear-gradient(90deg, #F43F5E, #E11D48)",
                                    color: "#FFFFFF",
                                    boxShadow: "0 4px 20px rgba(244,63,94,0.3)",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 30px rgba(244,63,94,0.5)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(244,63,94,0.3)"; }}
                            >
                                Xóa phim
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
