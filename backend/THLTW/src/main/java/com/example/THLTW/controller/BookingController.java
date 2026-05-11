package com.example.THLTW.controller;

import com.example.THLTW.entity.Booking;
import com.example.THLTW.exception.AppException;
import com.example.THLTW.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

// Controller quản lý luồng Đặt vé: đặt ghế, xem lịch sử và hủy vé
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Thực hiện giao dịch đặt vé cho một suất chiếu cụ thể
    @PostMapping("/showtime/{showtimeId}")
    public Booking bookTickets(
            @PathVariable Long showtimeId,
            @RequestBody List<String> seats,
            Principal principal) {

        if (principal == null) throw new AppException(HttpStatus.UNAUTHORIZED, "Bạn cần đăng nhập để đặt vé");
        String username = principal.getName();

        return bookingService.createBooking(showtimeId, seats, username);
    }

    // Lấy danh sách các ghế đã được đặt cho một suất chiếu cụ thể
    @GetMapping("/showtime/{showtimeId}/seats")
    public List<String> getTakenSeats(@PathVariable Long showtimeId) {
        return bookingService.getTakenSeats(showtimeId);
    }

    // Truy xuất danh sách lịch sử vé đã đặt của tài khoản đang đăng nhập
    @GetMapping({"/my-history", "/history"})
    public List<Booking> getMyHistory(Principal principal) {
        if (principal == null) throw new AppException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập");
        return bookingService.getMyBookings(principal.getName());
    }

    // Lấy chi tiết một đơn đặt vé theo ID
    @GetMapping("/{id:\\d+}")
    public Booking getBookingById(@PathVariable Long id, Principal principal) {
        if (principal == null) throw new AppException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập");
        return bookingService.getBookingById(id, principal.getName());
    }

    // Hủy một đơn đặt vé
    @DeleteMapping("/{id:\\d+}")
    public String cancelBooking(@PathVariable Long id, Principal principal) {
        if (principal == null) throw new AppException(HttpStatus.UNAUTHORIZED, "Bạn cần đăng nhập để hủy vé");
        bookingService.cancelBooking(id, principal.getName());
        return "Đã hủy vé thành công!";
    }
}