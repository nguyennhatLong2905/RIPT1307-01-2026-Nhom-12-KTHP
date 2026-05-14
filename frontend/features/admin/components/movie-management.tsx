"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Film,
  Upload,
  Loader2,
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
import { Movie } from "@/types";

export default function MovieManagement() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Partial<Movie> | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // States cho file upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getMovies();
      setMovies(data);
    } catch (error) {
      console.error("Error loading movie list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      try {
        await adminService.deleteMovie(id);
        fetchMovies();
      } catch (error) {
        alert("Error deleting movie");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    let trailerUrl = formData.get("trailerUrl") as string;

    // Nếu có chọn file mới, thực hiện upload trước
    if (selectedFile) {
      setIsUploading(true);
      try {
        const uploadedUrl = await adminService.uploadTrailer(selectedFile);
        trailerUrl = uploadedUrl;
      } catch (error) {
        alert("Error uploading video trailer!");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const movieData: any = {
      title: formData.get("title"),
      director: formData.get("director"),
      genre: formData.get("genre"),
      duration: parseInt(formData.get("duration") as string),
      description: formData.get("description"),
      posterUrl: formData.get("posterUrl"),
      trailerUrl: trailerUrl,
      releaseDate: formData.get("releaseDate"),
    };

    try {
      if (editingMovie?.id) {
        await adminService.updateMovie(editingMovie.id, movieData);
      } else {
        await adminService.addMovie(movieData);
      }
      setIsDialogOpen(false);
      setEditingMovie(null);
      setSelectedFile(null);
      fetchMovies();
    } catch (error: any) {
      const errorMsg = error.response?.data || error.message || "Unknown error";
      alert("Error saving movie: " + (typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg));
    }
  };

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(search.toLowerCase()) ||
    movie.genre.toLowerCase().includes(search.toLowerCase())
  );

  // Tính toán phân trang
  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Movie Management</h2>
          <p className="text-white/40 text-sm">Add new, update information and manage movie list</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingMovie(null);
            setSelectedFile(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button 
              className="text-black hover:bg-opacity-90 rounded-xl font-bold shadow-lg shadow-[#c9a84c]/20 px-6 transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ backgroundColor: "#c9a84c" }}
              onClick={() => setEditingMovie(null)}
            >
              <Plus size={20} className="mr-2" />
              Add New Movie
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0d0d0d] border-[#c9a84c]/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold italic tracking-tighter" style={{ color: "#c9a84c" }}>
                {editingMovie ? "UPDATE MOVIE" : "ADD NEW MOVIE"}
              </DialogTitle>
              <DialogDescription className="text-white/40">
                Enter movie details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Movie Title</Label>
                  <Input id="title" name="title" defaultValue={editingMovie?.title} required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="director">Director</Label>
                  <Input id="director" name="director" defaultValue={editingMovie?.director} required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Input id="genre" name="genre" defaultValue={editingMovie?.genre} required className="bg-white/5 border-white/10" placeholder="Action, Sci-fi..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input id="duration" name="duration" type="number" defaultValue={editingMovie?.duration} required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="releaseDate">Release Date</Label>
                  <Input id="releaseDate" name="releaseDate" type="date" defaultValue={editingMovie?.releaseDate} required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posterUrl">Poster Image URL</Label>
                  <Input id="posterUrl" name="posterUrl" defaultValue={editingMovie?.posterUrl} className="bg-white/5 border-white/10" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trailerFile">Upload Video Trailer (local file)</Label>
                <div className="flex gap-2">
                  <Input 
                    id="trailerFile" 
                    type="file" 
                    accept="video/*" 
                    onChange={handleFileChange}
                    className="bg-white/5 border-white/10 flex-1 file:bg-[#c9a84c] file:text-black file:font-bold file:rounded-md file:border-none file:mr-4 file:px-4 cursor-pointer" 
                  />
                  {selectedFile && (
                    <Button type="button" variant="ghost" size="icon" className="text-red-400" onClick={() => setSelectedFile(null)}>
                      <Trash2 size={18} />
                    </Button>
                  )}
                </div>
                {editingMovie?.trailerUrl && !selectedFile && (
                  <p className="text-[10px] text-white/30 italic mt-1">Currently using: {editingMovie.trailerUrl}</p>
                )}
                <input type="hidden" name="trailerUrl" defaultValue={editingMovie?.trailerUrl} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Movie Description</Label>
                <Textarea id="description" name="description" defaultValue={editingMovie?.description} className="bg-white/5 border-white/10 min-h-[100px]" />
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl text-white/60 hover:text-white hover:bg-white/5">Cancel</Button>
                <Button 
                  type="submit" 
                  disabled={isUploading}
                  className="text-black hover:bg-opacity-90 rounded-xl px-8 font-bold shadow-lg shadow-[#c9a84c]/10 min-w-[140px]"
                  style={{ backgroundColor: "#c9a84c" }}
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Uploading video...
                    </>
                  ) : (
                    "Save Changes"
                  )}
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
              placeholder="Search movies..." 
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
              <TableHead className="text-white/60">Poster</TableHead>
              <TableHead className="text-white/60">Movie Title</TableHead>
              <TableHead className="text-white/60">Genre</TableHead>
              <TableHead className="text-white/60">Duration</TableHead>
              <TableHead className="text-white/60">Release Date</TableHead>
              <TableHead className="text-right text-white/60">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-white/40">Loading data...</TableCell>
              </TableRow>
            ) : paginatedMovies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-white/40">No movies found</TableCell>
              </TableRow>
            ) : paginatedMovies.map((movie) => (
              <TableRow key={movie.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                <TableCell>
                  <div className="w-12 h-16 rounded-lg bg-white/5 overflow-hidden border border-white/10 flex items-center justify-center relative group-hover:border-[#c9a84c]/30 transition-colors">
                    {movie.posterUrl ? (
                      <img 
                        src={movie.posterUrl} 
                        alt={movie.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/400x600/0d0d0d/c9a84c?text=No+Poster";
                          (e.target as HTMLImageElement).className = "w-full h-full object-cover opacity-50";
                        }}
                      />
                    ) : (
                      <Film size={20} className="text-white/20" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{movie.title}</TableCell>
                <TableCell>{movie.genre}</TableCell>
                <TableCell>{movie.duration} min</TableCell>
                <TableCell>{movie.releaseDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg"
                      onClick={() => {
                        setEditingMovie(movie);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit2 size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg"
                      onClick={() => handleDelete(movie.id)}
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
