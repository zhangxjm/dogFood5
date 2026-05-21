package com.teashop.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderCreateDTO {

    private String customerName;

    private String customerPhone;

    private BigDecimal totalAmount;

    private String remark;

    private List<OrderItemDTO> items;
}