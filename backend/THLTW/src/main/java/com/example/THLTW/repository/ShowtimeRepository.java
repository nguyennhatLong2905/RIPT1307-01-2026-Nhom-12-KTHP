package com.example.THLTW.repository;

import com.example.THLTW.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

// Quản lý dữ liệu suất chiếu
@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    // Tìm danh sách suất chiếu theo ID phim
    List<Showtime> findByMovieId(Long movieId);

    // Tìm tất cả suất chiếu trong cùng phòng và cùng ngày (dùng để kiểm tra xung đột)
    @Query("SELECT s FROM Showtime s WHERE s.room.id = :roomId " +
           "AND CAST(s.startTime AS date) = CAST(:date AS date)")
    List<Showtime> findByRoomIdAndDate(
            @Param("roomId") Long roomId,
            @Param("date") LocalDateTime date);

    // Tìm tất cả suất chiếu trong cùng phòng, cùng ngày, loại trừ một suất chiếu (dùng khi cập nhật)
    @Query("SELECT s FROM Showtime s WHERE s.room.id = :roomId AND s.id != :excludeId " +
           "AND CAST(s.startTime AS date) = CAST(:date AS date)")
    List<Showtime> findByRoomIdAndDateExcluding(
            @Param("roomId") Long roomId,
            @Param("date") LocalDateTime date,
            @Param("excludeId") Long excludeId);
}