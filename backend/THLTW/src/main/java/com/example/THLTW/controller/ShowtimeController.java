package com.example.THLTW.controller;

import com.example.THLTW.entity.Showtime;
import com.example.THLTW.service.ShowtimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// Controller truy xuất dữ liệu Suất chiếu cho Khách hàng
@RestController
@RequestMapping("/api/showtimes")
public class ShowtimeController {

    @Autowired
    private ShowtimeService showtimeService;

    // Lấy toàn bộ suất chiếu của một bộ phim để hiển thị lên lịch chiếu
    @GetMapping("/movie/{movieId}")
    public List<Showtime> getShowtimesByMovie(@PathVariable Long movieId) {
        return showtimeService.getShowtimesByMovie(movieId);
    }
}