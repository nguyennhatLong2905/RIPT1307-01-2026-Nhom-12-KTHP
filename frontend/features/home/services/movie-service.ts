import axiosInstance from "@/lib/axios";
import { Movie } from "@/types";

export const movieService = {
  getAllMovies: async (): Promise<Movie[]> => {
    const response = await axiosInstance.get("/movies");
    return response.data;
  },

  getAIPicks: async (genres?: string[]): Promise<Movie[]> => {
    const params = genres ? { genres: genres.join(",") } : {};
    const response = await axiosInstance.get("/movies/ai-pick", { params });
    return response.data;
  },

  getMyAIPicks: async (): Promise<Movie[]> => {
    const response = await axiosInstance.get("/movies/my-ai-pick");
    return response.data;
  }
};
