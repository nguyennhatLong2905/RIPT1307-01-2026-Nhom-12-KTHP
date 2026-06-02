package com.example.THLTW.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "cinemas")
@Data
public class Cinema {
    public Cinema() {}

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tên rạp không được để trống")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Địa chỉ không được để trống")
    @Column(nullable = false)
    private String address;

    @NotBlank(message = "URL hình ảnh không được để trống")
    private String imageUrl;

    @NotBlank(message = "Mô tả không được để trống")
    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "cinema", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Room> rooms;
}
