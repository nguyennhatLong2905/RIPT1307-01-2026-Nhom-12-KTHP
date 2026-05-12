package com.example.THLTW.service;

import com.example.THLTW.dto.DashboardStats;
import com.example.THLTW.entity.User;
import com.example.THLTW.repository.BookingRepository;
import com.example.THLTW.repository.MovieRepository;
import com.example.THLTW.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookingRepository bookingRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public DashboardStats getStats() {
        Double totalRevenue = bookingRepository.calculateTotalRevenue();
        if (totalRevenue == null) totalRevenue = 0.0;

        Long totalBookings = bookingRepository.count();
        Long totalMovies = movieRepository.count();
        Long totalCustomers = userRepository.countByRole(User.Role.CUSTOMER);

        // Revenue by month (Chart data)
        List<Object[]> monthlyData = bookingRepository.getMonthlyRevenue();
        Map<String, Double> revenueByMonth = new LinkedHashMap<>();
        
        // Reverse order to show chronological in chart (from older to newer)
        for (int i = monthlyData.size() - 1; i >= 0; i--) {
            Object[] row = monthlyData.get(i);
            revenueByMonth.put(row[0].toString(), (Double) row[1]);
        }

        // Fetch 5 recent bookings (Sorted by ID desc)
        List<com.example.THLTW.entity.Booking> recentBookings = bookingRepository.findAll();
        recentBookings.sort((a, b) -> b.getId().compareTo(a.getId()));
        if (recentBookings.size() > 5) {
            recentBookings = recentBookings.subList(0, 5);
        }

        return new DashboardStats(totalRevenue, totalBookings, totalMovies, totalCustomers, revenueByMonth, recentBookings);
    }
}
