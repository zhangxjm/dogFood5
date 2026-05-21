package com.babycare.member.service;

import com.babycare.member.entity.MemberLevel;
import com.babycare.member.repository.MemberLevelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MemberLevelService {
    private final MemberLevelRepository memberLevelRepository;
    
    public List<MemberLevel> findAll() {
        return memberLevelRepository.findAll();
    }
    
    public Optional<MemberLevel> findById(Long id) {
        return memberLevelRepository.findById(id);
    }
    
    public Optional<MemberLevel> findDefaultLevel() {
        return memberLevelRepository.findByIsDefaultTrue();
    }
    
    public Optional<MemberLevel> findByPoints(Integer points) {
        List<MemberLevel> levels = memberLevelRepository.findAll();
        return levels.stream()
                .filter(level -> points >= level.getMinPoints() && points <= level.getMaxPoints())
                .findFirst();
    }
    
    @Transactional
    public MemberLevel save(MemberLevel level) {
        return memberLevelRepository.save(level);
    }
    
    @Transactional
    public void deleteById(Long id) {
        memberLevelRepository.deleteById(id);
    }
}