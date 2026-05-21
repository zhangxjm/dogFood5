package com.water.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyStatistics {
    private String month;
    private Integer totalClaims;
    private Integer totalBuckets;
}