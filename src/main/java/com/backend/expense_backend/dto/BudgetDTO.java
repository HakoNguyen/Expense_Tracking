package com.backend.expense_backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BudgetDTO {
    private Long id;
    private String name;
    private double amount;
    private int month;
    private int year;


}