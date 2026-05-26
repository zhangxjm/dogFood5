package com.jushas.manager.controller;

import com.jushas.manager.common.Result;
import com.jushas.manager.entity.ScriptInventory;
import com.jushas.manager.service.ScriptInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/script-inventory")
@CrossOrigin
public class ScriptInventoryController {

    @Autowired
    private ScriptInventoryService scriptInventoryService;

    @GetMapping("/list")
    public Result<List<ScriptInventory>> list() {
        return Result.success(scriptInventoryService.getAllScripts());
    }

    @GetMapping("/{id}")
    public Result<ScriptInventory> getById(@PathVariable Long id) {
        return Result.success(scriptInventoryService.getScriptById(id));
    }

    @GetMapping("/type/{typeId}")
    public Result<List<ScriptInventory>> getByType(@PathVariable Long typeId) {
        return Result.success(scriptInventoryService.getScriptsByType(typeId));
    }

    @PostMapping("/add")
    public Result<Boolean> add(@RequestBody ScriptInventory scriptInventory) {
        return Result.success(scriptInventoryService.addScript(scriptInventory));
    }

    @PostMapping("/update")
    public Result<Boolean> update(@RequestBody ScriptInventory scriptInventory) {
        return Result.success(scriptInventoryService.updateScript(scriptInventory));
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(scriptInventoryService.deleteScript(id));
    }

    @PostMapping("/update-stock")
    public Result<Boolean> updateStock(@RequestParam Long id, @RequestParam int count) {
        return Result.success(scriptInventoryService.updateStock(id, count));
    }
}
