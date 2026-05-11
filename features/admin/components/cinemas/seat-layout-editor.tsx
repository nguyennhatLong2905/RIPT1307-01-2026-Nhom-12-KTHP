"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Crown, Heart, Monitor, Save } from "lucide-react";
import { Seat, SeatMap, SeatType, generateSeatMap, seatTypeConfig } from "./cinema-types";

interface SeatLayoutEditorProps {
  initial?: SeatMap;
  onSave: (map: SeatMap) => void;
}

const SEAT_TYPES: Array<{ type: SeatType; icon?: React.ReactNode; label: string; surcharge: string }> = [
  { type: "Standard", label: "Standard", surcharge: "+0đ" },
  { type: "VIP",      label: "VIP",      surcharge: "+50.000đ", icon: <Crown className="h-3 w-3" /> },
  { type: "Sweetbox", label: "Sweetbox", surcharge: "+100.000đ", icon: <Heart className="h-3 w-3" /> },
];

export default function SeatLayoutEditor({ initial, onSave }: SeatLayoutEditorProps) {
  const [rows,    setRows]    = useState(initial?.rows ?? 6);
  const [cols,    setCols]    = useState(initial?.cols ?? 10);
  const [rowsInput, setRowsInput] = useState(String(initial?.rows ?? 6));
  const [colsInput, setColsInput] = useState(String(initial?.cols ?? 10));
  const [map,     setMap]     = useState<SeatMap>(initial ?? generateSeatMap(6, 10));
  const [selType, setSelType] = useState<SeatType>("Standard");
  const [isDirty, setIsDirty] = useState(false);

  const isDragging = useRef(false);
  const lastPainted = useRef<string>("");

  const initMatrix = () => {
    const r = Math.min(Math.max(parseInt(rowsInput) || 1, 1), 26);
    const c = Math.min(Math.max(parseInt(colsInput) || 1, 1), 30);
    setRows(r); setCols(c);
    setMap(generateSeatMap(r, c));
    setIsDirty(false);
  };

  const paintSeat = useCallback((ri: number, ci: number) => {
    const key = `${ri}-${ci}`;
    if (key === lastPainted.current) return;
    lastPainted.current = key;
    setMap(prev => {
      const seats = prev.seats.map((row, r) =>
        r === ri ? row.map((seat, c) => c === ci ? { ...seat, type: selType } : seat) : row
      );
      return { ...prev, seats };
    });
    setIsDirty(true);
  }, [selType]);

  const onMouseDown = (ri: number, ci: number) => {
    isDragging.current = true;
    lastPainted.current = "";
    paintSeat(ri, ci);
  };
  const onMouseEnter = (ri: number, ci: number) => {
    if (isDragging.current) paintSeat(ri, ci);
  };
  const onMouseUp = () => { isDragging.current = false; lastPainted.current = ""; };

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    return () => window.removeEventListener("mouseup", onMouseUp);
  }, []);

  const seatColor = (type: SeatType) => seatTypeConfig[type].color;
  const seatBg    = (type: SeatType) => seatTypeConfig[type].bg;

  return (
    <div className="rounded-2xl border border-[#1F2532] bg-[#161B22] p-5 space-y-5 select-none">
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Số hàng</label>
          <div className="flex items-center gap-1">
            <button onClick={() => setRowsInput(v => String(Math.max(1, (parseInt(v)||1) - 1)))}
              className="w-8 h-9 rounded-lg bg-[#0D1117] border border-[#1F2532] text-white text-lg flex items-center justify-center hover:border-violet-500 transition-colors">−</button>
            <input type="number" value={rowsInput} onChange={e => setRowsInput(e.target.value)} min={1} max={26}
              className="w-14 h-9 rounded-lg bg-[#0D1117] border border-[#1F2532] text-white text-sm text-center outline-none focus:border-violet-500 transition-colors" />
            <button onClick={() => setRowsInput(v => String(Math.min(26, (parseInt(v)||0) + 1)))}
              className="w-8 h-9 rounded-lg bg-[#0D1117] border border-[#1F2532] text-white text-lg flex items-center justify-center hover:border-violet-500 transition-colors">+</button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#8B949E] mb-1.5">Số cột</label>
          <div className="flex items-center gap-1">
            <button onClick={() => setColsInput(v => String(Math.max(1, (parseInt(v)||1) - 1)))}
              className="w-8 h-9 rounded-lg bg-[#0D1117] border border-[#1F2532] text-white text-lg flex items-center justify-center hover:border-violet-500 transition-colors">−</button>
            <input type="number" value={colsInput} onChange={e => setColsInput(e.target.value)} min={1} max={30}
              className="w-14 h-9 rounded-lg bg-[#0D1117] border border-[#1F2532] text-white text-sm text-center outline-none focus:border-violet-500 transition-colors" />
            <button onClick={() => setColsInput(v => String(Math.min(30, (parseInt(v)||0) + 1)))}
              className="w-8 h-9 rounded-lg bg-[#0D1117] border border-[#1F2532] text-white text-lg flex items-center justify-center hover:border-violet-500 transition-colors">+</button>
          </div>
        </div>
        <button onClick={initMatrix}
          className="h-9 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-cyan-500 shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_30px_rgba(124,58,237,0.5)] hover:-translate-y-px transition-all duration-200">
          Khởi tạo ma trận
        </button>
      </div>

      {/* Seat type selector */}
      <div>
        <p className="text-xs font-semibold text-[#8B949E] mb-2">Loại ghế</p>
        <div className="flex flex-wrap gap-2">
          {SEAT_TYPES.map(({ type, label, surcharge, icon }) => {
            const cfg = seatTypeConfig[type];
            const active = selType === type;
            return (
              <button key={type} onClick={() => setSelType(type)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-200 border"
                style={{
                  background: active ? cfg.bg : "rgba(255,255,255,0.03)",
                  color: active ? cfg.color : "#8B949E",
                  borderColor: active ? cfg.color + "60" : "#1F2532",
                  boxShadow: active ? `0 0 14px ${cfg.bg}` : "none",
                }}>
                {icon}
                {label}
                <span className="ml-0.5 text-[10px] opacity-70">{surcharge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Screen */}
      <div className="flex flex-col items-center gap-1">
        <div className="w-3/4 max-w-xs h-8 rounded-t-full flex items-center justify-center gap-2 text-xs font-bold tracking-widest"
          style={{ background: "linear-gradient(90deg,rgba(124,58,237,0.6),rgba(45,212,191,0.6))", boxShadow: "0 0 30px rgba(124,58,237,0.5),0 0 60px rgba(45,212,191,0.2)", color: "#fff" }}>
          <Monitor className="h-3.5 w-3.5" />
          MÀN HÌNH CHÍNH
        </div>
        <div className="w-4/5 max-w-xs h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />
      </div>

      {/* Grid */}
      <div className="overflow-auto">
        <div className="inline-block min-w-full">
          {/* Col numbers */}
          <div className="flex pl-6 gap-0.5 mb-0.5">
            <div className="w-5" />
            {map.seats[0]?.map((_, ci) => (
              <div key={ci} className="w-7 text-center text-[9px] text-[#8B949E]">{ci + 1}</div>
            ))}
          </div>
          {/* Rows */}
          {map.seats.map((row, ri) => (
            <div key={ri} className="flex items-center gap-0.5 mb-0.5">
              <div className="w-5 text-center text-[9px] font-bold text-[#8B949E]">{row[0]?.row}</div>
              {row.map((seat, ci) => (
                <div key={ci}
                  onMouseDown={() => onMouseDown(ri, ci)}
                  onMouseEnter={() => onMouseEnter(ri, ci)}
                  className="w-7 h-7 rounded flex items-center justify-center text-[8px] font-bold cursor-pointer transition-all duration-100 border"
                  style={{
                    background: seatBg(seat.type),
                    borderColor: seatColor(seat.type) + "50",
                    color: seatColor(seat.type),
                  }}
                  title={`${seat.row}${seat.col} — ${seat.type}`}
                >
                  {seat.col}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {SEAT_TYPES.map(({ type, label }) => {
          const cfg = seatTypeConfig[type];
          return (
            <div key={type} className="flex items-center gap-1.5 text-xs text-[#8B949E]">
              <div className="w-4 h-4 rounded border" style={{ background: cfg.bg, borderColor: cfg.color + "50" }} />
              {label}
            </div>
          );
        })}
      </div>

      {/* Save button */}
      <button onClick={() => { onSave(map); setIsDirty(false); }}
        className="flex items-center gap-2 w-full justify-center rounded-xl py-3 text-sm font-semibold text-white transition-all duration-300"
        style={{
          background: "linear-gradient(90deg,#7C3AED,#2DD4BF)",
          boxShadow: isDirty ? "0 4px 24px rgba(124,58,237,0.4)" : "0 4px 12px rgba(124,58,237,0.2)",
          opacity: isDirty ? 1 : 0.6,
        }}>
        <Save className="h-4 w-4" />
        Lưu sơ đồ phòng chiếu
      </button>
    </div>
  );
}
