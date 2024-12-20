package com.backend.expense_backend.service;

import com.backend.expense_backend.dto.IncomeDTO;
import com.backend.expense_backend.model.Budget;
import com.backend.expense_backend.model.Category;
import com.backend.expense_backend.model.Income;
import com.backend.expense_backend.repository.BudgetRepository;
import com.backend.expense_backend.repository.CategoryRepository;
import com.backend.expense_backend.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class IncomeService {
    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    public List<IncomeDTO> getAllIncomes() {
        return incomeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public IncomeDTO createIncome(IncomeDTO incomeDTO) {
        Income income = new Income();
        income.setName(incomeDTO.getName());
        income.setAmount(incomeDTO.getAmount());
        income.setNotes(incomeDTO.getNotes());

        Category category = categoryRepository.findById(incomeDTO.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        income.setCategory(category);

        income.setDate(incomeDTO.getDate());

        // Cập nhật ngân sách cho tháng và năm tương ứng
        Budget budget = budgetRepository.findByMonthAndYear(income.getDate().getMonthValue(), income.getDate().getYear())
                .orElseThrow(() -> new IllegalArgumentException("Budget not found"));

        budget.setAmount(budget.getAmount() + income.getAmount()); // Cộng thu nhập vào ngân sách
        budgetRepository.save(budget); // Lưu ngân sách đã cập nhật

        return convertToDTO(incomeRepository.save(income));
    }

    public IncomeDTO updateIncome(Long id, IncomeDTO incomeDTO) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Income not found"));
        income.setName(incomeDTO.getName());
        income.setAmount(incomeDTO.getAmount());
        income.setNotes(incomeDTO.getNotes());
        income.setDate(incomeDTO.getDate());
        return convertToDTO(incomeRepository.save(income));
    }

    public void deleteIncome(Long id) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Income not found"));
        incomeRepository.delete(income);
    }

    public List<IncomeDTO> getIncomesByDate(LocalDateTime startDate, LocalDateTime endDate) {
        return incomeRepository.findByDateBetween(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private IncomeDTO convertToDTO(Income income) {
        IncomeDTO dto = new IncomeDTO();
        dto.setId(income.getId());
        dto.setName(income.getName());
        dto.setAmount(income.getAmount());
        dto.setNotes(income.getNotes());
        dto.setCategoryId(income.getCategory().getId());
        dto.setDate(income.getDate());
        return dto;
    }
}