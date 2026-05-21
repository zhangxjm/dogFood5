package com.babycare.member.repository;

import com.babycare.member.entity.MemberLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberLevelRepository extends JpaRepository<MemberLevel, Long> {
    Optional<MemberLevel> findByIsDefaultTrue();
    Optional<MemberLevel> findByMinPointsLessThanEqualAndMaxPointsGreaterThanEqual(Integer minPoints, Integer maxPoints);
}