package com.example.THLTW.service;

import com.example.THLTW.dto.DashboardStats;
import com.example.THLTW.dto.DashboardSummaryDTO;
import com.example.THLTW.entity.Booking;
import com.example.THLTW.entity.User;
import com.example.THLTW.repository.BookingRepository;
import com.example.THLTW.repository.MovieRepository;
import com.example.THLTW.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
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

    @Cacheable(value = "dashboardSummary", key = "'summary'")
    public DashboardSummaryDTO getSummaryStats() {
        Double totalRevenue = bookingRepository.calculateTotalRevenue();
        if (totalRevenue == null) totalRevenue = 0.0;

        Long totalBookings = bookingRepository.count();
        Long totalMovies = movieRepository.count();
        Long totalCustomers = userRepository.countByRole(User.Role.CUSTOMER);

        return new DashboardSummaryDTO(totalRevenue, totalBookings, totalMovies, totalCustomers);
    }

    @Cacheable(value = "dashboardMonthlyRevenue", key = "'monthly'")
    public Map<String, Double> getMonthlyRevenue() {
        List<Object[]> monthlyData = bookingRepository.getMonthlyRevenue();
        Map<String, Double> revenueByMonth = new LinkedHashMap<>();
        
        // Reverse order to show chronological in chart (from older to newer)
        for (int i = monthlyData.size() - 1; i >= 0; i--) {
            Object[] row = monthlyData.get(i);
            revenueByMonth.put(row[0].toString(), (Double) row[1]);
        }
        return revenueByMonth;
    }

    public List<Booking> getRecentBookings() {
        return bookingRepository.findTop5ByOrderByIdDesc();
    }
    public DashboardStats getStats() {
        DashboardSummaryDTO summary = getSummaryStats();
        Map<String, Double> monthly = getMonthlyRevenue();
        List<Booking> recent = getRecentBookings();

        return new DashboardStats(
                summary.getTotalRevenue(),
                summary.getTotalBookings(),
                summary.getTotalMovies(),
                summary.getTotalCustomers(),
                monthly,
                recent
        );
    }
}
