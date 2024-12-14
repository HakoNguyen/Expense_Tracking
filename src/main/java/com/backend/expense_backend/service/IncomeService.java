package com.backend.expense_backend.service;

import com.backend.expense_backend.dto.IncomeDTO;
import com.backend.expense_backend.model.Category;
import com.backend.expense_backend.model.Income;
import com.backend.expense_backend.model.User;
import com.backend.expense_backend.repository.CategoryRepository;
import com.backend.expense_backend.repository.IncomeRepository;
import com.backend.expense_backend.repository.UserRepository;
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
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<IncomeDTO> getAllIncomes(Long userId) {
        return incomeRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public IncomeDTO createIncome(IncomeDTO incomeDTO) {
        Income income = new Income();
        income.setName(incomeDTO.getName());
        income.setAmount(incomeDTO.getAmount());
        income.setNotes(incomeDTO.getNotes());

        // Tìm kiếm User và Category từ repository
        User user = userRepository.findById(incomeDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User  not found"));
        income.setUser (user);

        Category category = categoryRepository.findById(incomeDTO.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        income.setCategory(category);

        income.setDate(incomeDTO.getDate());
        return convertToDTO(incomeRepository.save(income));
    }

    public IncomeDTO updateIncome(Long id, Long userId, IncomeDTO incomeDTO) {
        Income income = incomeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Income not found or not owned by user"));
        income.setName(incomeDTO.getName());
        income.setAmount(incomeDTO.getAmount());
        income.setNotes(incomeDTO.getNotes());
        income.setDate(incomeDTO.getDate());
        return convertToDTO(incomeRepository.save(income));
    }

    public void deleteIncome(Long id, Long userId) {
        Income income = incomeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Income not found or not owned by user"));
        incomeRepository.delete(income);
    }

    public List<IncomeDTO> getIncomesByDate(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return incomeRepository.findByUserIdAndDateBetween(userId, startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private IncomeDTO convertToDTO(Income income) {
        IncomeDTO dto = new IncomeDTO();
        dto.setId(income.getId());
        dto.setName(income.getName());
        dto.setAmount(income.getAmount());
        dto.setNotes(income.getNotes());
        dto.setUserId(income.getUser ().getId());
        dto.setCategoryId(income.getCategory().getId());
        dto.setDate(income.getDate());
        return dto;
    }
}