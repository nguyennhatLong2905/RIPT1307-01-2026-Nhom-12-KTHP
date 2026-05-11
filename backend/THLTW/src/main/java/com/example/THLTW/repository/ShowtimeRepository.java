package com.example.THLTW.repository;

import com.example.THLTW.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

// Quản lý dữ liệu suất chiếu
@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    // Tìm danh sách suất chiếu theo ID phim
    List<Showtime> findByMovieId(Long movieId);
}