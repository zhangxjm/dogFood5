package com.jushas.manager.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.jushas.manager.entity.ScriptInventory;

import java.util.List;

public interface ScriptInventoryService extends IService<ScriptInventory> {
    List<ScriptInventory> getAllScripts();
    ScriptInventory getScriptById(Long id);
    List<ScriptInventory> getScriptsByType(Long typeId);
    boolean addScript(ScriptInventory scriptInventory);
    boolean updateScript(ScriptInventory scriptInventory);
    boolean deleteScript(Long id);
    boolean updateStock(Long id, int count);
}
