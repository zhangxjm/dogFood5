package com.babycare.member.controller;

import com.babycare.member.entity.Member;
import com.babycare.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;
    
    @GetMapping
    public ResponseEntity<List<Member>> findAll() {
        return ResponseEntity.ok(memberService.findAll());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Member> findById(@PathVariable Long id) {
        return memberService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Member>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(memberService.search(keyword));
    }
    
    @PostMapping
    public ResponseEntity<Member> save(@Valid @RequestBody Member member) {
        return ResponseEntity.ok(memberService.save(member));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Member> update(@PathVariable Long id, @Valid @RequestBody Member member) {
        member.setId(id);
        return ResponseEntity.ok(memberService.save(member));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        memberService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}