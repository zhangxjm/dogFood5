package com.babycare.member.controller;

import com.babycare.member.entity.BenefitClaimRecord;
import com.babycare.member.service.BenefitClaimRecordService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/benefit-claims")
@RequiredArgsConstructor
public class BenefitClaimRecordController {
    private final BenefitClaimRecordService benefitClaimRecordService;
    
    @GetMapping
    public ResponseEntity<List<BenefitClaimRecord>> findAll() {
        return ResponseEntity.ok(benefitClaimRecordService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BenefitClaimRecord> findById(@PathVariable Long id) {
        return benefitClaimRecordService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<BenefitClaimRecord>> findByMemberId(@PathVariable Long memberId) {
        return ResponseEntity.ok(benefitClaimRecordService.findByMemberId(memberId));
    }
    
    @PostMapping("/claim")
    public ResponseEntity<?> claim(@RequestBody ClaimRequest request) {
        try {
            BenefitClaimRecord record = benefitClaimRecordService.claim(
                    request.getMemberId(),
                    request.getBenefitId(),
                    request.getOperator(),
                    request.getRemark()
            );
            return ResponseEntity.ok(record);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @Data
    public static class ClaimRequest {
        private Long memberId;
        private Long benefitId;
        private String operator;
        private String remark;
    }
}