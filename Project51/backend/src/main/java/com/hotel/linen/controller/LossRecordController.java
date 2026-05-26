package com.hotel.linen.controller;

import com.hotel.linen.dto.ApiResponse;
import com.hotel.linen.entity.LossRecord;
import com.hotel.linen.service.LossRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loss")
public class LossRecordController {

    @Autowired
    private LossRecordService service;

    @GetMapping
    public ApiResponse<List<LossRecord>> findAll() {
        return ApiResponse.success(service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<LossRecord> findById(@PathVariable Long id) {
        return service.findById(id)
                .map(ApiResponse::success)
                .orElse(ApiResponse.error("未找到记录"));
    }

    @PostMapping
    public ApiResponse<LossRecord> save(@RequestBody LossRecord record) {
        return ApiResponse.success("添加成功", service.save(record));
    }

    @PutMapping("/{id}")
    public ApiResponse<LossRecord> update(@PathVariable Long id, @RequestBody LossRecord record) {
        record.setId(id);
        return ApiResponse.success("更新成功", service.save(record));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ApiResponse.success("删除成功", null);
    }

    @GetMapping("/linen/{linenId}")
    public ApiResponse<List<LossRecord>> findByLinenId(@PathVariable Long linenId) {
        return ApiResponse.success(service.findByLinenId(linenId));
    }
}
