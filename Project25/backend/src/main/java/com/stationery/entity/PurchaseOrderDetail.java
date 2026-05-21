package com.stationery.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("purchase_order_detail")
public class PurchaseOrderDetail {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long orderId;
    private Long itemId;
    private String itemName;
    private String specification;
    private String unit;
    private BigDecimal unitPrice;
    private Integer quantity;
    private BigDecimal amount;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleted;
}
