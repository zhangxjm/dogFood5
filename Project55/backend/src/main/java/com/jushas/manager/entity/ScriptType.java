package com.jushas.manager.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("script_type")
public class ScriptType {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String description;
    private Integer difficulty;
    private String createTime;
}
