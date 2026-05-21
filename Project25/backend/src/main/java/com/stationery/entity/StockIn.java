package com.stationery.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("stock_in")
public class StockIn {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long orderId;
    private String stockInNo;
    private Integer status;
    private String operator;
    private String remark;
    private LocalDateTime stockInDate;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleted;
}
