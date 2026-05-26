package com.company.teambuilding.controller;

import com.company.teambuilding.common.Result;
import com.company.teambuilding.entity.ReviewRecord;
import com.company.teambuilding.service.ReviewRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewRecordController {

    @Autowired
    private ReviewRecordService reviewRecordService;

    @GetMapping("/plan/{planId}")
    public Result<ReviewRecord> findByPlanId(@PathVariable Long planId) {
        Optional<ReviewRecord> record = reviewRecordService.findByPlanId(planId);
        return record.map(Result::success).orElseGet(() -> Result.error("Review not found"));
    }

    @GetMapping("/{id}")
    public Result<ReviewRecord> findById(@PathVariable Long id) {
        Optional<ReviewRecord> record = reviewRecordService.findById(id);
        return record.map(Result::success).orElseGet(() -> Result.error("Review not found"));
    }

    @PostMapping
    public Result<ReviewRecord> create(@RequestBody ReviewRecord record) {
        return Result.success(reviewRecordService.save(record));
    }

    @PutMapping("/{id}")
    public Result<ReviewRecord> update(@PathVariable Long id, @RequestBody ReviewRecord record) {
        record.setId(id);
        return Result.success(reviewRecordService.save(record));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        reviewRecordService.delete(id);
        return Result.success();
    }
}
