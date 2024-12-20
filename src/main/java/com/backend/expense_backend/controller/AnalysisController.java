package com.backend.expense_backend.controller;

import com.backend.expense_backend.dto.AnalysisDTO;
import com.backend.expense_backend.dto.MonthlyBudgetExpensesDTO;
import com.backend.expense_backend.service.AnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    @Autowired
    private AnalysisService analysisService;

    // Biểu đồ cột: So sánh chi tiêu và ngân sách theo năm
    @GetMapping("/bar-chart")
    public ResponseEntity<List<MonthlyBudgetExpensesDTO>> getBarChartData(@RequestParam int year) {
        List<MonthlyBudgetExpensesDTO> barChartData = analysisService.getMonthlyBudgetExpenses(year);
        return ResponseEntity.ok(barChartData);
    }

    // Biểu đồ đường: So sánh chi tiêu với thu nhập theo tháng
    @GetMapping("/line-chart")
    public ResponseEntity<List<AnalysisDTO>> getLineChartData(@RequestParam int year) {
        List<AnalysisDTO> lineChartData = analysisService.getYearlyAnalysis(year);
        return ResponseEntity.ok(lineChartData);
    }

    // Biểu đồ tròn: Phân loại chi tiêu theo danh mục
    @GetMapping("/pie-chart")
    public ResponseEntity<List<AnalysisDTO>> getPieChartData(@RequestParam int month, @RequestParam int year) {
        LocalDate monthDate = LocalDate.of(year, month, 1); // Tạo LocalDate từ tháng và năm
        AnalysisDTO pieChartData = analysisService.getMonthlyAnalysis(monthDate);

        // Chuyển đổi từ Map<String, BigDecimal> sang List<AnalysisDTO>
        List<AnalysisDTO> analysisList = pieChartData.getCategoryExpense().entrySet().stream()
                .map(entry -> {
                    AnalysisDTO dto = new AnalysisDTO();
                    dto.setMonth(monthDate);
                    dto.setTotalExpense(entry.getValue());

                    // Tính phần trăm cho mỗi danh mục
                    BigDecimal totalExpense = pieChartData.getTotalExpense();
                    BigDecimal percentage = (totalExpense.compareTo(BigDecimal.ZERO) > 0)
                            ? entry.getValue().divide(totalExpense, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                            : BigDecimal.ZERO;

                    // Thiết lập phần trăm chi tiêu cho danh mục
                    dto.setCategoryExpensePercentage(Map.of(entry.getKey(), percentage));

                    // Loại bỏ các trường null
                    if (dto.getTotalExpense() == null) {
                        dto.setTotalExpense(null);
                    }
                    if (dto.getBudgetLimit() == null) {
                        dto.setBudgetLimit(null);
                    }
                    if (dto.getExceededAmount() == null) {
                        dto.setExceededAmount(null);
                    }
                    if (dto.getCategoryExpense() == null) {
                        dto.setCategoryExpense(null);
                    }
                    if (dto.getCategoryIncome() == null) {
                        dto.setCategoryIncome(null);
                    }

                    return dto;
                })
                .filter(dto -> dto.getTotalExpense() != null) // Lọc bỏ các đối tượng có totalExpense là null
                .toList();

        return ResponseEntity.ok(analysisList);
    }

    // Kiểm tra xem chi tiêu có vượt quá ngân sách hay không
    @GetMapping("/check-budget-exceed")
    public ResponseEntity<String> checkBudgetExceeded(@RequestParam int month, @RequestParam int year) {
        // Tạo LocalDate từ tháng và năm
        LocalDate monthDate = LocalDate.of(year, month, 1);

        // Tính tổng chi tiêu trong tháng
        double totalExpenses = analysisService.getTotalExpenses(monthDate.atStartOfDay(), monthDate.plusMonths(1).atStartOfDay());

        // Tính ngân sách cho tháng
        double budgetLimit = analysisService.getBudgetForPeriod(monthDate);

        // So sánh tổng chi tiêu với ngân sách
        if (totalExpenses > budgetLimit) {
            return ResponseEntity.ok("Tổng chi tiêu đã vượt quá ngân sách: " + (totalExpenses - budgetLimit) + " VNĐ");
        } else {
            return ResponseEntity.ok("Tổng chi tiêu trong ngân sách.");
        }
    }
}