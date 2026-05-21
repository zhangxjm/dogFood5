package com.babycare.member.controller;

import com.babycare.member.entity.Benefit;
import com.babycare.member.service.BenefitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/benefits")
@RequiredArgsConstructor
public class BenefitController {
    private final BenefitService benefitService;
    
    @GetMapping
    public ResponseEntity<List<Benefit>> findAll() {
        return ResponseEntity.ok(benefitService.findAll());
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<Benefit>> findAvailable() {
        return ResponseEntity.ok(benefitService.findAvailable());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Benefit> findById(@PathVariable Long id) {
        return benefitService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Benefit> save(@RequestBody Benefit benefit) {
        return ResponseEntity.ok(benefitService.save(benefit));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Benefit> update(@PathVariable Long id, @RequestBody Benefit benefit) {
        benefit.setId(id);
        return ResponseEntity.ok(benefitService.save(benefit));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        benefitService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}