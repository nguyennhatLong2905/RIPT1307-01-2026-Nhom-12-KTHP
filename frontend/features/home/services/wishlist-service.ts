import axiosInstance from "@/lib/axios";
import { Movie } from "@/types";

export const wishlistService = {
  getWishlist: async (): Promise<Movie[]> => {
    const response = await axiosInstance.get("/wishlist");
    return response.data;
  },

  addToWishlist: async (movieId: number): Promise<string> => {
    const response = await axiosInstance.post(`/wishlist/${movieId}`);
    return response.data;
  },

  removeFromWishlist: async (movieId: number): Promise<string> => {
    const response = await axiosInstance.delete(`/wishlist/${movieId}`);
    return response.data;
  }
};
