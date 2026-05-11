package com.example.THLTW.service;

import com.example.THLTW.dto.LoginRequest;
import com.example.THLTW.entity.User;
import com.example.THLTW.exception.AppException;
import com.example.THLTW.repository.UserRepository;
import com.example.THLTW.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

// Service quản lý Tài khoản Người dùng và Bảo mật
@Service
public class UserService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(User.Role.CUSTOMER);
        
        return userRepository.save(user);
    }

    public String login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(HttpStatus.UNAUTHORIZED, "Sai tên đăng nhập hoặc mật khẩu"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(HttpStatus.UNAUTHORIZED, "Sai tên đăng nhập hoặc mật khẩu");
        }

        return jwtUtils.generateToken(user.getUsername(), user.getRole().name());
    }

    public List<User> getAllCustomers() {
        return userRepository.findByRole(User.Role.CUSTOMER);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // ==========================================
    // QUẢN LÝ THÔNG TIN CÁ NHÂN (PROFILE)
    // ==========================================

    public User getProfile(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng!"));
    }

    public User updateProfile(String username, User updatedInfo) {
        User user = getProfile(username);
        
        user.setFullName(updatedInfo.getFullName());
        user.setEmail(updatedInfo.getEmail());
        user.setPhone(updatedInfo.getPhone());
        
        return userRepository.save(user);
    }

    public void changePassword(String username, String oldPassword, String newPassword) {
        User user = getProfile(username);
        
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không chính xác!");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // Xử lý yêu cầu quên mật khẩu (Tạo mã OTP ngẫu nhiên)
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Email không tồn tại!"));

        String token = String.format("%06d", new java.util.Random().nextInt(999999));
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        emailService.sendEmail(user.getEmail(), "Mã khôi phục mật khẩu", 
                "Chào " + user.getFullName() + ",\n\nMã khôi phục mật khẩu của bạn là: " + token + 
                "\n\nMã này có hiệu lực trong 15 phút.");
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new AppException(HttpStatus.BAD_REQUEST, "Mã không hợp lệ!"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new AppException(HttpStatus.BAD_REQUEST, "Mã đã hết hạn!");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}