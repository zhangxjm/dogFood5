package com.snack.dto;

import lombok.Data;

@Data
public class HotSnackDTO {
    private Long snackId;
    private String snackName;
    private Long totalQuantity;
    private Double totalRevenue;

    public HotSnackDTO(Long snackId, String snackName, Long totalQuantity, Double totalRevenue) {
        this.snackId = snackId;
        this.snackName = snackName;
        this.totalQuantity = totalQuantity;
        this.totalRevenue = totalRevenue;
    }
}
