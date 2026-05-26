package com.stall.controller;

import com.stall.dto.SalesRecordDTO;
import com.stall.entity.SalesRecord;
import com.stall.service.SalesRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sales")
public class SalesRecordController {

    @Autowired
    private SalesRecordService salesRecordService;

    @GetMapping("/date/{date}")
    public ResponseEntity<List<SalesRecord>> getRecordsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(salesRecordService.getRecordsByDate(date));
    }

    @GetMapping("/range")
    public ResponseEntity<List<SalesRecord>> getRecordsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesRecordService.getRecordsByDateRange(startDate, endDate));
    }

    @GetMapping("/summary/{date}")
    public ResponseEntity<Map<String, Object>> getDailySummary(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(salesRecordService.getDailySummary(date));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getOverallStatistics() {
        return ResponseEntity.ok(salesRecordService.getOverallStatistics());
    }

    @GetMapping("/total/{date}")
    public ResponseEntity<BigDecimal> getTotalAmountByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(salesRecordService.getTotalAmountByDate(date));
    }

    @GetMapping("/hot-sales")
    public ResponseEntity<List<Map<String, Object>>> getHotSales(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(salesRecordService.getHotSales(startDate, endDate));
    }

    @PostMapping
    public ResponseEntity<SalesRecord> createRecord(@RequestBody SalesRecordDTO dto) {
        return ResponseEntity.ok(salesRecordService.createRecord(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalesRecord> updateRecord(@PathVariable Long id, @RequestBody SalesRecordDTO dto) {
        return ResponseEntity.ok(salesRecordService.updateRecord(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        salesRecordService.deleteRecord(id);
        return ResponseEntity.ok().build();
    }
}
