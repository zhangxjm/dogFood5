package com.babycare.member.controller;

import com.babycare.member.entity.MemberLevel;
import com.babycare.member.service.MemberLevelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/member-levels")
@RequiredArgsConstructor
public class MemberLevelController {
    private final MemberLevelService memberLevelService;
    
    @GetMapping
    public ResponseEntity<List<MemberLevel>> findAll() {
        return ResponseEntity.ok(memberLevelService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<MemberLevel> findById(@PathVariable Long id) {
        return memberLevelService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<MemberLevel> save(@RequestBody MemberLevel level) {
        return ResponseEntity.ok(memberLevelService.save(level));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<MemberLevel> update(@PathVariable Long id, @RequestBody MemberLevel level) {
        level.setId(id);
        return ResponseEntity.ok(memberLevelService.save(level));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        memberLevelService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}