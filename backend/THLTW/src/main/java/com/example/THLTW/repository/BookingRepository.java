package com.example.THLTW.repository;

import com.example.THLTW.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT (COUNT(b) > 0) FROM Booking b WHERE b.showtime.id = :showtimeId AND b.seatNumbers LIKE CONCAT('%', :seatNumber, '%')")
    boolean checkSeatTaken(@Param("showtimeId") Long showtimeId, @Param("seatNumber") String seatNumber);

    @Query("SELECT SUM(b.totalAmount) FROM Booking b")
    Double calculateTotalRevenue();

    @Query("SELECT b.seatNumbers FROM Booking b WHERE b.showtime.id = :showtimeId")
    List<String> findSeatNumbersByShowtimeId(@Param("showtimeId") Long showtimeId);

    List<Booking> findByUserUsername(String username);

    @Query(value = "SELECT DATE_FORMAT(booking_date, '%Y-%m') as month, SUM(total_amount) as total FROM bookings GROUP BY month ORDER BY month DESC LIMIT 6", nativeQuery = true)
    List<Object[]> getMonthlyRevenue();

    List<Booking> findTop5ByOrderByIdDesc();

    List<Booking> findTop100ByOrderByIdDesc();

    List<Booking> findAllByOrderByIdDesc();
}