package com.backend.expense_backend.service;

import com.backend.expense_backend.dto.ExpenseDTO;
import com.backend.expense_backend.model.Expense;
import com.backend.expense_backend.model.User;
import com.backend.expense_backend.model.Category;
import com.backend.expense_backend.repository.ExpenseRepository;
import com.backend.expense_backend.repository.UserRepository;
import com.backend.expense_backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public BigDecimal findTotalExpensesByUserIdAndDate(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return expenseRepository.findTotalExpensesByUserIdAndDate(userId, startDate, endDate);
    }

    public List<ExpenseDTO> getAllExpenses(Long userId) {
        return expenseRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ExpenseDTO createExpense(ExpenseDTO expenseDTO) {
        Expense expense = new Expense();
        expense.setName(expenseDTO.getName());
        expense.setAmount(expenseDTO.getAmount());
        expense.setNotes(expenseDTO.getNotes());

        // Tìm kiếm User và Category từ repository
        User user = userRepository.findById(expenseDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        expense.setUser  (user);

        Category category = categoryRepository.findById(expenseDTO.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        expense.setCategory(category);

        expense.setDate(expenseDTO.getDate());
        return convertToDTO(expenseRepository.save(expense));
    }

    public ExpenseDTO updateExpense(Long id, Long userId, ExpenseDTO expenseDTO) {
        Expense expense = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found or not owned by user"));
        expense.setName(expenseDTO.getName());
        expense.setAmount(expenseDTO.getAmount());
        expense.setNotes(expenseDTO.getNotes());
        expense.setDate(expenseDTO.getDate());
        return convertToDTO(expenseRepository.save(expense));
    }

    public void deleteExpense(Long id, Long userId) {
        Expense expense = expenseRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found or not owned by user"));
        expenseRepository.delete(expense);
    }

    public List<ExpenseDTO> getExpensesByDate(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return expenseRepository.findByUserIdAndDateBetween(userId, startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ExpenseDTO convertToDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setName(expense.getName());
        dto.setAmount(expense.getAmount());
        dto.setNotes(expense.getNotes());
        dto.setUserId(expense.getUser().getId());
        dto.setCategoryId(expense.getCategory().getId());
        dto.setDate(expense.getDate());
        return dto;
    }
}