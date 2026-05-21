package com.babycare.member.repository;

import com.babycare.member.entity.BenefitClaimRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BenefitClaimRecordRepository extends JpaRepository<BenefitClaimRecord, Long> {
    List<BenefitClaimRecord> findByMemberIdOrderByCreatedAtDesc(Long memberId);
}