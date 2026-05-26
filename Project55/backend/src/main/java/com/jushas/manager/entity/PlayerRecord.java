package com.jushas.manager.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("player_record")
public class PlayerRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long sessionId;
    private String playerName;
    private String phone;
    private String roleName;
    private Integer score;
    private String comments;
    private String createTime;
}
