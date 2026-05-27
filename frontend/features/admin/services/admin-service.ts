import axiosInstance from "@/lib/axios";
import { Movie, Room, Showtime, ShowtimeDTO, User, Stats, Cinema, Booking } from "@/types";

export const adminService = {
  getCinemas: async (): Promise<Cinema[]> => {
    const response = await axiosInstance.get("/admin/cinemas");
    return response.data;
  },
  addCinema: async (cinema: Omit<Cinema, "id">): Promise<Cinema> => {
    const response = await axiosInstance.post("/admin/cinemas", cinema);
    return response.data;
  },
  updateCinema: async (id: number, cinema: Partial<Cinema>): Promise<Cinema> => {
    const response = await axiosInstance.put(`/admin/cinemas/${id}`, cinema);
    return response.data;
  },
  deleteCinema: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/cinemas/${id}`);
  },
  getSummaryStats: async () => {
    const response = await axiosInstance.get("/admin/dashboard/summary");
    return response.data;
  },
  getMonthlyRevenue: async () => {
    const response = await axiosInstance.get("/admin/dashboard/monthly-revenue");
    return response.data;
  },
  getRecentBookings: async () => {
    const response = await axiosInstance.get("/admin/dashboard/recent-bookings");
    return response.data;
  },

  getStats: async (): Promise<Stats> => {
    try {
      const [summary, monthly, recent] = await Promise.all([
        axiosInstance.get("/admin/dashboard/summary"),
        axiosInstance.get("/admin/dashboard/monthly-revenue"),
        axiosInstance.get("/admin/dashboard/recent-bookings"),
      ]);

      return {
        totalRevenue: summary.data?.totalRevenue || 0,
        totalBookings: summary.data?.totalBookings || 0,
        totalMovies: summary.data?.totalMovies || 0,
        totalUsers: summary.data?.totalCustomers || 0,
        revenueByMonth: monthly.data || {},
        recentBookings: recent.data || []
      };
    } catch (error) {
      console.error("Lỗi khi lấy thống kê:", error);
      return {
        totalRevenue: 0,
        totalBookings: 0,
        totalMovies: 0,
        totalUsers: 0,
        revenueByMonth: {},
        recentBookings: []
      };
    }
  },

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

  getUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get("/admin/users");
    return response.data;
  },
  deleteUser: async (id: number): Promise<string> => {
    const response = await axiosInstance.delete(`/admin/users/${id}`);
    return response.data;
  },

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

  getBookings: async (): Promise<Booking[]> => {
    const response = await axiosInstance.get("/admin/bookings");
    return response.data;
  },

  deleteBooking: async (id: number): Promise<string> => {
    const response = await axiosInstance.delete(`/bookings/${id}`);
    return response.data;
  },
};
