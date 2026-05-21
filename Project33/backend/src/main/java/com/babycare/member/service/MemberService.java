package com.babycare.member.service;

import com.babycare.member.entity.Member;
import com.babycare.member.entity.MemberLevel;
import com.babycare.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;
    private final MemberLevelService memberLevelService;
    
    public List<Member> findAll() {
        return memberRepository.findAll();
    }
    
    public Optional<Member> findById(Long id) {
        return memberRepository.findById(id);
    }
    
    public Optional<Member> findByPhone(String phone) {
        return memberRepository.findByPhone(phone);
    }
    
    public Optional<Member> findByMemberNo(String memberNo) {
        return memberRepository.findByMemberNo(memberNo);
    }
    
    public List<Member> search(String keyword) {
        return memberRepository.search(keyword);
    }
    
    @Transactional
    public Member save(Member member) {
        if (member.getMemberNo() == null) {
            member.setMemberNo(generateMemberNo());
        }
        
        if (member.getLevel() == null) {
            MemberLevel defaultLevel = memberLevelService.findDefaultLevel()
                    .orElseGet(() -> {
                        MemberLevel level = new MemberLevel();
                        level.setName("普通会员");
                        level.setMinPoints(0);
                        level.setMaxPoints(1000);
                        level.setIsDefault(true);
                        return memberLevelService.save(level);
                    });
            member.setLevel(defaultLevel);
        }
        
        return memberRepository.save(member);
    }
    
    @Transactional
    public void deleteById(Long id) {
        memberRepository.deleteById(id);
    }
    
    @Transactional
    public Member updatePoints(Long memberId, Integer points) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("会员不存在"));
        
        member.setTotalPoints(member.getTotalPoints() + points);
        member.setAvailablePoints(member.getAvailablePoints() + points);
        
        memberLevelService.findByPoints(member.getTotalPoints())
                .ifPresent(member::setLevel);
        
        return memberRepository.save(member);
    }
    
    @Transactional
    public Member deductPoints(Long memberId, Integer points) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("会员不存在"));
        
        if (member.getAvailablePoints() < points) {
            throw new RuntimeException("积分不足");
        }
        
        member.setAvailablePoints(member.getAvailablePoints() - points);
        return memberRepository.save(member);
    }
    
    private String generateMemberNo() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = memberRepository.count() + 1;
        return "M" + date + String.format("%04d", count);
    }
}