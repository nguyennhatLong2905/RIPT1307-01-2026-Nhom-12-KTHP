package com.example.THLTW.controller;

import com.example.THLTW.entity.Movie;
import com.example.THLTW.entity.Room;
import com.example.THLTW.entity.Showtime;
import com.example.THLTW.entity.User;
import com.example.THLTW.dto.ShowtimeDTO;
import com.example.THLTW.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

// Controller quản trị hệ thống (Dành cho Admin) quản lý Phim, Phòng chiếu, Suất chiếu, Khách hàng và Thống kê
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private ShowtimeService showtimeService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    @Autowired
    private RoomService roomService;

    // ==========================================
    // 1. QUẢN LÝ PHIM (MOVIE MANAGEMENT)
    // ==========================================
    @PostMapping("/movies")
    public Movie addMovie(@RequestBody @Valid Movie movie) {
        return movieService.addMovie(movie);
    }

    @PutMapping("/movies/{id}")
    public ResponseEntity<?> updateMovie(@PathVariable Long id, @RequestBody @Valid Movie movieDetails) {
        movieService.updateMovie(id, movieDetails);
        return ResponseEntity.ok("Cập nhật phim thành công!");
    }

    @DeleteMapping("/movies/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok("Xóa phim thành công!");
    }

    // ==========================================
    // 2. QUẢN LÝ PHÒNG CHIẾU (ROOM MANAGEMENT)
    // ==========================================
    @PostMapping("/rooms")
    public Room addRoom(@RequestBody @Valid Room room) {
        return roomService.addRoom(room);
    }

    @GetMapping("/rooms")
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok("Xóa phòng chiếu thành công!");
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable Long id, @RequestBody @Valid Room roomDetails) {
        roomService.updateRoom(id, roomDetails);
        return ResponseEntity.ok("Cập nhật phòng chiếu thành công!");
    }

    // ==========================================
    // 3. QUẢN LÝ SUẤT CHIẾU (SHOWTIME MANAGEMENT)
    // ==========================================
    @PostMapping("/showtimes")
    public ResponseEntity<?> createShowtime(@RequestBody @Valid ShowtimeDTO dto) {
        Showtime showtime = new Showtime();
        showtime.setStartTime(dto.getStartTime());
        showtime.setPrice(dto.getPrice());
        
        showtimeService.createShowtime(dto.getMovieId(), dto.getRoomId(), showtime);
        return ResponseEntity.ok("Tạo suất chiếu thành công!");
    }

    @GetMapping("/showtimes")
    public List<Showtime> getAllShowtimes() {
        return showtimeService.getAllShowtimes();
    }

    @PutMapping("/showtimes/{id}")
    public ResponseEntity<?> updateShowtime(@PathVariable Long id, @RequestBody @Valid ShowtimeDTO dto) {
        Showtime details = new Showtime();
        details.setStartTime(dto.getStartTime());
        details.setPrice(dto.getPrice());

        showtimeService.updateShowtime(id, dto.getMovieId(), dto.getRoomId(), details);
        return ResponseEntity.ok("Cập nhật suất chiếu thành công!");
    }

    @DeleteMapping("/showtimes/{id}")
    public ResponseEntity<?> deleteShowtime(@PathVariable Long id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.ok("Xóa suất chiếu thành công!");
    }

    // ==========================================
    // 4. QUẢN LÝ KHÁCH HÀNG (USER MANAGEMENT)
    // ==========================================
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllCustomers();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("Xóa người dùng thành công!");
    }

    // ==========================================
    // 5. THỐNG KÊ BÁO CÁO (STATISTICS)
    // ==========================================
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return bookingService.getStatistics();
    }
}