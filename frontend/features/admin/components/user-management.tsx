"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Trash2, 
  Users,
  Mail,
  Phone,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading customer list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      try {
        await adminService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        alert("Error deleting user");
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  // Tính toán phân trang
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">User Management</h2>
        <p className="text-white/40 text-sm">List of customer and admin accounts in the system</p>
      </div>

      <div className="bg-[#0d0d0d] border border-[#c9a84c]/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#c9a84c]/10 flex items-center gap-4">
          <div className="relative flex-1 max-sm:w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c9a84c]/40" size={18} />
            <Input 
              placeholder="Search by name, email, username..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 bg-white/5 border-white/10 rounded-xl focus:border-[#c9a84c]/50 transition-colors"
            />
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-[#c9a84c]/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white/60">User</TableHead>
              <TableHead className="text-white/60">Contact</TableHead>
              <TableHead className="text-white/60">Role</TableHead>
              <TableHead className="text-right text-white/60">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-white/40">Loading data...</TableCell>
              </TableRow>
            ) : paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-white/40">No users found</TableCell>
              </TableRow>
            ) : paginatedUsers.map((user) => (
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

      {/* Thanh phân trang cao cấp nằm ở giữa, bên ngoài bảng */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-1 bg-[#0d0d0d] p-1.5 rounded-xl border border-[#c9a84c]/20 shadow-lg">
            <Button 
              variant="ghost" 
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="h-8 w-8 rounded-lg text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                  currentPage === page 
                    ? "bg-[#c9a84c] text-black hover:bg-[#c9a84c]/90 shadow-md shadow-[#c9a84c]/20" 
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {page}
              </Button>
            ))}
            <Button 
              variant="ghost" 
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="h-8 w-8 rounded-lg text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
