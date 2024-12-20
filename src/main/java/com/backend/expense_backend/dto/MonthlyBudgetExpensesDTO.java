package com.backend.expense_backend.dto;

import lombok.Data;

@Data
public class MonthlyBudgetExpensesDTO {
    private String month; // Tên tháng
    private double totalExpenses; // Tổng chi tiêu
    private double budget; // Ngân sách
}
