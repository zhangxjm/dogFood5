package com.freshfood.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("supply_record")
public class SupplyRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long supplierId;
    private Long productId;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalAmount;
    private LocalDate supplyDate;
    private String remark;
    private Long operatorId;
    private String operatorName;
    private LocalDateTime createTime;
    @TableLogic
    private Integer deleted;
    @TableField(exist = false)
    private String supplierName;
    @TableField(exist = false)
    private String productName;
}
