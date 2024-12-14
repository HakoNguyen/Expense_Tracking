package com.backend.expense_backend.controller;

import com.backend.expense_backend.dto.IncomeDTO;
import com.backend.expense_backend.service.IncomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {
    @Autowired
    private IncomeService incomeService;

    @GetMapping("/{userId}")
    public List<IncomeDTO> getAllIncomes(@PathVariable Long userId) {
        return incomeService.getAllIncomes(userId);
    }

    @PostMapping
    public IncomeDTO createIncome(@RequestBody IncomeDTO incomeDTO) {
        return incomeService.createIncome(incomeDTO);
    }

    @PutMapping("/{id}/{userId}")
    public IncomeDTO updateIncome(@PathVariable Long id, @PathVariable Long userId, @RequestBody IncomeDTO incomeDTO) {
        return incomeService.updateIncome(id, userId, incomeDTO);
    }

    @DeleteMapping("/{id}/{userId}")
    public void deleteIncome(@PathVariable Long id, @PathVariable Long userId) {
        incomeService.deleteIncome(id, userId);
    }
}