package com.freshfood.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("sale_record")
public class SaleRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long productId;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalAmount;
    private LocalDate saleDate;
    private LocalDateTime createTime;
    @TableLogic
    private Integer deleted;
    @TableField(exist = false)
    private String productName;
}
