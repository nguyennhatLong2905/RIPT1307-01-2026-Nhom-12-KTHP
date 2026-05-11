package com.example.THLTW.controller;

import com.example.THLTW.entity.Movie;
import com.example.THLTW.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// Controller cung cấp các API hiển thị dữ liệu Phim và thuật toán gợi ý (AI Pick) cho Khách hàng
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    // Lấy danh sách toàn bộ phim đang chiếu
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    // Thuật toán AI gợi ý phim dựa trên danh sách thể loại (Genres) yêu thích
    @GetMapping("/ai-pick")
    public List<Movie> getAIPick(@RequestParam(required = false) List<String> genres) {
        return movieService.getAIPick(genres);
    }

    // Thuật toán AI cá nhân hóa: phân tích lịch sử vé để gợi ý phim
    @GetMapping("/my-ai-pick")
    public List<Movie> getMyAIPick(java.security.Principal principal) {
        return movieService.getPersonalizedAIPick(principal.getName());
    }
}