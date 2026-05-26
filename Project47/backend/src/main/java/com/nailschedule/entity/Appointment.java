package com.nailschedule.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@TableName("appointment")
public class Appointment {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String customerName;
    private String customerPhone;
    private Long technicianId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String serviceType;
    private Integer status;
    private String remark;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
