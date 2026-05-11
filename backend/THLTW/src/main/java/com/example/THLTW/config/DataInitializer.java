package com.example.THLTW.config;

import com.example.THLTW.entity.User;
import com.example.THLTW.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

// Tự động khởi tạo dữ liệu mẫu (Tài khoản Admin) khi khởi chạy ứng dụng
@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
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
    }
}