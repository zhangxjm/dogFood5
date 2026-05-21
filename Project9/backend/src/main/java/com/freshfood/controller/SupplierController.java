package com.freshfood.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.freshfood.common.Result;
import com.freshfood.entity.Supplier;
import com.freshfood.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/supplier")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @GetMapping("/list")
    public Result<Page<Supplier>> list(@RequestParam(defaultValue = "1") Integer pageNum,
                                       @RequestParam(defaultValue = "10") Integer pageSize,
                                       @RequestParam(required = false) String name) {
        return Result.success(supplierService.pageList(pageNum, pageSize, name));
    }

    @GetMapping("/all")
    public Result<List<Supplier>> all() {
        return Result.success(supplierService.listAll());
    }

    @GetMapping("/{id}")
    public Result<Supplier> getById(@PathVariable Long id) {
        return Result.success(supplierService.getById(id));
    }

    @PostMapping
    public Result<Void> add(@RequestBody Supplier supplier) {
        supplierService.save(supplier);
        return Result.success();
    }

    @PutMapping
    public Result<Void> update(@RequestBody Supplier supplier) {
        supplierService.updateById(supplier);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        supplierService.removeById(id);
        return Result.success();
    }
}
