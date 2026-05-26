package com.jushas.manager.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.jushas.manager.entity.ScriptInventory;
import com.jushas.manager.mapper.ScriptInventoryMapper;
import com.jushas.manager.service.ScriptInventoryService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ScriptInventoryServiceImpl extends ServiceImpl<ScriptInventoryMapper, ScriptInventory> implements ScriptInventoryService {

    @Override
    public List<ScriptInventory> getAllScripts() {
        return list();
    }

    @Override
    public ScriptInventory getScriptById(Long id) {
        return getById(id);
    }

    @Override
    public List<ScriptInventory> getScriptsByType(Long typeId) {
        LambdaQueryWrapper<ScriptInventory> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ScriptInventory::getTypeId, typeId);
        return list(wrapper);
    }

    @Override
    public boolean addScript(ScriptInventory scriptInventory) {
        scriptInventory.setCreateTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        if (scriptInventory.getAvailableCopies() == null) {
            scriptInventory.setAvailableCopies(scriptInventory.getTotalCopies());
        }
        return save(scriptInventory);
    }

    @Override
    public boolean updateScript(ScriptInventory scriptInventory) {
        return updateById(scriptInventory);
    }

    @Override
    public boolean deleteScript(Long id) {
        return removeById(id);
    }

    @Override
    public boolean updateStock(Long id, int count) {
        ScriptInventory script = getById(id);
        if (script != null) {
            int newAvailable = script.getAvailableCopies() + count;
            if (newAvailable < 0) {
                return false;
            }
            script.setAvailableCopies(newAvailable);
            return updateById(script);
        }
        return false;
    }
}
