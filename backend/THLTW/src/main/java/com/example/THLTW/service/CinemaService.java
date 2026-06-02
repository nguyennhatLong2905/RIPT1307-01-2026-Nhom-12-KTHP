package com.example.THLTW.service;

import com.example.THLTW.entity.Cinema;
import com.example.THLTW.exception.AppException;
import com.example.THLTW.repository.CinemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CinemaService {

    @Autowired
    private CinemaRepository cinemaRepository;

    public List<Cinema> getAllCinemas() {
        return cinemaRepository.findAll();
    }

    public Cinema getCinemaById(Long id) {
        return cinemaRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy rạp phim!"));
    }

    public Cinema saveCinema(Cinema cinema) {
        return cinemaRepository.save(cinema);
    }

    public Cinema updateCinema(Long id, Cinema details) {
        Cinema cinema = getCinemaById(id);
        cinema.setName(details.getName());
        cinema.setAddress(details.getAddress());
        cinema.setImageUrl(details.getImageUrl());
        cinema.setDescription(details.getDescription());
        return cinemaRepository.save(cinema);
    }

    public void deleteCinema(Long id) {
        cinemaRepository.deleteById(id);
    }
}
