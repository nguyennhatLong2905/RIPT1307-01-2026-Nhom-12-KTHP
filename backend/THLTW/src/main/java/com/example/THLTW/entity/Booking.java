package com.example.THLTW.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    public Booking() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "showtime_id", nullable = false)
    private Showtime showtime;

    private String seatNumbers;
    private Double totalAmount;
    private LocalDateTime bookingDate;

    @PrePersist
    protected void onCreate() {
        bookingDate = LocalDateTime.now(); // Tự động đặt ngày đặt vé
    }
}