package com.example.THLTW.controller;

import com.example.THLTW.entity.Movie;
import com.example.THLTW.entity.User;
import com.example.THLTW.exception.AppException;
import com.example.THLTW.repository.MovieRepository;
import com.example.THLTW.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Set;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MovieRepository movieRepository;

    @GetMapping
    public Set<Movie> getWishlist(Principal principal) {
        if (principal == null) throw new AppException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập");
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Người dùng không tồn tại"));
        return user.getFavoriteMovies();
    }

    @PostMapping("/{movieId}")
    public String addToWishlist(@PathVariable Long movieId, Principal principal) {
        if (principal == null) throw new AppException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập");
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Người dùng không tồn tại"));
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Phim không tồn tại"));

        user.getFavoriteMovies().add(movie);
        userRepository.save(user);
        return "Đã thêm vào danh sách yêu thích";
    }

    @DeleteMapping("/{movieId}")
    public String removeFromWishlist(@PathVariable Long movieId, Principal principal) {
        if (principal == null) throw new AppException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập");
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Người dùng không tồn tại"));
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new AppException(HttpStatus.NOT_FOUND, "Phim không tồn tại"));

        user.getFavoriteMovies().remove(movie);
        userRepository.save(user);
        return "Đã xóa khỏi danh sách yêu thích";
    }
}
