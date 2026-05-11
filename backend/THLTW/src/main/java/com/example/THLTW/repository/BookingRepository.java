package com.example.THLTW.repository;

import com.example.THLTW.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

// Quản lý dữ liệu đặt vé
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Kiểm tra ghế đã được đặt hay chưa
    @Query("SELECT (COUNT(b) > 0) FROM Booking b WHERE b.showtime.id = :showtimeId AND b.seatNumbers LIKE CONCAT('%', :seatNumber, '%')")
    boolean checkSeatTaken(@Param("showtimeId") Long showtimeId, @Param("seatNumber") String seatNumber);

    // Tính tổng doanh thu từ tất cả vé
    @Query("SELECT SUM(b.totalAmount) FROM Booking b")
    Double calculateTotalRevenue();

    // Lấy danh sách toàn bộ mã ghế đã đặt cho một suất chiếu
    @Query("SELECT b.seatNumbers FROM Booking b WHERE b.showtime.id = :showtimeId")
    List<String> findSeatNumbersByShowtimeId(@Param("showtimeId") Long showtimeId);

    // Tìm đơn đặt vé theo username
    List<Booking> findByUserUsername(String username);
}