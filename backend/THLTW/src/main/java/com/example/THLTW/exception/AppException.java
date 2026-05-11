package com.example.THLTW.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

// Ngoại lệ tùy chỉnh cho các lỗi nghiệp vụ của ứng dụng
@Getter
public class AppException extends RuntimeException {
    private final HttpStatus status;

    public AppException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public AppException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }
}
