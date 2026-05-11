package com.example.THLTW.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    public User() {
    }

    // Khởi tạo nhanh người dùng
    public User(String username, String password, Role role, String fullName, String email) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.fullName = fullName;
        this.email = email;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Column(unique = true, nullable = false)
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String resetToken;
    private LocalDateTime resetTokenExpiry;

    @ManyToMany
    @JoinTable(
        name = "user_favorites",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "movie_id")
    )
    private java.util.Set<Movie> favoriteMovies = new java.util.HashSet<>();

    public enum Role { // Phân quyền người dùng
        ADMIN, CUSTOMER
    }
}