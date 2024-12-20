package com.backend.expense_backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class AnalysisDTO {
    private LocalDate month;
    private BigDecimal totalExpense;
    private BigDecimal budgetLimit;
    private BigDecimal exceededAmount;
    private Map<String, BigDecimal> categoryExpense;
    private Map<String, BigDecimal> categoryIncome; // Thêm trường này
    private Map<String, BigDecimal> categoryExpensePercentage;
}