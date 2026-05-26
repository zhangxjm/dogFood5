package com.company.teambuilding.service;

import com.company.teambuilding.entity.ReviewRecord;
import com.company.teambuilding.repository.ReviewRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ReviewRecordService {

    @Autowired
    private ReviewRecordRepository reviewRecordRepository;

    public Optional<ReviewRecord> findByPlanId(Long planId) {
        return reviewRecordRepository.findByPlanId(planId);
    }

    public Optional<ReviewRecord> findById(Long id) {
        return reviewRecordRepository.findById(id);
    }

    public ReviewRecord save(ReviewRecord record) {
        return reviewRecordRepository.save(record);
    }

    public void delete(Long id) {
        reviewRecordRepository.deleteById(id);
    }
}
