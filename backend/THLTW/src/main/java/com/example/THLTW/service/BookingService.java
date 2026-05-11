package com.example.THLTW.service;

import com.example.THLTW.entity.Booking;
import com.example.THLTW.entity.Showtime;
import com.example.THLTW.entity.User;
import com.example.THLTW.exception.AppException;
import com.example.THLTW.repository.BookingRepository;
import com.example.THLTW.repository.ShowtimeRepository;
import com.example.THLTW.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

// Service xử lý nghiệp vụ Đặt vé (Booking) và Thống kê doanh thu
@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private UserRepository userRepository;

    // Xử lý giao dịch đặt vé mới, kiểm tra ghế trống và tính tiền
    public Booking createBooking(Long showtimeId, List<String> seats, String username) {
        Showtime showtime = showtimeRepository.findById(showtimeId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy suất chiếu!"));
                
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng!"));

        if (seats == null || seats.isEmpty()) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Vui lòng chọn ít nhất 1 ghế!");
        }

        List<String> normalizedSeats = seats.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .distinct()
                .toList();

        for (String seat : normalizedSeats) {
            validateSeatLayout(seat, showtime);
            if (bookingRepository.checkSeatTaken(showtimeId, seat)) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Ghế " + seat + " đã có người đặt!");
            }
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShowtime(showtime);
        booking.setSeatNumbers(String.join(", ", normalizedSeats));
        booking.setTotalAmount(showtime.getPrice() * normalizedSeats.size());
        booking.setBookingDate(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    // Lấy danh sách các ghế đã được đặt cho một suất chiếu (trả về List phẳng)
    public List<String> getTakenSeats(Long showtimeId) {
        List<String> combinedSeats = bookingRepository.findSeatNumbersByShowtimeId(showtimeId);
        List<String> allSeats = new ArrayList<>();
        
        for (String seats : combinedSeats) {
            if (seats != null) {
                String[] split = seats.split(", ");
                allSeats.addAll(Arrays.asList(split));
            }
        }
        return allSeats;
    }

    // Truy xuất toàn bộ lịch sử đặt vé của một khách hàng cụ thể
    public List<Booking> getMyBookings(String username) {
        return bookingRepository.findByUserUsername(username);
    }

    // Lấy chi tiết một đơn đặt vé, kiểm tra quyền sở hữu
    public Booking getBookingById(Long bookingId, String username) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn đặt vé"));

        if (!booking.getUser().getUsername().equals(username)) {
            throw new AppException(HttpStatus.FORBIDDEN, "Bạn không có quyền xem đơn vé này!");
        }

        return booking;
    }

    // Xử lý hủy đơn vé, kiểm tra quyền sở hữu hoặc quyền Admin
    public void cancelBooking(Long bookingId, String username) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn đặt vé"));

        // 1. Nếu là chủ sở hữu vé thì cho phép xóa luôn
        if (booking.getUser().getUsername().equals(username)) {
            bookingRepository.delete(booking);
            return;
        }

        // 2. Nếu không phải chủ sở hữu, kiểm tra xem có phải Admin không
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng!"));

        if (currentUser.getRole() == User.Role.ADMIN) {
            bookingRepository.delete(booking);
        } else {
            throw new AppException(HttpStatus.FORBIDDEN, "Bạn không có quyền hủy đơn vé này!");
        }
    }

    // Tổng hợp số liệu hệ thống (Tổng vé, Tổng doanh thu) cho Admin
    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("tongSoVe", bookingRepository.count());
        stats.put("doanhThu", bookingRepository.calculateTotalRevenue());
        stats.put("lichSuDatVe", bookingRepository.findAll());
        
        return stats;
    }

    // Xác thực chuỗi mã ghế nhập vào (VD: A1, B5) có hợp lệ không
    private void validateSeatLayout(String seat, Showtime showtime) {
        if (seat == null || seat.length() < 2) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Định dạng mã ghế " + seat + " không hợp lệ!");
        }

        char rowChar = Character.toUpperCase(seat.charAt(0));
        int rowNumber = rowChar - 'A' + 1; // Chuyển A->1, B->2...

        int colNumber;
        try {
            colNumber = Integer.parseInt(seat.substring(1));
        } catch (NumberFormatException e) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Số thứ tự ghế trong mã " + seat + " phải là số!");
        }

        int maxRows = showtime.getRoom().getRowsCount();
        int maxCols = showtime.getRoom().getColsCount();

        if (rowNumber < 1 || rowNumber > maxRows || colNumber < 1 || colNumber > maxCols) {
            throw new AppException(HttpStatus.BAD_REQUEST, 
                String.format("Ghế %s không tồn tại trong phòng %s (Tối đa %d hàng, %d cột)", 
                    seat, showtime.getRoom().getName(), maxRows, maxCols));
        }
    }
}