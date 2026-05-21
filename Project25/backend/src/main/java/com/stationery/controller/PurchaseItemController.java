package com.stationery.controller;

import com.stationery.common.Result;
import com.stationery.entity.PurchaseItem;
import com.stationery.service.PurchaseItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/item")
@CrossOrigin
public class PurchaseItemController {

    @Autowired
    private PurchaseItemService itemService;

    @GetMapping("/list")
    public Result<List<PurchaseItem>> list() {
        return Result.success(itemService.listAll());
    }

    @GetMapping("/listByCategory/{categoryId}")
    public Result<List<PurchaseItem>> listByCategory(@PathVariable Long categoryId) {
        return Result.success(itemService.listByCategory(categoryId));
    }

    @GetMapping("/{id}")
    public Result<PurchaseItem> getById(@PathVariable Long id) {
        return Result.success(itemService.getById(id));
    }

    @PostMapping
    public Result<Void> save(@RequestBody PurchaseItem item) {
        if (itemService.saveItem(item)) {
            return Result.success();
        }
        return Result.error("保存失败");
    }

    @PutMapping
    public Result<Void> update(@RequestBody PurchaseItem item) {
        if (itemService.updateItem(item)) {
            return Result.success();
        }
        return Result.error("更新失败");
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        if (itemService.deleteItem(id)) {
            return Result.success();
        }
        return Result.error("删除失败");
    }
}
