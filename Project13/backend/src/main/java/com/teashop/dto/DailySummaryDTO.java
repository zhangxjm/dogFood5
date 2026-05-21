package com.teashop.dto;

import com.teashop.entity.Order;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class DailySummaryDTO {

    private LocalDate date;

    private Long totalOrders;

    private BigDecimal totalRevenue;

    private List<Order> orders;
}