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

    @GetMapping
    public List<IncomeDTO> getAllIncomes() {
        return incomeService.getAllIncomes();
    }

    @PostMapping
    public IncomeDTO createIncome(@RequestBody IncomeDTO incomeDTO) {
        return incomeService.createIncome(incomeDTO); // Phương thức này đã được cập nhật để tự động cộng thu nhập vào ngân sách
    }

    @PutMapping("/{id}")
    public IncomeDTO updateIncome(@PathVariable Long id, @RequestBody IncomeDTO incomeDTO) {
        return incomeService.updateIncome(id, incomeDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteIncome(@PathVariable Long id) {
        incomeService.deleteIncome(id);
    }
}