package com.stationery.controller;

import com.stationery.common.Result;
import com.stationery.entity.Category;
import com.stationery.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/category")
@CrossOrigin
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/list")
    public Result<List<Category>> list() {
        return Result.success(categoryService.listAll());
    }

    @GetMapping("/{id}")
    public Result<Category> getById(@PathVariable Long id) {
        return Result.success(categoryService.getById(id));
    }

    @PostMapping
    public Result<Void> save(@RequestBody Category category) {
        if (categoryService.saveCategory(category)) {
            return Result.success();
        }
        return Result.error("保存失败");
    }

    @PutMapping
    public Result<Void> update(@RequestBody Category category) {
        if (categoryService.updateCategory(category)) {
            return Result.success();
        }
        return Result.error("更新失败");
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        if (categoryService.deleteCategory(id)) {
            return Result.success();
        }
        return Result.error("删除失败");
    }
}
