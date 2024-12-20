package com.backend.expense_backend.service;

import com.backend.expense_backend.dto.BudgetDTO;
import com.backend.expense_backend.model.Budget;
import com.backend.expense_backend.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetService {
    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private ExpenseService expenseService;

    public List<BudgetDTO> getAllBudgets() {
        return budgetRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BudgetDTO createBudget(BudgetDTO budgetDTO) {
        Budget budget = new Budget();
        budget.setAmount(budgetDTO.getAmount());
        budget.setMonth(budgetDTO.getMonth());
        budget.setYear(budgetDTO.getYear());

        return convertToDTO(budgetRepository.save(budget));
    }

    public BudgetDTO updateBudget(Long id, BudgetDTO budgetDTO) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));
        budget.setName(budgetDTO.getName());
        budget.setAmount(budgetDTO.getAmount());
        budget.setMonth(budgetDTO.getMonth());
        budget.setYear(budgetDTO.getYear());
        return convertToDTO(budgetRepository.save(budget));
    }

    public void deleteBudget(Long id) {
        Budget budget = budgetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));
        budgetRepository.delete(budget);
    }

    public boolean isBudgetExceeded(LocalDate date) {
        // Lấy tháng và năm từ date
        int month = date.getMonthValue();
        int year = date.getYear();

        // Lấy ngân sách trong tháng và năm cụ thể
        Budget budget = budgetRepository.findByMonthAndYear(month, year)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));

        // Tính toán thời gian bắt đầu và kết thúc của tháng
        LocalDateTime startDate = date.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endDate = date.plusMonths(1).withDayOfMonth(1).atStartOfDay();

        // Lấy tổng chi tiêu trong tháng cụ thể
        BigDecimal totalExpenses = expenseService.findTotalExpensesByDate(startDate, endDate);

        // So sánh tổng chi tiêu với ngân sách
        return totalExpenses != null && totalExpenses.compareTo(BigDecimal.valueOf(budget.getAmount())) > 0;
    }

    public double getBudgetForPeriod(LocalDate date) {
        Budget budget = budgetRepository.findByMonthAndYear(date.getMonthValue(), date.getYear())
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));
        return budget.getAmount();
    }

    public BudgetDTO getBudgetForMonth(int month, int year) {
        Budget budget = budgetRepository.findByMonthAndYear(month, year)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));
        return convertToDTO(budget);
    }

    private BudgetDTO convertToDTO(Budget budget) {
        BudgetDTO dto = new BudgetDTO();
        dto.setId(budget.getId());
        dto.setName(budget.getName());
        dto.setAmount(budget.getAmount());
        dto.setMonth(budget.getMonth());
        dto.setYear(budget.getYear());
        return dto;
    }
}