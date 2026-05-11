package com.example.THLTW.entity;

import jakarta.persistence.*;
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
    private Movie movie; // Phim được chiếu

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room; // Phòng chiếu phim

    @Column(nullable = false)
    private LocalDateTime startTime; // Thời gian bắt đầu

    @Column(nullable = false)
    private Double price;          // Giá vé

    @OneToMany(mappedBy = "showtime", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Booking> bookings;
}