package com.example.THLTW.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "showtimes")
@Data
public class Showtime {
    public Showtime() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    @NotNull(message = "Vui lòng chọn phim cho suất chiếu")
    private Movie movie; // Phim được chiếu
 
    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    @NotNull(message = "Vui lòng chọn phòng cho suất chiếu")
    private Room room; // Phòng chiếu phim
 
    @Column(nullable = false)
    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private LocalDateTime startTime; // Thời gian bắt đầu
 
    @Column(nullable = false)
    @NotNull(message = "Giá vé không được để trống")
    @Min(value = 1000, message = "Giá vé tối thiểu là 1000 VND")
    private Double price;          // Giá vé

    @OneToMany(mappedBy = "showtime", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Booking> bookings;
}