package com.backend.expense_backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExpenseDTO {
    private Long id;
    private String name;
    private double amount;
    private String notes;

    private Long categoryId;
    private LocalDateTime date; // Thêm trường date
}