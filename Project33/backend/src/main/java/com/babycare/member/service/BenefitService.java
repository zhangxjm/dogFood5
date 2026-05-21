package com.babycare.member.service;

import com.babycare.member.entity.Benefit;
import com.babycare.member.repository.BenefitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BenefitService {
    private final BenefitRepository benefitRepository;
    
    public List<Benefit> findAll() {
        return benefitRepository.findAll();
    }
    
    public List<Benefit> findAvailable() {
        return benefitRepository.findByStatusTrue();
    }
    
    public Optional<Benefit> findById(Long id) {
        return benefitRepository.findById(id);
    }
    
    @Transactional
    public Benefit save(Benefit benefit) {
        return benefitRepository.save(benefit);
    }
    
    @Transactional
    public void deleteById(Long id) {
        benefitRepository.deleteById(id);
    }
}