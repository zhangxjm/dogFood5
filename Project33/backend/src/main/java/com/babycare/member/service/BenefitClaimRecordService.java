package com.babycare.member.service;

import com.babycare.member.entity.Benefit;
import com.babycare.member.entity.BenefitClaimRecord;
import com.babycare.member.entity.Member;
import com.babycare.member.repository.BenefitClaimRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BenefitClaimRecordService {
    private final BenefitClaimRecordRepository benefitClaimRecordRepository;
    private final MemberService memberService;
    private final BenefitService benefitService;
    
    public List<BenefitClaimRecord> findAll() {
        return benefitClaimRecordRepository.findAll();
    }
    
    public Optional<BenefitClaimRecord> findById(Long id) {
        return benefitClaimRecordRepository.findById(id);
    }
    
    public List<BenefitClaimRecord> findByMemberId(Long memberId) {
        return benefitClaimRecordRepository.findByMemberIdOrderByCreatedAtDesc(memberId);
    }
    
    @Transactional
    public BenefitClaimRecord claim(Long memberId, Long benefitId, String operator, String remark) {
        Member member = memberService.findById(memberId)
                .orElseThrow(() -> new RuntimeException("会员不存在"));
        
        Benefit benefit = benefitService.findById(benefitId)
                .orElseThrow(() -> new RuntimeException("福利不存在"));
        
        if (!benefit.getStatus()) {
            throw new RuntimeException("福利已下架");
        }
        
        if (benefit.getStock() <= benefit.getClaimedCount()) {
            throw new RuntimeException("福利库存不足");
        }
        
        if (member.getAvailablePoints() < benefit.getPointsRequired()) {
            throw new RuntimeException("积分不足");
        }
        
        memberService.deductPoints(memberId, benefit.getPointsRequired());
        
        benefit.setClaimedCount(benefit.getClaimedCount() + 1);
        benefitService.save(benefit);
        
        BenefitClaimRecord record = new BenefitClaimRecord();
        record.setMember(member);
        record.setBenefit(benefit);
        record.setPointsUsed(benefit.getPointsRequired());
        record.setOperator(operator);
        record.setRemark(remark);
        
        return benefitClaimRecordRepository.save(record);
    }
}