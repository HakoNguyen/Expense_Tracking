package com.backend.expense_backend.controller;

import com.backend.expense_backend.dto.AnalysisDTO;
import com.backend.expense_backend.service.AnalysisService;
import com.backend.expense_backend.service.BudgetService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    @Autowired
    private AnalysisService analysisService;

    @Autowired
    private BudgetService budgetService;

    // Phân tích chi tiêu theo tháng
    @GetMapping("/monthly")
    public ResponseEntity<AnalysisDTO> getMonthlyAnalysis(
            @RequestParam Long userId,
            @RequestParam LocalDate month) {
        AnalysisDTO analysis = analysisService.getMonthlyAnalysis(userId, month);
        return ResponseEntity.ok(analysis);
    }

    // Thống kê tình trạng chi tiêu qua các tháng trong năm
    @GetMapping("/yearly")
    public ResponseEntity<List<AnalysisDTO>> getYearlyAnalysis(
            @RequestParam Long userId,
            @RequestParam int year) {
        List<AnalysisDTO> yearlyAnalysis = analysisService.getYearlyAnalysis(userId, year);
        return ResponseEntity.ok(yearlyAnalysis);
    }

    // So sánh chi tiêu với ngân sách
    @GetMapping("/compare")
    public ResponseEntity<String> compareExpensesWithBudget(
            @RequestParam Long userId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        String comparisonResult = analysisService.compareExpensesWithBudget(userId, startDate.atStartOfDay(), endDate.atStartOfDay());
        return ResponseEntity.ok(comparisonResult);
    }

    // Tính tổng chi tiêu trong khoảng thời gian
    @GetMapping("/total-expenses")
    public ResponseEntity<Double> getTotalExpenses(
            @RequestParam Long userId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        double totalExpenses = analysisService.getTotalExpenses(userId, startDate.atStartOfDay(), endDate.atStartOfDay());
        return ResponseEntity.ok(totalExpenses);
    }

    // Tính ngân sách cho một khoảng thời gian
    @GetMapping("/budget")
    public ResponseEntity<Double> getBudgetForPeriod(
            @RequestParam Long userId,
            @RequestParam LocalDate date) {
        double budget = analysisService.getBudgetForPeriod(userId, date);
        return ResponseEntity.ok(budget);
    }

    // Tính chi tiêu trung bình trong khoảng thời gian
    @GetMapping("/average-expenses")
    public ResponseEntity<Double> getAverageExpenses(
            @RequestParam Long userId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        double averageExpenses = analysisService.getAverageExpenses(userId, startDate.atStartOfDay(), endDate.atStartOfDay());
        return ResponseEntity.ok(averageExpenses);
    }

    @PostMapping("/check-exceed")
    public BudgetCheckResponse checkBudgetExceeded(@RequestBody BudgetRequest budgetRequest) {
        LocalDate localDate = LocalDate.parse(budgetRequest.getDate());
        boolean isExceeded = budgetService.isBudgetExceeded(budgetRequest.getUserId(), localDate);

        return new BudgetCheckResponse(isExceeded, isExceeded ? "Ngân sách đã vượt quá" : "Ngân sách còn lại đủ");
    }

    // Định nghĩa lớp BudgetRequest
    @Getter
    public static class BudgetRequest {
        // Getters và Setters
        private Long userId;
        private String date;

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public void setDate(String date) {
            this.date = date;
        }
    }

    // Định nghĩa lớp BudgetCheckResponse
    @Getter
    public static class BudgetCheckResponse {
        // Getters và Setters
        private boolean exceeded;
        private String message;

        public BudgetCheckResponse(boolean exceeded, String message) {
            this.exceeded = exceeded;
            this.message = message;
        }

        public void setExceeded(boolean exceeded) {
            this.exceeded = exceeded;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}