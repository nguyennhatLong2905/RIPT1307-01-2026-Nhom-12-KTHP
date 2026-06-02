package com.example.THLTW.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "rooms", uniqueConstraints = {
    @UniqueConstraint(name = "uk_room_name_cinema", columnNames = {"name", "cinema_id"})
})
@Data
public class Room {
    public Room() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên phòng không được để trống")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "Số hàng không được để trống")
    @Min(value = 1, message = "Số hàng phải lớn hơn 0")
    @Max(value = 15, message = "Số hàng tối đa là 15")
    private Integer rowsCount;

    @NotNull(message = "Số cột không được để trống")
    @Min(value = 1, message = "Số cột phải lớn hơn 0")
    @Max(value = 20, message = "Số cột tối đa là 20")
    private Integer colsCount;

    public Integer getTotalSeats() {
        if (rowsCount == null || colsCount == null) return 0;
        return rowsCount * colsCount;
    }

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Showtime> showtimes;

    @ManyToOne
    @JoinColumn(name = "cinema_id")
    @NotNull(message = "Vui lòng chọn rạp cho phòng chiếu")
    private Cinema cinema;
}
