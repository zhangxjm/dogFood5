package com.freshfood.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.freshfood.common.Result;
import com.freshfood.entity.Inventory;
import com.freshfood.entity.InventoryRecord;
import com.freshfood.service.InventoryRecordService;
import com.freshfood.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;
    @Autowired
    private InventoryRecordService inventoryRecordService;

    @GetMapping("/list")
    public Result<Page<Inventory>> list(@RequestParam(defaultValue = "1") Integer pageNum,
                                        @RequestParam(defaultValue = "10") Integer pageSize,
                                        @RequestParam(required = false) Long productId) {
        return Result.success(inventoryService.pageList(pageNum, pageSize, productId));
    }

    @GetMapping("/record/list")
    public Result<Page<InventoryRecord>> recordList(@RequestParam(defaultValue = "1") Integer pageNum,
                                                    @RequestParam(defaultValue = "10") Integer pageSize,
                                                    @RequestParam(required = false) Long productId) {
        return Result.success(inventoryRecordService.pageList(pageNum, pageSize, productId));
    }

    @GetMapping("/{id}")
    public Result<Inventory> getById(@PathVariable Long id) {
        return Result.success(inventoryService.getById(id));
    }

    @PostMapping("/check")
    public Result<Void> check(@RequestBody Map<String, Object> params) {
        Long inventoryId = Long.valueOf(params.get("inventoryId").toString());
        Integer afterQuantity = Integer.valueOf(params.get("afterQuantity").toString());
        String remark = params.get("remark") != null ? params.get("remark").toString() : "";
        Long operatorId = 1L;
        String operatorName = "管理员";
        inventoryService.checkInventory(inventoryId, afterQuantity, remark, operatorId, operatorName);
        return Result.success();
    }

    @PutMapping
    public Result<Void> update(@RequestBody Inventory inventory) {
        inventoryService.updateById(inventory);
        return Result.success();
    }
}
