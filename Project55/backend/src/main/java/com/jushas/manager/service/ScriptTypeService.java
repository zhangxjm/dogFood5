package com.jushas.manager.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.jushas.manager.entity.ScriptType;

import java.util.List;

public interface ScriptTypeService extends IService<ScriptType> {
    List<ScriptType> getAllTypes();
    ScriptType getTypeById(Long id);
    boolean addType(ScriptType scriptType);
    boolean updateType(ScriptType scriptType);
    boolean deleteType(Long id);
}
