package com.stationery.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("purchase_item")
public class PurchaseItem {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String itemName;
    private Long categoryId;
    private String specification;
    private String unit;
    private BigDecimal unitPrice;
    private Integer stockQuantity;
    private String description;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleted;
}
