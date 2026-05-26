package com.company.teambuilding.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "review_record")
public class ReviewRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long planId;

    @Column(columnDefinition = "TEXT")
    private String highlights;

    @Column(columnDefinition = "TEXT")
    private String improvements;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private Integer satisfactionScore;

    @Column(length = 100)
    private String recorder;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
