package com.hotel.linen.controller;

import com.hotel.linen.dto.ApiResponse;
import com.hotel.linen.entity.LinenInventory;
import com.hotel.linen.service.LinenInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class LinenInventoryController {

    @Autowired
    private LinenInventoryService service;

    @GetMapping
    public ApiResponse<List<LinenInventory>> findAll() {
        return ApiResponse.success(service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<LinenInventory> findById(@PathVariable Long id) {
        return service.findById(id)
                .map(ApiResponse::success)
                .orElse(ApiResponse.error("未找到记录"));
    }

    @PostMapping
    public ApiResponse<LinenInventory> save(@RequestBody LinenInventory linen) {
        return ApiResponse.success("添加成功", service.save(linen));
    }

    @PutMapping("/{id}")
    public ApiResponse<LinenInventory> update(@PathVariable Long id, @RequestBody LinenInventory linen) {
        linen.setId(id);
        return ApiResponse.success("更新成功", service.save(linen));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ApiResponse.success("删除成功", null);
    }

    @GetMapping("/type/{type}")
    public ApiResponse<List<LinenInventory>> findByType(@PathVariable String type) {
        return ApiResponse.success(service.findByType(type));
    }
}
