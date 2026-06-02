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
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ShowtimeService {

    @Autowired
    private ShowtimeRepository showtimeRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private RoomRepository roomRepository;

    public Showtime createShowtime(Long movieId, Long roomId, Showtime showtime) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy phim!"));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy phòng chiếu!"));

        checkScheduleConflict(roomId, showtime.getStartTime(), movie.getDuration(), null);

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

        checkScheduleConflict(roomId, details.getStartTime(), movie.getDuration(), id);

        showtime.setMovie(movie);
        showtime.setRoom(room);
        showtime.setStartTime(details.getStartTime());
        showtime.setPrice(details.getPrice());

        return showtimeRepository.save(showtime);
    }

    private void checkScheduleConflict(Long roomId, LocalDateTime newStart, int duration, Long excludeId) {
        LocalDateTime newEnd = newStart.plusMinutes(duration);

        List<Showtime> existingShowtimes;
        if (excludeId != null) {
            existingShowtimes = showtimeRepository.findByRoomIdAndDateExcluding(roomId, newStart, excludeId);
        } else {
            existingShowtimes = showtimeRepository.findByRoomIdAndDate(roomId, newStart);
        }

        for (Showtime existing : existingShowtimes) {
            LocalDateTime existStart = existing.getStartTime();
            LocalDateTime existEnd = existStart.plusMinutes(existing.getMovie().getDuration());

            if (newStart.isBefore(existEnd) && newEnd.isAfter(existStart)) {
                String conflictMsg = String.format(
                        "Phòng đang chiếu phim \"%s\" từ %s đến %s. Không thể tạo suất chiếu trùng thời gian!",
                        existing.getMovie().getTitle(),
                        existStart.toLocalTime(),
                        existEnd.toLocalTime()
                );
                throw new AppException(HttpStatus.CONFLICT, conflictMsg);
            }
        }
    }

    public List<Showtime> getShowtimesByMovie(Long movieId) {
        return showtimeRepository.findByMovieIdWithDetails(movieId);
    }

    public List<Showtime> getAllShowtimes() {
        return showtimeRepository.findAllWithDetails();
    }

    public void deleteShowtime(Long id) {
        showtimeRepository.deleteById(id);
    }

    public Showtime getShowtimeById(Long id) {
        return showtimeRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy suất chiếu!"));
    }
}