package com.example.THLTW.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

// Bộ lọc (Filter) kiểm tra tính hợp lệ của JWT Token trong mỗi yêu cầu gửi lên
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization"); // Lấy mã Token từ Header HTTP

        // Kiểm tra xem header có chứa Token không (Bearer <token>)
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            // Nếu Token hợp lệ, tiến hành trích xuất thông tin
            if (jwtUtils.validateToken(token)) {
                Claims claims = jwtUtils.getClaims(token);
                String username = claims.getSubject();
                String role = claims.get("role", String.class);

                // Đăng ký thông tin người dùng vào hệ thống bảo mật của Spring
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        username, 
                        null, 
                        Collections.singletonList(new SimpleGrantedAuthority(role))
                );

                SecurityContextHolder.getContext().setAuthentication(auth); // Lưu trạng thái đăng nhập công khai
            }
        }

        // Chuyển tiếp request sang filter tiếp theo
        filterChain.doFilter(request, response);
    }
}