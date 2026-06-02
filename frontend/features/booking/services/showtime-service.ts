import axiosInstance from "@/lib/axios";
import { Showtime } from "@/types";

export const showtimeService = {
  getShowtimesByMovie: async (movieId: number): Promise<Showtime[]> => {
    const response = await axiosInstance.get(`/showtimes/movie/${movieId}`);
    return response.data;
  },
  getShowtimeById: async (id: number): Promise<Showtime> => {
    const response = await axiosInstance.get(`/showtimes/${id}`);
    return response.data;
  }
};
