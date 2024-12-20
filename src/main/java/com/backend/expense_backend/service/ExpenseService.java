package com.backend.expense_backend.service;

import com.backend.expense_backend.dto.ExpenseDTO;
import com.backend.expense_backend.model.Expense;
import com.backend.expense_backend.model.Category;
import com.backend.expense_backend.repository.ExpenseRepository;
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
    private CategoryRepository categoryRepository;

    public BigDecimal findTotalExpensesByDate(LocalDateTime startDate, LocalDateTime endDate) {
        return expenseRepository.findTotalExpensesByDate(startDate, endDate);
    }

    public List<ExpenseDTO> getAllExpenses() {
        return expenseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ExpenseDTO createExpense(ExpenseDTO expenseDTO) {
        Expense expense = new Expense();
        expense.setName(expenseDTO.getName());
        expense.setAmount(expenseDTO.getAmount());
        expense.setNotes(expenseDTO.getNotes());

        Category category = categoryRepository.findById(expenseDTO.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        expense.setCategory(category);

        expense.setDate(expenseDTO.getDate());
        return convertToDTO(expenseRepository.save(expense));
    }

    public ExpenseDTO updateExpense(Long id, ExpenseDTO expenseDTO) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));
        expense.setName(expenseDTO.getName());
        expense.setAmount(expenseDTO.getAmount());
        expense.setNotes(expenseDTO.getNotes());
        expense.setDate(expenseDTO.getDate());
        return convertToDTO(expenseRepository.save(expense));
    }

    public void deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));
        expenseRepository.delete(expense);
    }

    public List<ExpenseDTO> getExpensesByDate(LocalDateTime startDate, LocalDateTime endDate) {
        return expenseRepository.findByDateBetween(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ExpenseDTO convertToDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setName(expense.getName());
        dto.setAmount(expense.getAmount());
        dto.setNotes(expense.getNotes());
        dto.setCategoryId(expense.getCategory().getId());
        dto.setDate(expense.getDate());
        return dto;
    }
}