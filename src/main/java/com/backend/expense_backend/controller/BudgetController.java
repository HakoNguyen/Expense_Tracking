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

    @GetMapping("/{userId}")
    public List<BudgetDTO> getAllBudgets(@PathVariable Long userId) {
        return budgetService.getAllBudgets(userId);
    }

    @PostMapping
    public BudgetDTO createBudget(@RequestBody BudgetDTO budgetDTO) {
        return budgetService.createBudget(budgetDTO);
    }

    @PutMapping("/{id}/{userId}")
    public BudgetDTO updateBudget(@PathVariable Long id, @PathVariable Long userId, @RequestBody BudgetDTO budgetDTO) {
        return budgetService.updateBudget(id, userId, budgetDTO);
    }

    @DeleteMapping("/{id}/{userId}")
    public void deleteBudget(@PathVariable Long id, @PathVariable Long userId) {
        budgetService.deleteBudget(id, userId);
    }
}