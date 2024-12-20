package com.backend.expense_backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "income")
public class Income {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double amount;
    private String notes;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private LocalDateTime date; // Thêm trường date
}