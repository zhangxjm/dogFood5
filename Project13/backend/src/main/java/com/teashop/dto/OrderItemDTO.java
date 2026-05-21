package com.teashop.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemDTO {

    private Long drinkId;

    private String drinkName;

    private BigDecimal price;

    private Integer quantity;
}