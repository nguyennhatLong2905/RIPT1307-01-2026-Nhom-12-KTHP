package com.example.THLTW.controller;

import com.example.THLTW.entity.User;
import com.example.THLTW.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Profile
    @GetMapping("/profile")
    public User getProfile(Principal principal) {
        return userService.getProfile(principal.getName());
    }

    // Cập nhật thông tin tài khoản
    @PutMapping("/profile")
    public User updateProfile(@RequestBody @Valid User updatedInfo, Principal principal) {
        return userService.updateProfile(principal.getName(), updatedInfo);
    }

    // Đổi mật khẩu
    @PutMapping("/change-password")
    public String changePassword(@RequestBody Map<String, String> passwords, Principal principal) {
        String oldPassword = passwords.get("oldPassword");
        String newPassword = passwords.get("newPassword");
        
        userService.changePassword(principal.getName(), oldPassword, newPassword);
        return "Đổi mật khẩu thành công!";
    }
}
