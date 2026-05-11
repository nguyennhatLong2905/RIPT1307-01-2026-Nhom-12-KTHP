package com.example.THLTW.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

// Tiện ích hỗ trợ tạo và kiểm tra tính hợp lệ của JWT Token
@Component
public class JwtUtils {

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256); // Khóa ký mã hóa
    private final long expirationMs = 86400000; // Thời hạn Token (24 giờ)

    // Tạo JWT Token cho người dùng
    public String generateToken(String username, String role) {
        return Jwts.builder().setSubject(username).claim("role", role).setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + expirationMs)).signWith(key).compact();
    }

    // Trích xuất thông tin (Claims) từ token
    public Claims getClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }

    // Kiểm tra token có hợp lệ không
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}