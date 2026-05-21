package com.water.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "inventory_operation")
public class InventoryOperation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String operationType;
    
    @Column(nullable = false)
    private Integer quantity;
    
    private Integer beforeQuantity;
    
    private Integer afterQuantity;
    
    private String operator;
    
    private String remark;
    
    @Column(updatable = false)
    private LocalDateTime operationTime;
    
    @PrePersist
    protected void onCreate() {
        operationTime = LocalDateTime.now();
    }
}