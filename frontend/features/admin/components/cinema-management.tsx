"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MapPin,
  Image as ImageIcon,
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
import { Textarea } from "@/components/ui/textarea";
import { adminService } from "../services/admin-service";
import { Cinema } from "@/types";

export default function CinemaManagement() {
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCinema, setEditingCinema] = useState<Partial<Cinema> | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCinemas();
  }, []);

  const fetchCinemas = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getCinemas();
      setCinemas(data);
    } catch (error) {
      console.error("Error loading cinemas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this cinema? All related rooms and showtimes might be affected.")) {
      try {
        await adminService.deleteCinema(id);
        fetchCinemas();
      } catch (error) {
        alert("Error deleting cinema");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cinemaData: any = {
      name: formData.get("name"),
      address: formData.get("address"),
      imageUrl: formData.get("imageUrl"),
      description: formData.get("description"),
    };

    try {
      if (editingCinema?.id) {
        await adminService.updateCinema(editingCinema.id, cinemaData);
      } else {
        await adminService.addCinema(cinemaData);
      }
      setIsDialogOpen(false);
      setEditingCinema(null);
      fetchCinemas();
    } catch (error) {
      alert("Error saving cinema");
    }
  };

  const filteredCinemas = cinemas.filter(cinema => 
    cinema.name.toLowerCase().includes(search.toLowerCase()) ||
    cinema.address.toLowerCase().includes(search.toLowerCase())
  );

  // Tính toán phân trang
  const totalPages = Math.max(1, Math.ceil(filteredCinemas.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCinemas = filteredCinemas.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Cinema Management</h2>
          <p className="text-white/40 text-sm">Manage cinema branches and locations</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="text-black hover:bg-opacity-90 rounded-xl font-bold shadow-lg shadow-[#c9a84c]/20 px-6 transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ backgroundColor: "#c9a84c" }}
              onClick={() => setEditingCinema(null)}
            >
              <Plus size={20} className="mr-2" />
              Add New Cinema
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0d0d0d] border-[#c9a84c]/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold italic tracking-tighter" style={{ color: "#c9a84c" }}>
                {editingCinema ? "UPDATE CINEMA" : "ADD NEW CINEMA"}
              </DialogTitle>
              <DialogDescription className="text-white/40">
                Enter cinema branch details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Cinema Name</Label>
                  <Input id="name" name="name" defaultValue={editingCinema?.name} required className="bg-white/5 border-white/10" placeholder="e.g. Luxe Cinema Quận 1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" name="imageUrl" defaultValue={editingCinema?.imageUrl} className="bg-white/5 border-white/10" placeholder="https://..." />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" defaultValue={editingCinema?.address} required className="bg-white/5 border-white/10" placeholder="123 Street, District 1, HCMC" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editingCinema?.description} className="bg-white/5 border-white/10 min-h-[100px]" placeholder="Brief info about this branch..." />
              </div>

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl text-white/60 hover:text-white hover:bg-white/5">Cancel</Button>
                <Button 
                  type="submit" 
                  className="text-black hover:bg-opacity-90 rounded-xl px-8 font-bold shadow-lg shadow-[#c9a84c]/10"
                  style={{ backgroundColor: "#c9a84c" }}
                >
                  Save Changes
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
              placeholder="Search cinemas..." 
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
              <TableHead className="text-white/60 w-[300px]">Cinema Name</TableHead>
              <TableHead className="text-white/60">Address</TableHead>
              <TableHead className="text-right text-white/60">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-white/40">Loading data...</TableCell>
              </TableRow>
            ) : paginatedCinemas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-white/40">No cinemas found</TableCell>
              </TableRow>
            ) : paginatedCinemas.map((cinema) => (
              <TableRow key={cinema.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                <TableCell className="font-semibold">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden border border-white/10">
                      {cinema.imageUrl ? (
                        <img src={cinema.imageUrl} alt={cinema.name} className="w-full h-full object-cover" />
                      ) : (
                        <MapPin size={20} className="text-[#c9a84c]" />
                      )}
                    </div>
                    <span className="text-[#c9a84c]">{cinema.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-white/60">{cinema.address}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg"
                      onClick={() => {
                        setEditingCinema(cinema);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit2 size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg"
                      onClick={() => handleDelete(cinema.id)}
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
