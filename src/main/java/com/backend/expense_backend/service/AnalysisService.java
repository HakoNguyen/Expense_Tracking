package com.backend.expense_backend.service;

import com.backend.expense_backend.dto.AnalysisDTO;
import com.backend.expense_backend.model.Budget;
import com.backend.expense_backend.model.Expense;
import com.backend.expense_backend.repository.BudgetRepository;
import com.backend.expense_backend.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalysisService {
    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    // Tính tổng chi tiêu trong khoảng thời gian
    public double getTotalExpenses(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        return expenses.stream().mapToDouble(   Expense::getAmount).sum();
    }

    // Tính ngân sách cho một khoảng thời gian
    public double getBudgetForPeriod(Long userId, LocalDate date) {
        List<Budget> budgets = budgetRepository.findByUserId(userId);
        return budgets.stream()
                .filter(budget -> budget.getDate().getMonth() == date.getMonth() &&
                        budget.getDate().getYear() == date.getYear())
                .mapToDouble(Budget::getAmount)
                .sum();
    }

    // Tính chi tiêu trung bình trong khoảng thời gian
    public double getAverageExpenses(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        return expenses.stream().mapToDouble(Expense::getAmount).average().orElse(0);
    }

    // So sánh chi tiêu với ngân sách
    public String compareExpensesWithBudget(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        double totalExpenses = getTotalExpenses(userId, startDate, endDate);
        double totalBudget = getBudgetForPeriod(userId, startDate.toLocalDate());

        double percentage = (totalBudget != 0) ? (totalExpenses / totalBudget) * 100 : 0;

        if (totalExpenses > totalBudget) {
            return String.format("Chi tiêu vượt ngân sách: %.2f%%", percentage);
        } else {
            return String.format("Chi tiêu trong ngân sách: %.2f%%", percentage);
        }
    }

    // Phân tích chi tiêu theo tháng
    public AnalysisDTO getMonthlyAnalysis(Long userId, LocalDate month) {
        AnalysisDTO analysis = new AnalysisDTO();
        analysis.setMonth(month);

        // Tính tổng thu nhập
        double totalIncome = getTotalIncome(userId, month);
        analysis.setTotalIncome(BigDecimal.valueOf(totalIncome));

        // Tính tổng chi tiêu
        double totalExpense = getTotalExpenses(userId, month.atStartOfDay(), month.plusMonths(1).atStartOfDay());
        analysis.setTotalExpense(BigDecimal.valueOf(totalExpense));

        // Lấy ngân sách cho tháng
        double budgetLimit = getBudgetForPeriod(userId, month);
        analysis.setBudgetLimit(BigDecimal.valueOf(budgetLimit));

        // Cảnh báo nếu chi tiêu vượt quá định mức
        if (totalExpense > budgetLimit) {
            analysis.setExceededAmount(BigDecimal.valueOf(totalExpense - budgetLimit));
        } else {
            analysis.setExceededAmount(BigDecimal.valueOf(0));
        }

        // Phân loại chi tiêu theo danh mục
        Map<String, BigDecimal> categoryExpense = getCategoryExpenses(userId, month);
        analysis.setCategoryExpense(categoryExpense);

        return analysis;
    }


    private Map<String, BigDecimal> getCategoryExpenses(Long userId, LocalDate month) {
        List<Expense> expenses = expenseRepository.findByUserIdAndDateBetween(userId, month.atStartOfDay(), month.plusMonths(1).atStartOfDay());
        Map<String, BigDecimal> categoryExpense = new HashMap<>();
        for (Expense expense : expenses) {
            categoryExpense.merge(expense.getCategory().getName(), BigDecimal.valueOf(expense.getAmount()), BigDecimal::add);
        }
        return categoryExpense;
    }


    // Tính tổng thu nhập cho tháng
    private double getTotalIncome(Long userId, LocalDate month) {
        // Implement logic to calculate total income for the user in the given month
        return 0; // Placeholder
    }

    // Thống kê tình trạng chi tiêu qua các tháng trong năm
    public List<AnalysisDTO> getYearlyAnalysis(Long userId, int year) {
        List<AnalysisDTO> yearlyAnalysis = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            LocalDate date = LocalDate.of(year, month, 1);
            AnalysisDTO analysis = getMonthlyAnalysis(userId, date);
            yearlyAnalysis.add(analysis);
        }
        return yearlyAnalysis;
    }
}