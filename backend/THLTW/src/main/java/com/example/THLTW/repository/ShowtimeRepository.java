package com.example.THLTW.repository;

import com.example.THLTW.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {

    @Query("SELECT s FROM Showtime s LEFT JOIN FETCH s.movie LEFT JOIN FETCH s.room r LEFT JOIN FETCH r.cinema WHERE s.movie.id = :movieId")
    List<Showtime> findByMovieIdWithDetails(@Param("movieId") Long movieId);

    @Query("SELECT s FROM Showtime s LEFT JOIN FETCH s.movie LEFT JOIN FETCH s.room r LEFT JOIN FETCH r.cinema")
    List<Showtime> findAllWithDetails();

    @Query("SELECT s FROM Showtime s LEFT JOIN FETCH s.movie LEFT JOIN FETCH s.room r LEFT JOIN FETCH r.cinema WHERE s.id = :id")
    java.util.Optional<Showtime> findByIdWithDetails(@Param("id") Long id);

    @org.springframework.data.jpa.repository.Lock(jakarta.persistence.LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Showtime s WHERE s.id = :id")
    java.util.Optional<Showtime> findByIdWithLock(@Param("id") Long id);

    @Query("SELECT s FROM Showtime s WHERE s.room.id = :roomId " +
           "AND CAST(s.startTime AS date) = CAST(:date AS date)")
    List<Showtime> findByRoomIdAndDate(
            @Param("roomId") Long roomId,
            @Param("date") LocalDateTime date);

    @Query("SELECT s FROM Showtime s WHERE s.room.id = :roomId AND s.id != :excludeId " +
           "AND CAST(s.startTime AS date) = CAST(:date AS date)")
    List<Showtime> findByRoomIdAndDateExcluding(
            @Param("roomId") Long roomId,
            @Param("date") LocalDateTime date,
            @Param("excludeId") Long excludeId);
}