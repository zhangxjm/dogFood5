package com.stationery.controller;

import com.stationery.common.Result;
import com.stationery.entity.Department;
import com.stationery.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/department")
@CrossOrigin
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping("/list")
    public Result<List<Department>> list() {
        return Result.success(departmentService.listAll());
    }

    @GetMapping("/{id}")
    public Result<Department> getById(@PathVariable Long id) {
        return Result.success(departmentService.getById(id));
    }

    @PostMapping
    public Result<Void> save(@RequestBody Department department) {
        if (departmentService.saveDept(department)) {
            return Result.success();
        }
        return Result.error("保存失败");
    }

    @PutMapping
    public Result<Void> update(@RequestBody Department department) {
        if (departmentService.updateDept(department)) {
            return Result.success();
        }
        return Result.error("更新失败");
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        if (departmentService.deleteDept(id)) {
            return Result.success();
        }
        return Result.error("删除失败");
    }
}
