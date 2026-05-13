package com.example.THLTW.config;

import com.example.THLTW.entity.Cinema;
import com.example.THLTW.entity.User;
import com.example.THLTW.repository.CinemaRepository;
import com.example.THLTW.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// Tự động khởi tạo dữ liệu mẫu (Tài khoản Admin và Rạp mặc định) khi khởi chạy ứng dụng
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CinemaRepository cinemaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Tạo tài khoản Admin mặc định
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User(
                    "admin",
                    passwordEncoder.encode("123456"),
                    User.Role.ADMIN,
                    "Quản trị viên",
                    "admin@cinema.com"
            );
            userRepository.save(admin);
            System.out.println(">>> Đã tạo Admin (admin/123456)");
        }

        // Tạo rạp mẫu nếu chưa có rạp nào
        if (cinemaRepository.count() == 0) {
            Cinema defaultCinema = new Cinema();
            defaultCinema.setName("Luxe Cinema Central");
            defaultCinema.setAddress("702 Nguyễn Văn Linh, Quận 7, TP.HCM");
            defaultCinema.setDescription("Trụ sở chính của hệ thống rạp Luxe Cinema.");
            cinemaRepository.save(defaultCinema);
            System.out.println(">>> Đã tạo rạp mẫu: Luxe Cinema Central");
        }
    }
}