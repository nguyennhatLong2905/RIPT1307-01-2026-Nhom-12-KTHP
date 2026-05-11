package com.example.THLTW.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

// DTO dùng để tạo hoặc cập nhật Suất chiếu
@Data
public class ShowtimeDTO {
    @NotNull(message = "ID phim không được để trống")
    private Long movieId;           // ID phim
    
    @NotNull(message = "ID phòng chiếu không được để trống")
    private Long roomId;            // ID phòng chiếu
    
    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private LocalDateTime startTime; // Giờ chiếu
    
    @NotNull(message = "Giá vé không được để trống")
    @Min(value = 0, message = "Giá vé không được âm")
    private Double price;           // Giá vé
}