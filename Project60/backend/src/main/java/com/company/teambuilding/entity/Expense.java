package com.company.teambuilding.entity;

import lombok.Data;
import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "expense")
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long planId;

    @Column(nullable = false, length = 100)
    private String itemName;

    @Column(precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(length = 50)
    private String category;

    private LocalDate expenseDate;

    @Column(columnDefinition = "TEXT")
    private String remark;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
