"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
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
import { adminService } from "../services/admin-service";
import { Room } from "@/types";

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Partial<Room> | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getRooms();
      setRooms(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách phòng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      try {
        await adminService.deleteRoom(id);
        fetchRooms();
      } catch (error) {
        alert("Lỗi khi xóa phòng");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roomData: any = {
      name: formData.get("name"),
      rowsCount: parseInt(formData.get("rowsCount") as string),
      colsCount: parseInt(formData.get("colsCount") as string),
    };

    try {
      if (editingRoom?.id) {
        await adminService.updateRoom(editingRoom.id, roomData);
      } else {
        await adminService.addRoom(roomData);
      }
      setIsDialogOpen(false);
      setEditingRoom(null);
      fetchRooms();
    } catch (error) {
      alert("Lỗi khi lưu phòng");
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Quản lý Phòng chiếu</h2>
          <p className="text-white/40 text-sm">Thiết lập danh sách và cấu hình ghế ngồi cho các phòng</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="text-black hover:bg-opacity-90 rounded-xl font-bold shadow-lg shadow-[#c9a84c]/20 px-6 transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ backgroundColor: "#c9a84c" }}
              onClick={() => setEditingRoom(null)}
            >
              <Plus size={20} className="mr-2" />
              Thêm Phòng Mới
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0d0d0d] border-[#c9a84c]/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold italic tracking-tighter" style={{ color: "#c9a84c" }}>
                {editingRoom ? "CẬP NHẬT PHÒNG" : "THÊM PHÒNG MỚI"}
              </DialogTitle>
              <DialogDescription className="text-white/40">
                Nhập thông tin cấu hình phòng chiếu bên dưới.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên phòng</Label>
                <Input id="name" name="name" defaultValue={editingRoom?.name} required className="bg-white/5 border-white/10" placeholder="VD: Phòng 01, IMAX..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rowsCount">Số hàng ghế</Label>
                  <Input id="rowsCount" name="rowsCount" type="number" defaultValue={editingRoom?.rowsCount} required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="colsCount">Số cột ghế</Label>
                  <Input id="colsCount" name="colsCount" type="number" defaultValue={editingRoom?.colsCount} required className="bg-white/5 border-white/10" />
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
        <div className="p-4 border-b border-[#c9a84c]/10 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/40" size={18} />
            <Input 
              placeholder="Tìm kiếm phòng..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 rounded-xl focus:border-[#c9a84c]/50 transition-colors"
            />
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-[#c9a84c]/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white/60">Tên phòng</TableHead>
              <TableHead className="text-white/60">Số hàng</TableHead>
              <TableHead className="text-white/60">Số cột</TableHead>
              <TableHead className="text-white/60">Tổng số ghế</TableHead>
              <TableHead className="text-right text-white/60">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-white/40">Đang tải dữ liệu...</TableCell>
              </TableRow>
            ) : filteredRooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-white/40">Không tìm thấy phòng nào</TableCell>
              </TableRow>
            ) : filteredRooms.map((room) => (
              <TableRow key={room.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                <TableCell className="font-semibold flex items-center gap-2">
                  <DoorOpen size={18} style={{ color: "#c9a84c" }} />
                  {room.name}
                </TableCell>
                <TableCell>{room.rowsCount}</TableCell>
                <TableCell>{room.colsCount}</TableCell>
                <TableCell style={{ color: "#c9a84c" }} className="font-bold">{room.rowsCount * room.colsCount}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg"
                      onClick={() => {
                        setEditingRoom(room);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit2 size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg"
                      onClick={() => handleDelete(room.id)}
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
