package com.example.THLTW.repository;

import com.example.THLTW.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Quản lý dữ liệu phim
@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
}
