package com.company.teambuilding.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PlanStatisticsDTO {
    private Long planId;
    private Long participantCount;
    private BigDecimal totalExpense;
}
