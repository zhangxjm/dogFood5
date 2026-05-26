package com.afternoontea.dto;

import lombok.Data;

@Data
public class DepartmentStatsDTO {
    private Long departmentId;
    private String departmentName;
    private Long applicationCount;
    private Long totalQuantity;
    private Double totalAmount;
}
