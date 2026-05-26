package com.jushas.manager.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.jushas.manager.entity.ScriptType;
import com.jushas.manager.mapper.ScriptTypeMapper;
import com.jushas.manager.service.ScriptTypeService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ScriptTypeServiceImpl extends ServiceImpl<ScriptTypeMapper, ScriptType> implements ScriptTypeService {

    @Override
    public List<ScriptType> getAllTypes() {
        return list();
    }

    @Override
    public ScriptType getTypeById(Long id) {
        return getById(id);
    }

    @Override
    public boolean addType(ScriptType scriptType) {
        scriptType.setCreateTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        return save(scriptType);
    }

    @Override
    public boolean updateType(ScriptType scriptType) {
        return updateById(scriptType);
    }

    @Override
    public boolean deleteType(Long id) {
        return removeById(id);
    }
}
