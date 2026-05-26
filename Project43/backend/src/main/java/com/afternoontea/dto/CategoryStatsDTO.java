package com.afternoontea.dto;

import lombok.Data;

@Data
public class CategoryStatsDTO {
    private Long categoryId;
    private String categoryName;
    private Long totalQuantity;
    private Double totalAmount;
}
