package com.filecirculation.dto;

import lombok.Data;
import java.util.List;

@Data
public class CirculateRequest {
    private Long fileId;
    private Long circulatorId;
    private String message;
    private List<Long> receiverIds;
}
