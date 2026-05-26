package com.jushas.manager.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("session_record")
public class SessionRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long scriptId;
    private String sessionName;
    private String hostName;
    private String startTime;
    private String endTime;
    private Integer playerCount;
    private Integer status;
    private String remarks;
    private String createTime;
}
