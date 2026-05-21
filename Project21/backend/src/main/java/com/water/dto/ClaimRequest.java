package com.water.dto;

import lombok.Data;

@Data
public class ClaimRequest {
    private String employeeName;
    private String employeeNo;
    private String department;
    private Integer quantity;
    private String remark;
}