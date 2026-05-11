package com.example.THLTW.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;

@Entity
@Table(name = "movies")
@Data
public class Movie {
    public Movie() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tiêu đề phim không được để trống")
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    @NotBlank(message = "Đạo diễn không được để trống")
    private String director;
    
    @NotBlank(message = "Thể loại không được để trống")
    private String genre;
    
    @NotNull(message = "Thời lượng phim không được để trống")
    @Min(value = 1, message = "Thời lượng phim phải lớn hơn 0")
    private Integer duration;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Showtime> showtimes;

    private LocalDate releaseDate;
    private String posterUrl;
    @Column(length = 500)
    private String trailerUrl;
}