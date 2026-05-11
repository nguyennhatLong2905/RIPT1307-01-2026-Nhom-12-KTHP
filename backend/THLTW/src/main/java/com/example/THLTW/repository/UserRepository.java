package com.example.THLTW.repository;

import com.example.THLTW.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

// Quản lý dữ liệu người dùng
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Tìm người dùng theo các tiêu chí khác nhau
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String token);
    // Tìm theo vai trò (ADMIN/CUSTOMER)
    List<User> findByRole(User.Role role);
}