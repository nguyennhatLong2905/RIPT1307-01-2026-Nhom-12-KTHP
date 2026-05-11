package com.example.THLTW.exception;

import lombok.Data;
import java.time.LocalDateTime;

// Cấu trúc dữ liệu phản hồi lỗi trả về cho Client
@Data
public class ErrorResponse {
    public ErrorResponse() {
    }

    // Khởi tạo nhanh phản hồi lỗi
    public ErrorResponse(LocalDateTime timestamp, int status, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
}
