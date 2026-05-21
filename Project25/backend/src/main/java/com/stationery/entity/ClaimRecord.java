package com.stationery.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("claim_record")
public class ClaimRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long deptId;
    private Long itemId;
    private String itemName;
    private Integer quantity;
    private String applicant;
    private String remark;
    private LocalDateTime claimDate;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer deleted;
}
