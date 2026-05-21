package com.water.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "employee_claim")
public class EmployeeClaim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String employeeName;
    
    @Column(nullable = false)
    private String employeeNo;
    
    private String department;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(updatable = false)
    private LocalDateTime claimTime;
    
    private String remark;
    
    @PrePersist
    protected void onCreate() {
        claimTime = LocalDateTime.now();
    }
}