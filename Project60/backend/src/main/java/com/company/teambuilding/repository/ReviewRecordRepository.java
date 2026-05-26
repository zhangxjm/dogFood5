package com.company.teambuilding.repository;

import com.company.teambuilding.entity.ReviewRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ReviewRecordRepository extends JpaRepository<ReviewRecord, Long> {
    Optional<ReviewRecord> findByPlanId(Long planId);
    void deleteByPlanId(Long planId);
}
