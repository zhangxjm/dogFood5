package com.freshfood.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.freshfood.common.Result;
import com.freshfood.entity.SupplyRecord;
import com.freshfood.service.SupplyRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/supplyRecord")
public class SupplyRecordController {

    @Autowired
    private SupplyRecordService supplyRecordService;

    @GetMapping("/list")
    public Result<Page<SupplyRecord>> list(@RequestParam(defaultValue = "1") Integer pageNum,
                                           @RequestParam(defaultValue = "10") Integer pageSize,
                                           @RequestParam(required = false) Long supplierId,
                                           @RequestParam(required = false) Long productId) {
        return Result.success(supplyRecordService.pageList(pageNum, pageSize, supplierId, productId));
    }

    @GetMapping("/{id}")
    public Result<SupplyRecord> getById(@PathVariable Long id) {
        return Result.success(supplyRecordService.getById(id));
    }

    @PostMapping
    public Result<Void> add(@RequestBody SupplyRecord supplyRecord) {
        supplyRecordService.save(supplyRecord);
        return Result.success();
    }

    @PutMapping
    public Result<Void> update(@RequestBody SupplyRecord supplyRecord) {
        supplyRecordService.updateById(supplyRecord);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        supplyRecordService.removeById(id);
        return Result.success();
    }
}
