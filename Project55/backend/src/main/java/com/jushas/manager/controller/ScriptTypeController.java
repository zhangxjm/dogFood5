package com.jushas.manager.controller;

import com.jushas.manager.common.Result;
import com.jushas.manager.entity.ScriptType;
import com.jushas.manager.service.ScriptTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/script-type")
@CrossOrigin
public class ScriptTypeController {

    @Autowired
    private ScriptTypeService scriptTypeService;

    @GetMapping("/list")
    public Result<List<ScriptType>> list() {
        return Result.success(scriptTypeService.getAllTypes());
    }

    @GetMapping("/{id}")
    public Result<ScriptType> getById(@PathVariable Long id) {
        return Result.success(scriptTypeService.getTypeById(id));
    }

    @PostMapping("/add")
    public Result<Boolean> add(@RequestBody ScriptType scriptType) {
        return Result.success(scriptTypeService.addType(scriptType));
    }

    @PostMapping("/update")
    public Result<Boolean> update(@RequestBody ScriptType scriptType) {
        return Result.success(scriptTypeService.updateType(scriptType));
    }

    @DeleteMapping("/{id}")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(scriptTypeService.deleteType(id));
    }
}
