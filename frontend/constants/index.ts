import { Movie, Theater, Seat } from "@/types";

// Mock data và hằng số dùng chung cho toàn dự án
// Các thành viên thêm mock data vào đây

export const APP_NAME = "LUXE CINEMA";

export const MOCK_MOVIE: Movie = {
  id: 1,
  title: "DUNE: PART TWO",
  poster: "/images/dune222.webp",
  rating: 9.1,
  director: "Denis Villeneuve",
  cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson",
  synopsis: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
  genre: "Sci-Fi, Adventure",
  duration: 166
};

export const MOCK_THEATERS: Theater[] = [
  {
    id: "t1",
    name: "AMC Empire 25",
    address: "234 WEST 42ND ST, NEW YORK",
    showtimes: [
      { id: "s1", time: "19:30", type: "IMAX LASER", theaterId: "t1" },
      { id: "s2", time: "21:00", type: "DOLBY CINEMA", theaterId: "t1" },
      { id: "s3", time: "22:45", type: "STANDARD", theaterId: "t1" }
    ]
  },
  {
    id: "t2",
    name: "Regal E-Walk",
    address: "247 WEST 42ND ST, NEW YORK",
    showtimes: [
      { id: "s4", time: "18:00", type: "STANDARD", theaterId: "t2" },
      { id: "s5", time: "20:30", type: "IMAX", theaterId: "t2" }
    ]
  },
  {
    id: "t3",
    name: "Alamo Drafthouse",
    address: "28 LIBERTY ST, NEW YORK",
    showtimes: [
      { id: "s6", time: "19:00", type: "STANDARD", theaterId: "t3" }
    ]
  }
];

export const MOCK_SEATS: Seat[] = (() => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  rows.forEach(row => {
    for (let i = 1; i <= 12; i++) {
      let status: 'available' | 'selected' | 'sold' = 'available';
      if (row === 'C' && i === 5) status = 'sold';
      if (row === 'C' && i === 10) status = 'sold';
      if (row === 'D' && i === 7) status = 'sold';
      if (row === 'E' && (i === 6 || i === 7 || i === 8)) status = 'sold';
      if (row === 'F' && (i === 11 || i === 12)) status = 'sold';
      if (row === 'H' && (i === 2 || i === 3)) status = 'sold';
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        status
      });
    }
  });
  return seats;
})();
