package com.example.THLTW.service;

import com.example.THLTW.entity.Movie;
import com.example.THLTW.entity.Room;
import com.example.THLTW.entity.Showtime;
import com.example.THLTW.exception.AppException;
import com.example.THLTW.repository.MovieRepository;
import com.example.THLTW.repository.RoomRepository;
import com.example.THLTW.repository.ShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.List;

// Service quản lý logic nghiệp vụ của Suất chiếu (Showtime)
@Service
public class ShowtimeService {

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private RoomRepository roomRepository;

    // Tạo mới một suất chiếu và ánh xạ với Phim và Phòng chiếu
    public Showtime createShowtime(Long movieId, Long roomId, Showtime showtime) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy phim!"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy phòng chiếu!"));

        showtime.setMovie(movie);
        showtime.setRoom(room);
        
        return showtimeRepository.save(showtime);
    }

    public Showtime updateShowtime(Long id, Long movieId, Long roomId, Showtime details) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy suất chiếu!"));

        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy phim!"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy phòng chiếu!"));

        showtime.setMovie(movie);
        showtime.setRoom(room);
        showtime.setStartTime(details.getStartTime());
        showtime.setPrice(details.getPrice());

        return showtimeRepository.save(showtime);
    }

    public List<Showtime> getShowtimesByMovie(Long movieId) {
        return showtimeRepository.findByMovieId(movieId);
    }

    public List<Showtime> getAllShowtimes() {
        return showtimeRepository.findAll();
    }

    public void deleteShowtime(Long id) {
        showtimeRepository.deleteById(id);
    }
}