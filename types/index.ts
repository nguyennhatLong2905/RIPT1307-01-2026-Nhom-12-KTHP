// TypeScript interfaces và types dùng chung cho toàn dự án
// Các thành viên thêm interfaces vào đây
export interface Movie {
    id: string | number;
    title: string;
    poster?: string;
    image?: string;
    rating: number | string;
    director?: string;
    cast?: string;
    synopsis?: string;
    originalTitle?: string;
    imdb?: number;
    year?: number;
    duration?: string;
}

export interface Showtime {
    id: string;
    time: string;
    type: string;
    theaterId: string;
}
export interface Theater {
    id: string;
    name: string;
    address: string;
    showtimes: Showtime[];
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
