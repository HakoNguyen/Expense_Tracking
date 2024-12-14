package com.backend.expense_backend.controller;

import com.backend.expense_backend.dto.ExpenseDTO;
import com.backend.expense_backend.dto.IncomeDTO;
import com.backend.expense_backend.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;

    @GetMapping("/{userId}")
    public List<ExpenseDTO> getAllExpenses(@PathVariable Long userId) {
        return expenseService.getAllExpenses(userId);
    }

    @PostMapping
    public ExpenseDTO createExpense(@RequestBody ExpenseDTO expenseDTO) {
        return expenseService.createExpense(expenseDTO);
    }

    @PutMapping("/{id}/{userId}")
    public ExpenseDTO updateExpense(@PathVariable Long id, @PathVariable Long userId, @RequestBody ExpenseDTO expenseDTO) {
        return expenseService.updateExpense(id, userId, expenseDTO);
    }

    @DeleteMapping("/{id}/{userId}")
    public void deleteExpense(@PathVariable Long id, @PathVariable Long userId) {
        expenseService.deleteExpense(id, userId);
    }
}