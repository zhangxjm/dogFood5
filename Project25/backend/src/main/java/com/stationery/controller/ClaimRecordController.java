package com.stationery.controller;

import com.stationery.common.Result;
import com.stationery.entity.ClaimRecord;
import com.stationery.service.ClaimRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/claim")
@CrossOrigin
public class ClaimRecordController {

    @Autowired
    private ClaimRecordService claimRecordService;

    @GetMapping("/list")
    public Result<List<ClaimRecord>> list() {
        return Result.success(claimRecordService.listAll());
    }

    @GetMapping("/listByDept/{deptId}")
    public Result<List<ClaimRecord>> listByDept(@PathVariable Long deptId) {
        return Result.success(claimRecordService.listByDept(deptId));
    }

    @GetMapping("/statistics")
    public Result<List<Map<String, Object>>> statistics() {
        return Result.success(claimRecordService.getDeptClaimStatistics());
    }

    @PostMapping
    public Result<Void> save(@RequestBody ClaimRecord record) {
        if (claimRecordService.saveClaim(record)) {
            return Result.success();
        }
        return Result.error("申领失败");
    }
}
