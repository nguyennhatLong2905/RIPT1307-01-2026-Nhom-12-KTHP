import axiosInstance from "@/lib/axios";
import { User } from "@/types";

export interface RegisterRequest extends Omit<User, "id" | "role"> {
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export const authService = {
  // Authentication
  register: async (data: RegisterRequest): Promise<User> => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<string> => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data; // Trả về JWT Token
  },

  forgotPassword: async (email: string): Promise<string> => {
    const response = await axiosInstance.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<string> => {
    const response = await axiosInstance.post("/auth/reset-password", { token, newPassword });
    return response.data;
  },

  // User Profile
  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get("/users/profile");
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await axiosInstance.put("/users/profile", data);
    return response.data;
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<string> => {
    const response = await axiosInstance.put("/users/change-password", { oldPassword, newPassword });
    return response.data;
  }
};
