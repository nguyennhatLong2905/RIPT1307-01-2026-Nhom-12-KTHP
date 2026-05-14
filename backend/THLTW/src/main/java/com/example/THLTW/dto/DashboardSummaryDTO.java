package com.example.THLTW.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryDTO {
    private Double totalRevenue;
    private Long totalBookings;
    private Long totalMovies;
    private Long totalCustomers;
}
