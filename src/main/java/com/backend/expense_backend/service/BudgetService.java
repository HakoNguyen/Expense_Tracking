package com.backend.expense_backend.service;

import com.backend.expense_backend.dto.BudgetDTO;
import com.backend.expense_backend.model.Budget;
import com.backend.expense_backend.model.User;
import com.backend.expense_backend.repository.BudgetRepository;
import com.backend.expense_backend.repository.UserRepository;
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
    private UserRepository userRepository;

    @Autowired
    private ExpenseService expenseService;

    public List<BudgetDTO> getAllBudgets(Long userId) {
        return budgetRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BudgetDTO createBudget(BudgetDTO budgetDTO) {
        Budget budget = new Budget();
        budget.setAmount(budgetDTO.getAmount());
        budget.setDate(budgetDTO.getDate());

        // Tìm kiếm User từ repository
        User user = userRepository.findById(budgetDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User  not found"));
        budget.setUser (user); // Thiết lập người dùng cho ngân sách

        return convertToDTO(budgetRepository.save(budget));
    }

    public BudgetDTO updateBudget(Long id, Long userId, BudgetDTO budgetDTO) {
        Budget budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found or not owned by user"));
        budget.setName(budgetDTO.getName());
        budget.setAmount(budgetDTO.getAmount());
        budget.setDate(budgetDTO.getDate());
        return convertToDTO(budgetRepository.save(budget));
    }

    public void deleteBudget(Long id, Long userId) {
        Budget budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found or not owned by user"));
        budgetRepository.delete(budget);
    }

    public boolean isBudgetExceeded(Long userId, LocalDate date) {
        // Lấy ngân sách cho người dùng trong tháng cụ thể
        Budget budget = budgetRepository.findByUserIdAndDate(userId, date)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found for user"));

        // Tính toán thời gian bắt đầu và kết thúc của tháng
        LocalDateTime startDate = date.atStartOfDay(); // Khởi tạo startDate
        LocalDateTime endDate = date.plusMonths(1).atStartOfDay(); // Khởi tạo endDate

        // Lấy tổng chi tiêu cho người dùng trong tháng cụ thể
        BigDecimal totalExpenses = expenseService.findTotalExpensesByUserIdAndDate(userId, startDate, endDate);

        // So sánh tổng chi tiêu với ngân sách
        return totalExpenses != null && totalExpenses.compareTo(BigDecimal.valueOf(budget.getAmount())) > 0;
    }
    private BudgetDTO convertToDTO(Budget budget) {
        BudgetDTO dto = new BudgetDTO();
        dto.setId(budget.getId());
        dto.setName(budget.getName());
        dto.setAmount(budget.getAmount());
        dto.setUserId(budget.getUser().getId());
        dto.setDate(budget.getDate());
        return dto;
    }
}