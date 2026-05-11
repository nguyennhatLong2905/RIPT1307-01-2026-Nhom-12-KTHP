"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Trash2, 
  Users,
  Mail,
  Phone,
  ShieldCheck
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
import { Badge } from "@/components/ui/badge";
import { adminService } from "../services/admin-service";
import { User, UserRole } from "@/types";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa khách hàng này? Thao tác này không thể hoàn tác.")) {
      try {
        await adminService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        alert("Lỗi khi xóa người dùng");
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Quản lý Người dùng</h2>
        <p className="text-white/40 text-sm">Danh sách tài khoản khách hàng và quản trị viên trong hệ thống</p>
      </div>

      <div className="bg-[#0d0d0d] border border-[#c9a84c]/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#c9a84c]/10 flex items-center gap-4">
          <div className="relative flex-1 max-sm:w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/40" size={18} />
            <Input 
              placeholder="Tìm kiếm theo tên, email, username..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 rounded-xl focus:border-[#c9a84c]/50 transition-colors"
            />
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-[#c9a84c]/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white/60">Người dùng</TableHead>
              <TableHead className="text-white/60">Liên hệ</TableHead>
              <TableHead className="text-white/60">Vai trò</TableHead>
              <TableHead className="text-right text-white/60">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-white/40">Đang tải dữ liệu...</TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-white/40">Không tìm thấy người dùng nào</TableCell>
              </TableRow>
            ) : filteredUsers.map((user) => (
              <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#c9a84c]/20 flex items-center justify-center text-[#c9a84c] font-bold border border-[#c9a84c]/10">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{user.fullName}</div>
                      <div className="text-xs text-white/40">@{user.username}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Mail size={14} className="text-white/20" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Phone size={14} className="text-white/20" />
                        {user.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={user.role === UserRole.ADMIN ? "bg-[#c9a84c]/20 text-[#c9a84c] border-[#c9a84c]/20" : "bg-white/10 text-white/60 border-white/5"}>
                    {user.role === UserRole.ADMIN ? (
                      <div className="flex items-center gap-1 font-bold">
                        <ShieldCheck size={12} />
                        ADMIN
                      </div>
                    ) : "CUSTOMER"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {user.role !== UserRole.ADMIN && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
