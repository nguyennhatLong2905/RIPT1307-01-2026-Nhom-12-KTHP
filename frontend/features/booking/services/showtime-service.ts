import axiosInstance from "@/lib/axios";
import { Showtime } from "@/types";

export const showtimeService = {
  getShowtimesByMovie: async (movieId: number): Promise<Showtime[]> => {
    const response = await axiosInstance.get(`/showtimes/movie/${movieId}`);
    return response.data;
  },
  
  // Chúng ta có thể thêm lấy chi tiết 1 suất chiếu nếu backend hỗ trợ
};
