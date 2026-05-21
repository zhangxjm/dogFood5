package com.water.dto;

import lombok.Data;

@Data
public class StockInRequest {
    private Integer quantity;
    private String brand;
    private Double pricePerBucket;
    private String operator;
    private String remark;
}