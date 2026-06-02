package com.example.THLTW.controller;

import com.example.THLTW.entity.Movie;
import com.example.THLTW.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    // Lấy toàn bộ phim
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    // AI gợi ý phim dựa trên thể loại
    @GetMapping("/ai-pick")
    public List<Movie> getAIPick(@RequestParam(required = false) List<String> genres) {
        return movieService.getAIPick(genres);
    }

    // AI gợi ý phim dựa trên lịch sử vé
    @GetMapping("/my-ai-pick")
    public List<Movie> getMyAIPick(java.security.Principal principal) {
        return movieService.getPersonalizedAIPick(principal.getName());
    }
}