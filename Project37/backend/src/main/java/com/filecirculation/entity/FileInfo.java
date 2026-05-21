package com.filecirculation.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "file_info")
public class FileInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String fileName;

    @Column(length = 50)
    private String fileType;

    private Long fileSize;

    @Column(length = 500)
    private String filePath;

    private Long uploaderId;

    @Column(length = 50)
    private String uploaderName;

    private LocalDateTime uploadTime;

    @Column(length = 500)
    private String description;

    @PrePersist
    protected void onCreate() {
        uploadTime = LocalDateTime.now();
    }
}
