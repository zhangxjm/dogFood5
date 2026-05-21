package com.babycare.member.service;

import com.babycare.member.entity.ConsumptionRecord;
import com.babycare.member.entity.Member;
import com.babycare.member.repository.ConsumptionRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConsumptionRecordService {
    private final ConsumptionRecordRepository consumptionRecordRepository;
    private final MemberService memberService;
    
    public List<ConsumptionRecord> findAll() {
        return consumptionRecordRepository.findAll();
    }
    
    public Optional<ConsumptionRecord> findById(Long id) {
        return consumptionRecordRepository.findById(id);
    }
    
    public List<ConsumptionRecord> findByMemberId(Long memberId) {
        return consumptionRecordRepository.findByMemberIdOrderByCreatedAtDesc(memberId);
    }
    
    @Transactional
    public ConsumptionRecord save(ConsumptionRecord record) {
        if (record.getOrderNo() == null) {
            record.setOrderNo(generateOrderNo());
        }
        
        if (record.getPointsEarned() == null) {
            record.setPointsEarned(calculatePoints(record.getAmount()));
        }
        
        ConsumptionRecord saved = consumptionRecordRepository.save(record);
        
        Member member = memberService.updatePoints(record.getMember().getId(), record.getPointsEarned());
        member.setTotalConsumption(member.getTotalConsumption().add(record.getAmount()));
        memberService.save(member);
        
        return saved;
    }
    
    @Transactional
    public void deleteById(Long id) {
        consumptionRecordRepository.deleteById(id);
    }
    
    private String generateOrderNo() {
        String datetime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "O" + datetime + (int)(Math.random() * 1000);
    }
    
    private Integer calculatePoints(BigDecimal amount) {
        return amount.intValue();
    }
}