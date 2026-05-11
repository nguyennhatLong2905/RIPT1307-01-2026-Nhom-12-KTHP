import axiosInstance from "@/lib/axios";
import { Booking } from "@/types";

export const bookingService = {
  getMyHistory: async (): Promise<Booking[]> => {
    const response = await axiosInstance.get("/bookings/my-history");
    return response.data;
  },

  createBooking: async (showtimeId: number, seats: string[]): Promise<Booking> => {
    const response = await axiosInstance.post(`/bookings/showtime/${showtimeId}`, seats);
    return response.data;
  },

  cancelBooking: async (id: number): Promise<string> => {
    const response = await axiosInstance.delete(`/bookings/${id}`);
    return response.data;
  },

  getBookingById: async (id: number): Promise<Booking> => {
    const response = await axiosInstance.get(`/bookings/${id}`);
    return response.data;
  }
};
