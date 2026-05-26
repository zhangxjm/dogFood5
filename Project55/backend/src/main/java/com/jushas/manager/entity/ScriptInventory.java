package com.jushas.manager.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("script_inventory")
public class ScriptInventory {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private Long typeId;
    private Integer minPlayers;
    private Integer maxPlayers;
    private Integer duration;
    private String author;
    private String publisher;
    private String description;
    private Integer totalCopies;
    private Integer availableCopies;
    private String createTime;
}
