package com.hotel.linen.controller;

import com.hotel.linen.dto.ApiResponse;
import com.hotel.linen.entity.CleaningRecord;
import com.hotel.linen.service.CleaningRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cleaning")
public class CleaningRecordController {

    @Autowired
    private CleaningRecordService service;

    @GetMapping
    public ApiResponse<List<CleaningRecord>> findAll() {
        return ApiResponse.success(service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<CleaningRecord> findById(@PathVariable Long id) {
        return service.findById(id)
                .map(ApiResponse::success)
                .orElse(ApiResponse.error("未找到记录"));
    }

    @PostMapping
    public ApiResponse<CleaningRecord> save(@RequestBody CleaningRecord record) {
        return ApiResponse.success("添加成功", service.save(record));
    }

    @PutMapping("/{id}")
    public ApiResponse<CleaningRecord> update(@PathVariable Long id, @RequestBody CleaningRecord record) {
        record.setId(id);
        return ApiResponse.success("更新成功", service.save(record));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ApiResponse.success("删除成功", null);
    }

    @GetMapping("/linen/{linenId}")
    public ApiResponse<List<CleaningRecord>> findByLinenId(@PathVariable Long linenId) {
        return ApiResponse.success(service.findByLinenId(linenId));
    }
}
