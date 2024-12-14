package com.backend.expense_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

public class AnalysisDTO {
    private LocalDate month;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal budgetLimit;
    private BigDecimal exceededAmount;
    private Map<String, BigDecimal> categoryExpense;

    // Getters and Setters
    public LocalDate getMonth() {
        return month;
    }

    public void setMonth(LocalDate month) {
        this.month = month;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public BigDecimal getBudgetLimit() {
        return budgetLimit;
    }

    public void setBudgetLimit(BigDecimal budgetLimit) {
        this.budgetLimit = budgetLimit;
    }

    public BigDecimal getExceededAmount() {
        return exceededAmount;
    }

    public void setExceededAmount(BigDecimal exceededAmount) {
        this.exceededAmount = exceededAmount;
    }

    public Map<String, BigDecimal> getCategoryExpense() {
        return categoryExpense;
    }

    public void setCategoryExpense(Map<String, BigDecimal> categoryExpense) {
        this.categoryExpense = categoryExpense;
    }
}