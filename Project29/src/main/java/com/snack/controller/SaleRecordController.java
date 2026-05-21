package com.snack.controller;

import com.snack.dto.HotSnackDTO;
import com.snack.dto.Result;
import com.snack.dto.SaleRecordDTO;
import com.snack.entity.SaleRecord;
import com.snack.service.SaleRecordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/sales")
public class SaleRecordController {

    @Autowired
    private SaleRecordService saleRecordService;

    @GetMapping
    public Result<List<SaleRecord>> listByDate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        return Result.success(saleRecordService.listByDate(date));
    }

    @PostMapping
    public Result<SaleRecord> create(@Valid @RequestBody SaleRecordDTO dto) {
        return Result.success(saleRecordService.create(dto));
    }

    @GetMapping("/hot")
    public Result<List<HotSnackDTO>> getHotSnacks(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        return Result.success(saleRecordService.getHotSnacks(date));
    }

    @GetMapping("/hot/range")
    public Result<List<HotSnackDTO>> getHotSnacksBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return Result.success(saleRecordService.getHotSnacksBetween(startDate, endDate));
    }
}
