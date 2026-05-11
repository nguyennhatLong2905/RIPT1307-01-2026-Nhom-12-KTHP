package com.example.THLTW.service;

import com.example.THLTW.entity.Movie;
import com.example.THLTW.exception.AppException;
import com.example.THLTW.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.List;

// Service quản lý danh mục Phim và Thuật toán Gợi ý Phim (AI Pick)
@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private com.example.THLTW.repository.BookingRepository bookingRepository;

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie addMovie(Movie movie) {
        return movieRepository.save(movie);
    }

    public Movie updateMovie(Long id, Movie details) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Không tìm thấy phim!"));

        movie.setTitle(details.getTitle());
        movie.setDescription(details.getDescription());
        movie.setDirector(details.getDirector());
        movie.setGenre(details.getGenre());
        movie.setDuration(details.getDuration());
        movie.setReleaseDate(details.getReleaseDate());
        movie.setPosterUrl(details.getPosterUrl());
        movie.setTrailerUrl(details.getTrailerUrl());

        return movieRepository.save(movie);
    }

    public void deleteMovie(Long id) {
        movieRepository.deleteById(id);
    }

    // Gợi ý phim theo thể loại (AI Pick cơ bản)
    public List<Movie> getAIPick(List<String> preferredGenres) {
        List<Movie> allMovies = movieRepository.findAll();

        if (preferredGenres == null || preferredGenres.isEmpty()) {
            return allMovies.stream()
                    .sorted((m1, m2) -> m2.getId().compareTo(m1.getId()))
                    .limit(10)
                    .toList();
        }

        List<Movie> sortedMovies = allMovies.stream()
                .sorted((m1, m2) -> {
                    long score1 = countMatchingGenres(m1, preferredGenres);
                    long score2 = countMatchingGenres(m2, preferredGenres);
                    if (score1 != score2) return Long.compare(score2, score1);
                    return m2.getId().compareTo(m1.getId());
                })
                .toList();

        if (sortedMovies.isEmpty() || countMatchingGenres(sortedMovies.get(0), preferredGenres) == 0) {
            return allMovies.stream()
                    .sorted((m1, m2) -> m2.getId().compareTo(m1.getId()))
                    .limit(10)
                    .toList();
        }

        return sortedMovies.stream().limit(10).toList();
    }

    private long countMatchingGenres(Movie movie, List<String> preferredGenres) {
        if (movie.getGenre() == null) return 0;
        String mGenre = movie.getGenre().toLowerCase();
        return preferredGenres.stream()
                .filter(g -> mGenre.contains(g.toLowerCase()))
                .count();
    }

    // Gợi ý phim cá nhân hóa dựa trên lịch sử đặt vé
    public List<Movie> getPersonalizedAIPick(String username) {
        List<com.example.THLTW.entity.Booking> userBookings = bookingRepository.findByUserUsername(username);
        
        java.util.Map<String, Long> genreCount = userBookings.stream()
                .map(b -> b.getShowtime().getMovie().getGenre())
                .filter(java.util.Objects::nonNull)
                .flatMap(g -> java.util.Arrays.stream(g.split("[,/\\n\\r]"))) // Tách theo dấu phẩy, gạch chéo
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(java.util.stream.Collectors.groupingBy(g -> g, java.util.stream.Collectors.counting()));

        List<String> topGenres = genreCount.entrySet().stream()
                .sorted(java.util.Map.Entry.<String, Long>comparingByValue().reversed())
                .map(java.util.Map.Entry::getKey)
                .toList();

        return getAIPick(topGenres);
    }
}