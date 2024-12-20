package com.backend.expense_backend.controller;

import com.backend.expense_backend.dto.BudgetDTO;
import com.backend.expense_backend.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {
    @Autowired
    private BudgetService budgetService;

    @GetMapping
    public List<BudgetDTO> getAllBudgets() {
        return budgetService.getAllBudgets();
    }

    @PostMapping
    public BudgetDTO createBudget(@RequestBody BudgetDTO budgetDTO) {
        return budgetService.createBudget(budgetDTO);
    }

    @PutMapping("/{id}")
    public BudgetDTO updateBudget(@PathVariable Long id, @RequestBody BudgetDTO budgetDTO) {
        return budgetService.updateBudget(id, budgetDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteBudget(@PathVariable Long id) {
        budgetService.deleteBudget(id);
    }

    // Thêm phương thức để lấy ngân sách theo tháng và năm
    @GetMapping("/monthly/{month}/{year}")
    public BudgetDTO getBudgetForMonth(@PathVariable int month, @PathVariable int year) {
        return budgetService.getBudgetForMonth(month, year);
    }
}