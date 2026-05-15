package com.example.THLTW.controller;

import com.example.THLTW.dto.LoginRequest;
import com.example.THLTW.entity.User;
import com.example.THLTW.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // Đăng ký tài khoản
    @PostMapping("/register")
    public User register(@RequestBody @Valid User user) {
        return userService.register(user);
    }

    // Đăng nhập
    @PostMapping("/login")
    public String login(@RequestBody @Valid LoginRequest request) {
        return userService.login(request);
    }

    // Quên mật khẩu
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody Map<String, String> request) {
        userService.forgotPassword(request.get("email"));
        return "Yêu cầu khôi phục đã được gửi vào email!";
    }

    // Đặt lại mật khẩu
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody Map<String, String> request) {
        userService.resetPassword(request.get("token"), request.get("newPassword"));
        return "Mật khẩu đã được cập nhật!";
    }
}