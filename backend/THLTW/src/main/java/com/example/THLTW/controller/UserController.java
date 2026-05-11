package com.example.THLTW.controller;

import com.example.THLTW.entity.User;
import com.example.THLTW.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

// Controller quản lý Thông tin cá nhân, cập nhật hồ sơ và đổi mật khẩu an toàn
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Xem thông tin hồ sơ của tài khoản đang đăng nhập
    @GetMapping("/profile")
    public User getProfile(Principal principal) {
        return userService.getProfile(principal.getName());
    }

    // Cập nhật thông tin cá nhân (Tên, SDT...)
    @PutMapping("/profile")
    public User updateProfile(@RequestBody @Valid User updatedInfo, Principal principal) {
        return userService.updateProfile(principal.getName(), updatedInfo);
    }

    // Đổi mật khẩu tài khoản
    @PutMapping("/change-password")
    public String changePassword(@RequestBody Map<String, String> passwords, Principal principal) {
        String oldPassword = passwords.get("oldPassword");
        String newPassword = passwords.get("newPassword");
        
        userService.changePassword(principal.getName(), oldPassword, newPassword);
        return "Đổi mật khẩu thành công!";
    }
}
