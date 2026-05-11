package com.example.THLTW.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "rooms")
@Data
public class Room {
    public Room() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên phòng không được để trống")
    @Column(nullable = false, unique = true)
    private String name;

    @NotNull(message = "Số hàng không được để trống")
    @Min(value = 1, message = "Số hàng phải lớn hơn 0")
    private Integer rowsCount;

    @NotNull(message = "Số cột không được để trống")
    @Min(value = 1, message = "Số cột phải lớn hơn 0")
    private Integer colsCount;

    public Integer getTotalSeats() { // Tính tổng số ghế trong phòng
        if (rowsCount == null || colsCount == null) return 0;
        return rowsCount * colsCount;
    }

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Showtime> showtimes;
}
