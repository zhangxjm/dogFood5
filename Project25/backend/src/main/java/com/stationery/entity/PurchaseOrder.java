package com.stationery.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("purchase_order")
public class PurchaseOrder {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String orderNo;
    private String supplier;
    private BigDecimal totalAmount;
    private Integer status;
    private String remark;
    private LocalDateTime orderDate;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleted;
}
