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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public Booking createBooking(Long showtimeId, List<String> seats, String username) {
        // Sử dụng Pessimistic Write Lock để khóa dòng Showtime tránh Race Condition đặt trùng ghế
        Showtime showtime = showtimeRepository.findByIdWithLock(showtimeId)
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

        if (LocalDateTime.now().isAfter(showtime.getStartTime().plusMinutes(30))) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Suất chiếu này đã bắt đầu quá 30 phút, không thể đặt vé nữa!");
        }

        // Kiểm tra trùng ghế chính xác bằng Java thay vì LIKE sql
        List<String> takenSeats = getTakenSeats(showtimeId);
        for (String seat : normalizedSeats) {
            validateSeatLayout(seat, showtime);
            if (takenSeats.contains(seat)) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Ghế " + seat + " đã có người đặt!");
            }
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setShowtime(showtime);
        booking.setSeatNumbers(String.join(", ", normalizedSeats));
        booking.setTotalAmount(showtime.getPrice() * normalizedSeats.size());
        booking.setBookingDate(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        // Gửi email xác nhận đặt vé dạng HTML cao cấp trong luồng nền (Asynchronous)
        try {
            String emailSubject = "Xác nhận đặt vé thành công tại Luxe Cinema - " + showtime.getMovie().getTitle();

            // Định dạng ngày giờ suất chiếu
            java.time.format.DateTimeFormatter timeFormatter = java.time.format.DateTimeFormatter.ofPattern("HH:mm");
            java.time.format.DateTimeFormatter dateFormatter = java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy");
            String startTimeFormattedTime = showtime.getStartTime().format(timeFormatter);
            String startTimeFormattedDate = showtime.getStartTime().format(dateFormatter);

            // Format mã tham chiếu LX-XXXXXX
            String bookingRef = "LX-" + String.format("%06d", savedBooking.getId());

            // Tổng tiền định dạng Việt Nam đồng
            String formattedTotalAmount = String.format("%,.0f VNĐ", savedBooking.getTotalAmount());

            // URL ảnh QR Code dựa trên mã tham chiếu đặt vé
            String qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + bookingRef;

            String htmlContent = "<!DOCTYPE html>" +
                    "<html lang=\"vi\">" +
                    "<head>" +
                    "    <meta charset=\"UTF-8\">" +
                    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                    "    <title>Vé Điện Tử Luxe Cinema</title>" +
                    "</head>" +
                    "<body style=\"margin: 0; padding: 0; background-color: #0f0f11; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;\">" +
                    "    <div style=\"max-width: 480px; margin: 0 auto; background-color: #0f0f11; padding: 40px 15px;\">" +
                    "        " +
                    "        <!-- Luxe Cinema Header Section -->" +
                    "        <div style=\"text-align: center; padding: 10px 0 25px 0;\">" +
                    "            <h1 style=\"font-size: 28px; font-weight: 800; letter-spacing: 0.15em; color: #ffffff; margin: 0; text-transform: uppercase; font-family: 'Segoe UI', Arial, sans-serif;\">LUXE CINEMA</h1>" +
                    "            <p style=\"font-size: 10px; color: #c9a84c; letter-spacing: 0.3em; text-transform: uppercase; margin: 6px 0 0 0; font-family: 'Segoe UI', Arial, sans-serif; font-weight: 600;\">PREMIUM MOVIE EXPERIENCE</p>" +
                    "            <div style=\"border-bottom: 2px solid #c9a84c; width: 100%; margin-top: 25px; margin-bottom: 30px; font-size: 1px; line-height: 1px;\">&nbsp;</div>" +
                    "        </div>" +
                    "        " +
                    "        <!-- Welcome Salutation Section -->" +
                    "        <div style=\"text-align: left; margin-bottom: 30px; padding: 0 5px;\">" +
                    "            <h3 style=\"font-size: 18px; font-weight: 400; color: #ffffff; margin: 0 0 15px 0; font-family: 'Segoe UI', Arial, sans-serif;\">" +
                    "                Xin chào <strong style=\"color: #c9a84c; font-weight: 700;\">" + user.getFullName() + "</strong>," +
                    "            </h3>" +
                    "            <p style=\"font-size: 15px; font-weight: 300; color: #e5e5e7; line-height: 1.6; font-family: 'Segoe UI', Arial, sans-serif; margin: 0;\">" +
                    "                Cảm ơn bạn đã tin tưởng đặt vé tại <strong>Luxe Cinema</strong>. Giao dịch của bạn đã được xác nhận thành công. Dưới đây là thông tin vé xem phim của bạn:" +
                    "            </p>" +
                    "        </div>" +
                    "        " +
                    "        <!-- Ticket Main Box -->" +
                    "        <div style=\"width: 100%; border-radius: 35px; overflow: hidden; background-color: #f4f5f8; box-shadow: 0 20px 50px rgba(0,0,0,0.5);\">" +
                    "            " +
                    "            <!-- Top Banner Image -->" +
                    "            <div style=\"position: relative; width: 100%; height: 230px; background-color: #1a1a1f; overflow: hidden; border-top-left-radius: 35px; border-top-right-radius: 35px;\">" +
                    "                <img src=\"" + showtime.getMovie().getPosterUrl() + "\" style=\"width: 100%; height: 230px; object-fit: cover; border-top-left-radius: 35px; border-top-right-radius: 35px;\" alt=\"" + showtime.getMovie().getTitle() + "\" />" +
                    "                <div style=\"position: absolute; top: 20px; right: 20px; background-color: rgba(15,15,17,0.75); color: #c9a84c; border-radius: 6px; padding: 6px 12px; font-size: 10px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase; font-family: 'Segoe UI', Arial, sans-serif;\">PREMIUM</div>" +
                    "            </div>" +
                    "            " +
                    "            <!-- Info Area (Top Half) -->" +
                    "            <div style=\"padding: 30px 35px 25px 35px;\">" +
                    "                <div style=\"color: #8b8d99; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 6px; font-family: 'Segoe UI', Arial, sans-serif;\">MOVIE SELECTION</div>" +
                    "                <h2 style=\"color: #0b0c10; font-size: 24px; font-weight: 800; margin: 0 0 30px 0; text-transform: uppercase; font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif; line-height: 1.2;\">" + showtime.getMovie().getTitle() + "</h2>" +
                    "                " +
                    "                <!-- 2x2 Grid -->" +
                    "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\">" +
                    "                    <tr>" +
                    "                        <td width=\"50%\" style=\"padding-bottom: 25px; padding-right: 10px; vertical-align: top;\">" +
                    "                            <div style=\"color: #8b8d99; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; font-family: 'Segoe UI', Arial, sans-serif;\">LOCATION</div>" +
                    "                            <div style=\"color: #0b0c10; font-size: 14px; font-weight: 700; font-family: 'Segoe UI', Arial, sans-serif; text-transform: uppercase;\">" + showtime.getRoom().getName() + "</div>" +
                    "                            <div style=\"color: #8b8d99; font-size: 11px; margin-top: 2px; font-weight: 500; font-family: 'Segoe UI', Arial, sans-serif; text-transform: uppercase;\">" + showtime.getRoom().getCinema().getName() + "</div>" +
                    "                        </td>" +
                    "                        <td width=\"50%\" style=\"padding-bottom: 25px; padding-left: 10px; vertical-align: top;\">" +
                    "                            <div style=\"color: #8b8d99; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; font-family: 'Segoe UI', Arial, sans-serif;\">SHOWTIME</div>" +
                    "                            <div style=\"color: #0b0c10; font-size: 14px; font-weight: 700; font-family: 'Segoe UI', Arial, sans-serif;\">" + startTimeFormattedTime + "</div>" +
                    "                            <div style=\"color: #8b8d99; font-size: 11px; margin-top: 2px; font-weight: 500; font-family: 'Segoe UI', Arial, sans-serif;\">" + startTimeFormattedDate + "</div>" +
                    "                        </td>" +
                    "                    </tr>" +
                    "                    <tr>" +
                    "                        <td width=\"50%\" style=\"vertical-align: top; padding-right: 10px;\">" +
                    "                            <div style=\"color: #8b8d99; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; font-family: 'Segoe UI', Arial, sans-serif;\">SEATS</div>" +
                    "                            <div style=\"color: #0b0c10; font-size: 14px; font-weight: 700; font-family: 'Segoe UI', Arial, sans-serif; text-transform: uppercase;\">" + savedBooking.getSeatNumbers() + "</div>" +
                    "                        </td>" +
                    "                        <td width=\"50%\" style=\"vertical-align: top; padding-left: 10px;\">" +
                    "                            <div style=\"color: #8b8d99; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; font-family: 'Segoe UI', Arial, sans-serif;\">BOOKING REF</div>" +
                    "                            <div style=\"color: #0b0c10; font-size: 14px; font-weight: 700; font-family: 'Segoe UI', Arial, sans-serif; text-transform: uppercase;\">" + bookingRef + "</div>" +
                    "                        </td>" +
                    "                    </tr>" +
                    "                </table>" +
                    "                " +
                    "                <!-- Sleek customer + amount bar -->" +
                    "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"margin-top: 25px; border-top: 1px solid #e5e7eb; padding-top: 15px;\">" +
                    "                    <tr>" +
                    "                        <td align=\"left\" style=\"vertical-align: middle;\">" +
                    "                            <div style=\"color: #8b8d99; font-size: 9px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; font-family: 'Segoe UI', Arial, sans-serif;\">KHÁCH HÀNG</div>" +
                    "                            <div style=\"color: #0b0c10; font-size: 13px; font-weight: 700; margin-top: 2px; font-family: 'Segoe UI', Arial, sans-serif;\">" + user.getFullName() + "</div>" +
                    "                        </td>" +
                    "                        <td align=\"right\" style=\"vertical-align: middle;\">" +
                    "                            <div style=\"color: #8b8d99; font-size: 9px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; font-family: 'Segoe UI', Arial, sans-serif;\">TỔNG TIỀN</div>" +
                    "                            <div style=\"color: #c9a84c; font-size: 16px; font-weight: 800; margin-top: 2px; font-family: 'Segoe UI', Arial, sans-serif;\">" + formattedTotalAmount + "</div>" +
                    "                        </td>" +
                    "                    </tr>" +
                    "                </table>" +
                    "            </div>" +
                    "            " +
                    "            <!-- Perforated Tear Line -->" +
                    "            <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"background-color: #f4f5f8;\">" +
                    "                <tr>" +
                    "                    <td width=\"15\" height=\"30\" style=\"background-color: #0f0f11; border-top-right-radius: 15px; border-bottom-right-radius: 15px; font-size: 1px; line-height: 1px;\">&nbsp;</td>" +
                    "                    <td style=\"vertical-align: middle; padding: 0 10px;\">" +
                    "                        <div style=\"border-top: 2px dashed #d1d5db; height: 1px; font-size: 1px; line-height: 1px;\">&nbsp;</div>" +
                    "                    </td>" +
                    "                    <td width=\"15\" height=\"30\" style=\"background-color: #0f0f11; border-top-left-radius: 15px; border-bottom-left-radius: 15px; font-size: 1px; line-height: 1px;\">&nbsp;</td>" +
                    "                </tr>" +
                    "            </table>" +
                    "            " +
                    "            <!-- QR Code Area (Bottom Half) -->" +
                    "            <div style=\"padding: 25px 35px 35px 35px; text-align: center; border-bottom-left-radius: 35px; border-bottom-right-radius: 35px;\">" +
                    "                <div style=\"display: inline-block; background-color: #ffffff; padding: 15px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); margin-bottom: 20px;\">" +
                    "                    <img src=\"" + qrCodeUrl + "\" width=\"160\" height=\"160\" style=\"display: block; border-radius: 10px; border: none;\" alt=\"QR Code\" />" +
                    "                </div>" +
                    "                <div style=\"color: #5b6b85; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.5; margin-top: 10px;\">" +
                    "                    SCAN THIS CODE AT<br>THE CINEMA ENTRANCE" +
                    "                </div>" +
                    "            </div>" +
                    "            " +
                    "        </div>" +
                    "        " +
                    "        <!-- Footer Info -->" +
                    "        <div style=\"text-align: center; font-size: 11px; color: #51515c; line-height: 1.8; margin-top: 30px; padding: 0 10px; font-family: 'Segoe UI', Arial, sans-serif;\">" +
                    "            Bản quyền thuộc về <strong>Luxe Cinema</strong> © 2026.<br>" +
                    "            Email này được gửi tự động. Vui lòng xuất trình mã QR này tại quầy để nhận vé cứng vào phòng chiếu." +
                    "        </div>" +
                    "    </div>" +
                    "</body>" +
                    "</html>";

            emailService.sendHtmlEmail(user.getEmail(), emailSubject, htmlContent);
        } catch (Exception e) {
            System.err.println("Không thể gửi email xác nhận đặt vé trong nền: " + e.getMessage());
        }

        return savedBooking;
    }

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

    public List<Booking> getMyBookings(String username) {
        return bookingRepository.findByUserUsername(username);
    }
    public Booking getBookingById(Long bookingId, String username) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn đặt vé"));

        if (!booking.getUser().getUsername().equals(username)) {
            throw new AppException(HttpStatus.FORBIDDEN, "Bạn không có quyền xem đơn vé này!");
        }

        return booking;
    }

    public void cancelBooking(Long bookingId, String username) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn đặt vé"));
        if (booking.getUser().getUsername().equals(username)) {
            if (LocalDateTime.now().isAfter(booking.getShowtime().getStartTime())) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Không thể hủy vé cho suất chiếu đã bắt đầu!");
            }
            bookingRepository.delete(booking);
            return;
        }

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng!"));

        if (currentUser.getRole() == User.Role.ADMIN) {
            bookingRepository.delete(booking);
        } else {
            throw new AppException(HttpStatus.FORBIDDEN, "Bạn không có quyền hủy đơn vé này!");
        }
    }

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("tongSoVe", bookingRepository.count());
        stats.put("doanhThu", bookingRepository.calculateTotalRevenue());
        stats.put("lichSuDatVe", bookingRepository.findAll());

        return stats;
    }

    private void validateSeatLayout(String seat, Showtime showtime) {
        if (seat == null || seat.length() < 2) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Định dạng mã ghế " + seat + " không hợp lệ!");
        }

        char rowChar = Character.toUpperCase(seat.charAt(0));
        int rowNumber = rowChar - 'A' + 1;

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