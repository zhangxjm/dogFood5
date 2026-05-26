package com.hotel.linen.controller;

import com.hotel.linen.dto.ApiResponse;
import com.hotel.linen.entity.UsageRecord;
import com.hotel.linen.service.UsageRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usage")
public class UsageRecordController {

    @Autowired
    private UsageRecordService service;

    @GetMapping
    public ApiResponse<List<UsageRecord>> findAll() {
        return ApiResponse.success(service.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<UsageRecord> findById(@PathVariable Long id) {
        return service.findById(id)
                .map(ApiResponse::success)
                .orElse(ApiResponse.error("未找到记录"));
    }

    @PostMapping
    public ApiResponse<UsageRecord> save(@RequestBody UsageRecord record) {
        return ApiResponse.success("添加成功", service.save(record));
    }

    @PutMapping("/{id}")
    public ApiResponse<UsageRecord> update(@PathVariable Long id, @RequestBody UsageRecord record) {
        record.setId(id);
        return ApiResponse.success("更新成功", service.save(record));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ApiResponse.success("删除成功", null);
    }

    @GetMapping("/linen/{linenId}")
    public ApiResponse<List<UsageRecord>> findByLinenId(@PathVariable Long linenId) {
        return ApiResponse.success(service.findByLinenId(linenId));
    }

    @PostMapping("/return/{id}")
    public ApiResponse<UsageRecord> returnLinen(@PathVariable Long id) {
        UsageRecord record = service.returnLinen(id);
        if (record != null) {
            return ApiResponse.success("归还成功", record);
        }
        return ApiResponse.error("归还失败");
    }
}
