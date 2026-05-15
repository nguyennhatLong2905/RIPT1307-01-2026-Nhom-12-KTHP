package com.example.THLTW.controller;

import com.example.THLTW.dto.DashboardStats;
import com.example.THLTW.dto.DashboardSummaryDTO;
import com.example.THLTW.entity.Booking;
import com.example.THLTW.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStats> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    // Tổng quan nhanh
    @GetMapping("/summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardSummaryDTO> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummaryStats());
    }

    // Doanh thu tháng
    @GetMapping("/monthly-revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Double>> getMonthlyRevenue() {
        return ResponseEntity.ok(dashboardService.getMonthlyRevenue());
    }

    // 5 giao dịch gần đây
    @GetMapping("/recent-bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getRecentBookings() {
        return ResponseEntity.ok(dashboardService.getRecentBookings());
    }
}
