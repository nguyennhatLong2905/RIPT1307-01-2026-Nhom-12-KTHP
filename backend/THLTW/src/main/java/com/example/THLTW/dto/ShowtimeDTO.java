package com.example.THLTW.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ShowtimeDTO {
    @NotNull(message = "ID phim không được để trống")
    private Long movieId;
    
    @NotNull(message = "ID phòng chiếu không được để trống")
    private Long roomId;
    
    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private LocalDateTime startTime;
    
    @NotNull(message = "Giá vé không được để trống")
    @Min(value = 0, message = "Giá vé không được âm")
    private Double price;
}