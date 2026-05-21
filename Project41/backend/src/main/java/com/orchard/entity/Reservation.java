package com.orchard.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("reservation")
public class Reservation {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String reservationNo;
    private Long timeSlotId;
    private String visitorName;
    private String visitorPhone;
    private Integer peopleCount;
    private String idCard;
    private Integer status;
    private LocalDateTime checkinTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
