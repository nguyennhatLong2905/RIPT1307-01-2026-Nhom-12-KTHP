package com.example.THLTW.controller;

import com.example.THLTW.entity.Cinema;
import com.example.THLTW.service.CinemaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/cinemas")
public class CinemaController {

    @Autowired
    private CinemaService cinemaService;

    @GetMapping
    public List<Cinema> getAllCinemas() {
        return cinemaService.getAllCinemas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cinema> getCinemaById(@PathVariable Long id) {
        Cinema cinema = cinemaService.getCinemaById(id);
        return cinema != null ? ResponseEntity.ok(cinema) : ResponseEntity.notFound().build();
    }

    @PostMapping
    @CacheEvict(value = "cinemas", allEntries = true)
    public Cinema createCinema(@RequestBody @Valid Cinema cinema) {
        return cinemaService.saveCinema(cinema);
    }

    @PutMapping("/{id}")
    @CacheEvict(value = "cinemas", allEntries = true)
    public ResponseEntity<?> updateCinema(@PathVariable Long id, @RequestBody @Valid Cinema cinemaDetails) {
        cinemaService.updateCinema(id, cinemaDetails);
        return ResponseEntity.ok("Cập nhật rạp thành công!");
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = "cinemas", allEntries = true)
    public ResponseEntity<?> deleteCinema(@PathVariable Long id) {
        cinemaService.deleteCinema(id);
        return ResponseEntity.ok("Xóa rạp thành công!");
    }
}
