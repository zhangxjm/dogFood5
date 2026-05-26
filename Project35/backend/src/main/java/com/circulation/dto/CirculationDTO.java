package com.circulation.dto;

import com.circulation.entity.Circulation.ReadStatus;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CirculationDTO {

    private Long id;
    private Long documentId;
    private String documentName;
    private Long readerId;
    private String readerName;
    private String readerDepartment;
    private ReadStatus status;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
}
