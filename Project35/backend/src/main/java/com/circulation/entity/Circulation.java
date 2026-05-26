package com.circulation.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "circulations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"document_id", "reader_id"})
})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Circulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "document_id", nullable = false)
    private Long documentId;

    @Column(name = "reader_id", nullable = false)
    private Long readerId;

    @Column(length = 20)
    @Enumerated(EnumType.STRING)
    private ReadStatus status = ReadStatus.PENDING;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Transient
    private String readerName;

    @Transient
    private String readerDepartment;

    @Transient
    private String documentName;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum ReadStatus {
        PENDING, READ
    }
}
