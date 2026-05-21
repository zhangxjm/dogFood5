package com.freshfood.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("inventory_record")
public class InventoryRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long productId;
    private Integer beforeQuantity;
    private Integer afterQuantity;
    private Integer diffQuantity;
    private String remark;
    private Long operatorId;
    private String operatorName;
    private LocalDateTime checkTime;
    private LocalDateTime createTime;
    @TableLogic
    private Integer deleted;
    @TableField(exist = false)
    private String productName;
}
