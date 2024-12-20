package com.backend.expense_backend.repository;

import com.backend.expense_backend.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.date BETWEEN :startDate AND :endDate")
    BigDecimal findTotalExpensesByDate(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}