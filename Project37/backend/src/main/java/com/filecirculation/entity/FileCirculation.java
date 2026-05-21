package com.filecirculation.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "file_circulation")
public class FileCirculation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long fileId;

    private Long circulatorId;

    @Column(length = 50)
    private String circulatorName;

    private Long receiverId;

    @Column(length = 50)
    private String receiverName;

    @Column(length = 500)
    private String message;

    private Boolean isRead;

    private LocalDateTime readTime;

    private LocalDateTime createTime;

    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
        isRead = false;
    }
}
