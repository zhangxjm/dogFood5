package com.afternoontea.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private Integer changeQuantity;

    @Column(length = 20)
    private String changeType;

    @Column(name = "record_time")
    private LocalDateTime recordTime;

    @Column(columnDefinition = "TEXT")
    private String remark;

    @PrePersist
    protected void onCreate() {
        recordTime = LocalDateTime.now();
    }
}
