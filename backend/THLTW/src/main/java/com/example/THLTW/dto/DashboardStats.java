package com.example.THLTW.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {
    private Double totalRevenue;
    private Long totalBookings;
    private Long totalMovies;
    private Long totalCustomers;
    private Map<String, Double> revenueByMonth;
    private java.util.List<com.example.THLTW.entity.Booking> recentBookings;
}
