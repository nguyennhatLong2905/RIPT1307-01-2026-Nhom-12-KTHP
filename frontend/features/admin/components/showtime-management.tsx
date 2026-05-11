"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CalendarDays,
  Film,
  DoorOpen
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { adminService } from "../services/admin-service";
import { Showtime, Movie, Room, ShowtimeDTO } from "@/types";

export default function ShowtimeManagement() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Partial<Showtime> | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [showtimesData, moviesData, roomsData] = await Promise.all([
        adminService.getShowtimes(),
        adminService.getMovies(),
        adminService.getRooms()
      ]);
      setShowtimes(showtimesData);
      setMovies(moviesData);
      setRooms(roomsData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa suất chiếu này?")) {
      try {
        await adminService.deleteShowtime(id);
        fetchData();
      } catch (error) {
        alert("Lỗi khi xóa suất chiếu");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dto: ShowtimeDTO = {
      movieId: parseInt(formData.get("movieId") as string),
      roomId: parseInt(formData.get("roomId") as string),
      startTime: formData.get("startTime") as string,
      price: parseFloat(formData.get("price") as string),
    };

    try {
      if (editingShowtime?.id) {
        await adminService.updateShowtime(editingShowtime.id, dto);
      } else {
        await adminService.createShowtime(dto);
      }
      setIsDialogOpen(false);
      setEditingShowtime(null);
      fetchData();
    } catch (error) {
      alert("Lỗi khi lưu suất chiếu");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Suất chiếu</h2>
          <p className="text-white/40 text-sm">Lên lịch chiếu phim cho các phòng và thiết lập giá vé</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="text-black hover:bg-opacity-90 rounded-xl font-bold shadow-lg shadow-[#c9a84c]/20 px-6 transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ backgroundColor: "#c9a84c" }}
              onClick={() => setEditingShowtime(null)}
            >
              <Plus size={20} className="mr-2" />
              Tạo Suất Chiếu
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0d0d0d] border-[#c9a84c]/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold italic tracking-tighter" style={{ color: "#c9a84c" }}>
                {editingShowtime ? "CẬP NHẬT SUẤT CHIẾU" : "TẠO SUẤT CHIẾU MỚI"}
              </DialogTitle>
              <DialogDescription className="text-white/40">
                Thiết lập thời gian và giá vé cho suất chiếu.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                  <Label htmlFor="movieId">Chọn Phim</Label>
                <Select name="movieId" defaultValue={editingShowtime?.movie?.id?.toString()}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Chọn phim..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    {movies.map(movie => (
                      <SelectItem key={movie.id} value={movie.id.toString()}>{movie.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomId">Chọn Phòng</Label>
                <Select name="roomId" defaultValue={editingShowtime?.room?.id?.toString()}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Chọn phòng..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    {rooms.map(room => (
                      <SelectItem key={room.id} value={room.id.toString()}>{room.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Thời gian bắt đầu</Label>
                  <Input 
                    id="startTime" 
                    name="startTime" 
                    type="datetime-local" 
                    defaultValue={editingShowtime?.startTime?.substring(0, 16)} 
                    required 
                    className="bg-white/5 border-white/10" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Giá vé (VNĐ)</Label>
                  <Input id="price" name="price" type="number" defaultValue={editingShowtime?.price} required className="bg-white/5 border-white/10" />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl text-white/60 hover:text-white hover:bg-white/5">Hủy</Button>
                <Button 
                  type="submit" 
                  className="text-black hover:bg-opacity-90 rounded-xl px-8 font-bold shadow-lg shadow-[#c9a84c]/10"
                  style={{ backgroundColor: "#c9a84c" }}
                >
                  Lưu Thay Đổi
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-[#0d0d0d] border border-[#c9a84c]/10 rounded-2xl overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-[#c9a84c]/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white/60">Phim</TableHead>
              <TableHead className="text-white/60">Phòng</TableHead>
              <TableHead className="text-white/60">Thời gian bắt đầu</TableHead>
              <TableHead className="text-white/60">Giá vé</TableHead>
              <TableHead className="text-right text-white/60">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-white/40">Đang tải dữ liệu...</TableCell>
              </TableRow>
            ) : showtimes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-white/40">Không tìm thấy suất chiếu nào</TableCell>
              </TableRow>
            ) : showtimes.map((showtime) => (
              <TableRow key={showtime.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                <TableCell className="font-semibold">
                  <div className="flex items-center gap-2">
                    <Film size={16} style={{ color: "#c9a84c" }} />
                    {showtime.movie.title}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DoorOpen size={16} className="text-blue-400" />
                    {showtime.room.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-white/40" />
                    {new Date(showtime.startTime).toLocaleString("vi-VN")}
                  </div>
                </TableCell>
                <TableCell style={{ color: "#c9a84c" }} className="font-bold">{showtime.price.toLocaleString("vi-VN")}đ</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg"
                      onClick={() => {
                        setEditingShowtime(showtime);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit2 size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg"
                      onClick={() => handleDelete(showtime.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
