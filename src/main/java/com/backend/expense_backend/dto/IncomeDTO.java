package com.backend.expense_backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class IncomeDTO {
    private Long id;
    private String name;
    private double amount;
    private String notes;
    private Long userId;
    private Long categoryId;
    private LocalDateTime date; // Thêm trường date
}