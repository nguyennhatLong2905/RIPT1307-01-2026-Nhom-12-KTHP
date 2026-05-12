export type MovieStatus = "Đang chiếu" | "Sắp chiếu" | "Ngừng chiếu";
export type AgeRating = "P" | "T13" | "T16" | "T18";

export interface Movie {
    id: number;
    title: string;
    genres: string[];
    ageRating: AgeRating;
    director: string;
    actors: string;
    status: MovieStatus;
    poster: string;
    backdrop: string;
    summary: string;
    trailerUrl: string;
    isPublic: boolean;
    duration: number;
    releaseDate: string;
}

export const moviesData: Movie[] = [
    {
        id: 1,
        title: "Đất Rừng Phương Nam",
        genres: ["Historical", "Drama"],
        ageRating: "P",
        director: "Nguyễn Quang Dũng",
        actors: "Hồng Ánh, Hứa Vĩ Văn, Tuấn Trần, Trấn Thành",
        status: "Đang chiếu",
        poster: "/images/mai.jpg",
        backdrop: "/images/mai.jpg",
        summary: "Đất Rừng Phương Nam là câu chuyện về cuộc đời của cậu bé An, lớn lên giữa thiên nhiên hoang dã của vùng đất phương Nam, trải qua những cuộc phiêu lưu đầy cảm xúc và khám phá những giá trị văn hóa truyền thống.",
        trailerUrl: "https://youtube.com/watch?v=example1",
        isPublic: true,
        duration: 137,
        releaseDate: "2023-10-13",
    },
    {
        id: 2,
        title: "Người Vợ Cuối Cùng",
        genres: ["Historical", "Drama"],
        ageRating: "T18",
        director: "Victor Vũ",
        actors: "Kaity Nguyễn, Thuận Nguyễn, Quốc Cường",
        status: "Sắp chiếu",
        poster: "/images/mưa đỏ.jpg",
        backdrop: "/images/mưa đỏ.jpg",
        summary: "Câu chuyện về người phụ nữ trong xã hội phong kiến Việt Nam thế kỷ 19, phải đối mặt với những định kiến và tìm kiếm tự do cho bản thân.",
        trailerUrl: "https://youtube.com/watch?v=example2",
        isPublic: true,
        duration: 122,
        releaseDate: "2024-01-15",
    },
    {
        id: 3,
        title: "Mai",
        genres: ["Romance", "Drama"],
        ageRating: "T16",
        director: "Trấn Thành",
        actors: "Phương Anh Đào, Tuấn Trần, Hồng Đào, NSƯT Hữu Châu",
        status: "Đang chiếu",
        poster: "/images/mai.jpg",
        backdrop: "/images/mai.jpg",
        summary: "Mai - một cô gái mạnh mẽ nhưng mang trong mình nhiều tổn thương. Câu chuyện tình yêu giữa Mai và Dương đầy cảm xúc.",
        trailerUrl: "https://youtube.com/watch?v=example3",
        isPublic: true,
        duration: 131,
        releaseDate: "2024-02-10",
    },
    {
        id: 4,
        title: "Lật Mặt 7: Một Điều Ước",
        genres: ["Action", "Comedy"],
        ageRating: "T13",
        director: "Lý Hải",
        actors: "Trấn Thành, Kiều Minh Tuấn, Ốc Thanh Vân",
        status: "Đang chiếu",
        poster: "/images/chuyentausinhtu.jpg",
        backdrop: "/images/chuyentausinhtu.jpg",
        summary: "Phần 7 của loạt phim Lật Mặt với câu chuyện về gia đình, tình bạn và những ước mơ giản dị trong cuộc sống.",
        trailerUrl: "https://youtube.com/watch?v=example4",
        isPublic: true,
        duration: 135,
        releaseDate: "2024-04-26",
    },
    {
        id: 5,
        title: "Chuyện Xóm Tui",
        genres: ["Comedy", "Drama"],
        ageRating: "P",
        director: "Võ Thanh Hòa",
        actors: "Thu Trang, Tiến Luật, Huỳnh Phương",
        status: "Ngừng chiếu",
        poster: "/images/greenbook.jpg",
        backdrop: "/images/greenbook.jpg",
        summary: "Những câu chuyện hài hước và cảm động về cuộc sống hàng ngày của cư dân trong một con xóm nhỏ.",
        trailerUrl: "https://youtube.com/watch?v=example5",
        isPublic: false,
        duration: 110,
        releaseDate: "2023-05-20",
    },
    {
        id: 6,
        title: "Tết Ở Làng Địa Ngục",
        genres: ["Horror", "Thriller"],
        ageRating: "T18",
        director: "Trần Hữu Tấn",
        actors: "Quang Tuấn, Uông Phía Hàm, Nguyễn Thị Phương Thanh",
        status: "Ngừng chiếu",
        poster: "/images/doomday.jpg",
        backdrop: "/images/doomday.jpg",
        summary: "Tết năm ấy, ngôi làng hẻo lánh chìm trong nỗi sợ hãi khi những bí mật kinh hoàng từ quá khứ dần được hé lộ.",
        trailerUrl: "https://youtube.com/watch?v=example6",
        isPublic: false,
        duration: 98,
        releaseDate: "2024-02-09",
    },
    {
        id: 7,
        title: "Quỷ Cẩu",
        genres: ["Horror"],
        ageRating: "T18",
        director: "Lưu Thành Luân",
        actors: "Lâm Thanh Mỹ, Quang Tuấn",
        status: "Ngừng chiếu",
        poster: "/images/Poster_phim_Kỵ_sĩ_bóng_đêm_2008.jpg",
        backdrop: "/images/Poster_phim_Kỵ_sĩ_bóng_đêm_2008.jpg",
        summary: "Câu chuyện rùng rợn về con quỷ cẩu và những hệ lụy khi con người tham lam, phản bội lời thề.",
        trailerUrl: "https://youtube.com/watch?v=example7",
        isPublic: false,
        duration: 105,
        releaseDate: "2023-08-18",
    },
    {
        id: 8,
        title: "Mưa Đỏ",
        genres: ["Action", "Thriller"],
        ageRating: "T16",
        director: "Đỗ Thanh Hải",
        actors: "Hoàng Thùy Linh, Thanh Sơn",
        status: "Sắp chiếu",
        poster: "/images/mưa đỏ.jpg",
        backdrop: "/images/mưa đỏ.jpg",
        summary: "Cuộc chiến sinh tồn giữa lòng thành phố khi một cơn mưa đỏ bí ẩn kéo đến, mang theo nguy hiểm chết người.",
        trailerUrl: "https://youtube.com/watch?v=example8",
        isPublic: true,
        duration: 115,
        releaseDate: "2024-06-01",
    },
];

export const statusConfig: Record<MovieStatus, { color: string; bg: string; glow: string }> = {
    "Đang chiếu": { color: "#2DD4BF", bg: "rgba(45,212,191,0.15)", glow: "rgba(45,212,191,0.4)" },
    "Sắp chiếu": { color: "#60A5FA", bg: "rgba(96,165,250,0.15)", glow: "rgba(96,165,250,0.4)" },
    "Ngừng chiếu": { color: "#8B949E", bg: "rgba(139,148,158,0.15)", glow: "rgba(139,148,158,0.2)" },
};

export const ratingConfig: Record<AgeRating, { color: string; bg: string }> = {
    P: { color: "#2DD4BF", bg: "rgba(45,212,191,0.2)" },
    T13: { color: "#60A5FA", bg: "rgba(96,165,250,0.2)" },
    T16: { color: "#FBBF24", bg: "rgba(251,191,36,0.2)" },
    T18: { color: "#F43F5E", bg: "rgba(244,63,94,0.2)" },
};
