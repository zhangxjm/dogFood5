package com.babycare.member.controller;

import com.babycare.member.entity.ConsumptionRecord;
import com.babycare.member.service.ConsumptionRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consumption-records")
@RequiredArgsConstructor
public class ConsumptionRecordController {
    private final ConsumptionRecordService consumptionRecordService;
    
    @GetMapping
    public ResponseEntity<List<ConsumptionRecord>> findAll() {
        return ResponseEntity.ok(consumptionRecordService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ConsumptionRecord> findById(@PathVariable Long id) {
        return consumptionRecordService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<ConsumptionRecord>> findByMemberId(@PathVariable Long memberId) {
        return ResponseEntity.ok(consumptionRecordService.findByMemberId(memberId));
    }
    
    @PostMapping
    public ResponseEntity<ConsumptionRecord> save(@RequestBody ConsumptionRecord record) {
        return ResponseEntity.ok(consumptionRecordService.save(record));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        consumptionRecordService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}