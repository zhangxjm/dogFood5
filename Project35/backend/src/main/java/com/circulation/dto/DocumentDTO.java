package com.circulation.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDTO {

    private Long id;
    private String fileName;
    private String filePath;
    private Long fileSize;
    private String fileType;
    private Long uploaderId;
    private String uploaderName;
    private String description;
    private LocalDateTime createdAt;
    private List<CirculationDTO> circulations;
    private int totalReaders;
    private int readCount;
    private int pendingCount;
}
