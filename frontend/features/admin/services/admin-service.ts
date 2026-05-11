import axiosInstance from "@/lib/axios";
import { Movie, Room, Showtime, ShowtimeDTO, User, Stats } from "@/types";

export const adminService = {
  // Statistics
  getStats: async (): Promise<Stats> => {
    try {
      const [statsRes, moviesRes, usersRes] = await Promise.all([
        axiosInstance.get("/admin/stats"),
        axiosInstance.get("/movies"),
        axiosInstance.get("/admin/users")
      ]);

      const backendStats = statsRes.data;
      
      return {
        ...backendStats,
        totalRevenue: backendStats.doanhThu || 0,
        totalBookings: backendStats.tongSoVe || 0,
        totalMovies: moviesRes.data.length || 0,
        totalUsers: usersRes.data.length || 0,
        lichSuDatVe: backendStats.lichSuDatVe || []
      };
    } catch (error) {
      console.error("Lỗi khi lấy thống kê:", error);
      return {
        totalRevenue: 0,
        totalBookings: 0,
        totalMovies: 0,
        totalUsers: 0,
        lichSuDatVe: []
      };
    }
  },

  // Movie Management
  getMovies: async (): Promise<Movie[]> => {
    const response = await axiosInstance.get("/movies");
    return response.data;
  },
  addMovie: async (movie: Omit<Movie, "id">): Promise<Movie> => {
    const response = await axiosInstance.post("/admin/movies", movie);
    return response.data;
  },
  updateMovie: async (id: number, movie: Partial<Movie>): Promise<string> => {
    const response = await axiosInstance.put(`/admin/movies/${id}`, movie);
    return response.data;
  },
  deleteMovie: async (id: number): Promise<string> => {
    const response = await axiosInstance.delete(`/admin/movies/${id}`);
    return response.data;
  },

  // Room Management
  getRooms: async (): Promise<Room[]> => {
    const response = await axiosInstance.get("/admin/rooms");
    return response.data;
  },
  addRoom: async (room: Omit<Room, "id">): Promise<Room> => {
    const response = await axiosInstance.post("/admin/rooms", room);
    return response.data;
  },
  updateRoom: async (id: number, room: Partial<Room>): Promise<string> => {
    const response = await axiosInstance.put(`/admin/rooms/${id}`, room);
    return response.data;
  },
  deleteRoom: async (id: number): Promise<string> => {
    const response = await axiosInstance.delete(`/admin/rooms/${id}`);
    return response.data;
  },

  // Showtime Management
  getShowtimes: async (): Promise<Showtime[]> => {
    const response = await axiosInstance.get("/admin/showtimes");
    return response.data;
  },
  createShowtime: async (dto: ShowtimeDTO): Promise<string> => {
    const response = await axiosInstance.post("/admin/showtimes", dto);
    return response.data;
  },
  updateShowtime: async (id: number, dto: ShowtimeDTO): Promise<string> => {
    const response = await axiosInstance.put(`/admin/showtimes/${id}`, dto);
    return response.data;
  },
  deleteShowtime: async (id: number): Promise<string> => {
    const response = await axiosInstance.delete(`/admin/showtimes/${id}`);
    return response.data;
  },

  // User Management
  getUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get("/admin/users");
    return response.data;
  },
  deleteUser: async (id: number): Promise<string> => {
    const response = await axiosInstance.delete(`/admin/users/${id}`);
    return response.data;
  },

  // File Upload
  uploadTrailer: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axiosInstance.post("/files/upload-trailer", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.url;
  },

  deleteBooking: async (id: number): Promise<string> => {
    const response = await axiosInstance.delete(`/bookings/${id}`);
    return response.data;
  },
};
