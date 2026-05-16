// TypeScript interfaces và types dùng chung cho toàn dự án

export enum UserRole {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface Movie {
  id: number;
  title: string;
  description?: string;
  director: string;
  genre: string;
  duration: number;
  releaseDate?: string;
  posterUrl?: string;
  trailerUrl?: string;
  // Các field mở rộng dùng cho Frontend
  poster?: string;
  rating?: number;
  cast?: string;
  synopsis?: string;
}

export interface Cinema {
  id: number;
  name: string;
  address: string;
  imageUrl?: string;
  description?: string;
}

export interface Room {
  id: number;
  name: string;
  rowsCount: number;
  colsCount: number;
  totalSeats?: number;
  cinema?: Cinema;
}

export interface Showtime {
  id: number;
  movie: Movie;
  room: Room;
  startTime: string;
  price: number;
  // Các field mở rộng dùng cho Frontend
  time?: string;
  type?: string;
  theaterId?: string;
}

export interface Theater {
  id: string;
  name: string;
  address: string;
  imageUrl?: string;
  description?: string;
  showtimes: {
    id: string;
    time: string;
    type: string;
    theaterId: string;
    isExpired?: boolean;
    startTime?: string;
  }[];
}

export interface ShowtimeDTO {
  movieId: number;
  roomId: number;
  startTime: string;
  price: number;
}

export interface Stats {
  totalRevenue: number;
  totalBookings: number;
  totalMovies: number;
  totalUsers: number;
  revenueByMonth: Record<string, number>;
  recentBookings: Booking[];
  [key: string]: any;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'sold';
}

export interface BookingState {
  movieId: string;
  theaterId: string;
  showtimeId: string;
  selectedSeats: Seat[];
  totalPrice: number;
}
export interface Booking {
  id: number;
  user: User;
  showtime: Showtime;
  seatNumbers: string;
  totalAmount: number;
  bookingDate: string;
}
