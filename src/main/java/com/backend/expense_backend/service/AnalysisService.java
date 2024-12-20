package com.backend.expense_backend.service;

import com.backend.expense_backend.dto.AnalysisDTO;
import com.backend.expense_backend.dto.MonthlyBudgetExpensesDTO;
import com.backend.expense_backend.model.Budget;
import com.backend.expense_backend.model.Expense;
import com.backend.expense_backend.model.Income;
import com.backend.expense_backend.repository.BudgetRepository;
import com.backend.expense_backend.repository.ExpenseRepository;
import com.backend.expense_backend.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
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

    @Autowired
    private IncomeRepository incomeRepository;

    // Tính tổng chi tiêu trong khoảng thời gian
    public double getTotalExpenses(LocalDateTime startDate, LocalDateTime endDate) {
        List<Expense> expenses = expenseRepository.findByDateBetween(startDate, endDate);
        return expenses.stream().mapToDouble(Expense::getAmount).sum();
    }


    private Map<String, BigDecimal> getCategoryIncome(LocalDate month) {
        List<Income> incomes = incomeRepository.findByDateBetween(month.atStartOfDay(), month.plusMonths(1).atStartOfDay());
        Map<String, BigDecimal> categoryIncome = new HashMap<>();
        for (Income income : incomes) {
            categoryIncome.merge(income.getCategory().getName(), BigDecimal.valueOf(income.getAmount()), BigDecimal::add);
        }
        return categoryIncome;
    }

    // Tính ngân sách cho một khoảng thời gian
    public double getBudgetForPeriod(LocalDate date) {
        List<Budget> budgets = budgetRepository.findAll();
        return budgets.stream()
                .filter(budget -> budget.getMonth() == date.getMonthValue() && // Sử dụng getMonthValue() để so sánh
                        budget.getYear() == date.getYear())
                .mapToDouble(Budget::getAmount)
                .sum();
    }

    // Tổng chi tiêu và ngân sách cho mỗi tháng trong năm
    public List<MonthlyBudgetExpensesDTO> getMonthlyBudgetExpenses(int year) {
        List<MonthlyBudgetExpensesDTO> monthlyData = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            LocalDate date = LocalDate.of(year, month, 1);
            double totalExpenses = getTotalExpenses(date.atStartOfDay(), date.plusMonths(1).atStartOfDay());
            double budget = getBudgetForPeriod(date);

            MonthlyBudgetExpensesDTO dto = new MonthlyBudgetExpensesDTO();
            dto.setMonth(date.getMonth().name()); // Lấy tên tháng
            dto.setTotalExpenses(totalExpenses);
            dto.setBudget(budget);

            monthlyData.add(dto);
        }

        return monthlyData;
    }

    // Tính chi tiêu trung bình trong khoảng thời gian
    public double getAverageExpenses(LocalDateTime startDate, LocalDateTime endDate) {
        List<Expense> expenses = expenseRepository.findByDateBetween(startDate, endDate);
        return expenses.stream().mapToDouble(Expense::getAmount).average().orElse(0);
    }

    // So sánh chi tiêu với ngân sách
    public String compareExpensesWithBudget(LocalDateTime startDate, LocalDateTime endDate) {
        double totalExpenses = getTotalExpenses(startDate, endDate);
        double totalBudget = getBudgetForPeriod(startDate.toLocalDate());

        double percentage = (totalBudget != 0) ? (totalExpenses / totalBudget) * 100 : 0;

        if (totalExpenses > totalBudget) {
            return String.format("Chi tiêu vượt ngân sách: %.2f%%", percentage);
        } else {
            return String.format("Chi tiêu trong ngân sách: %.2f%%", percentage);
        }
    }

    // Phân tích chi tiêu theo tháng
    public AnalysisDTO getMonthlyAnalysis(LocalDate month) {
        AnalysisDTO analysis = new AnalysisDTO();
        analysis.setMonth(month);

        // Tính tổng chi tiêu
        double totalExpense = getTotalExpenses(month.atStartOfDay(), month.plusMonths(1).atStartOfDay());
        analysis.setTotalExpense(BigDecimal.valueOf(totalExpense));

        // Lấy ngân sách cho tháng
        double budgetLimit = getBudgetForPeriod(month);
        analysis.setBudgetLimit(budgetLimit > 0 ? BigDecimal.valueOf(budgetLimit) : null);

        // Cảnh báo nếu chi tiêu vượt quá định mức
        if (totalExpense > budgetLimit) {
            analysis.setExceededAmount(BigDecimal.valueOf(totalExpense - budgetLimit));
        } else {
            analysis.setExceededAmount(BigDecimal.ZERO);
        }

        // Phân loại chi tiêu theo danh mục
        Map<String, BigDecimal> categoryExpense = getCategoryExpenses(month);
        analysis.setCategoryExpense(categoryExpense);

        // Tính phần trăm chi tiêu cho mỗi danh mục
        Map<String, BigDecimal> categoryExpensePercentage = new HashMap<>();
        for (Map.Entry<String, BigDecimal> entry : categoryExpense.entrySet()) {
            String categoryName = entry.getKey();
            BigDecimal amount = entry.getValue();
            BigDecimal percentage = (totalExpense != 0) ? amount.divide(BigDecimal.valueOf(totalExpense), 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)) : BigDecimal.ZERO;
            categoryExpensePercentage.put(categoryName, percentage);
        }
        analysis.setCategoryExpensePercentage(categoryExpensePercentage);

        return analysis;
    }

    private Map<String, BigDecimal> getCategoryExpenses(LocalDate month) {
        List<Expense> expenses = expenseRepository.findByDateBetween(month.atStartOfDay(), month.plusMonths(1).atStartOfDay());
        Map<String, BigDecimal> categoryExpense = new HashMap<>();
        for (Expense expense : expenses) {
            categoryExpense.merge(expense.getCategory().getName(), BigDecimal.valueOf(expense.getAmount()), BigDecimal::add);
        }
        return categoryExpense;
    }

    // Tính tổng thu nhập cho tháng
    private double getTotalIncome(LocalDate month) {
        // Implement logic to calculate total income for the given month
        return 0; // Placeholder
    }

    // Thống kê tình trạng chi tiêu qua các tháng trong năm
    public List<AnalysisDTO> getYearlyAnalysis(int year) {
        List<AnalysisDTO> yearlyAnalysis = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            LocalDate date = LocalDate.of(year, month, 1);
            AnalysisDTO analysis = getMonthlyAnalysis(date);
            yearlyAnalysis.add(analysis);
        }
        return yearlyAnalysis;
    }
}