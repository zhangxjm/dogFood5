package com.company.teambuilding.repository;

import com.company.teambuilding.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    List<Participant> findByPlanIdOrderByCreatedAtDesc(Long planId);
    void deleteByPlanId(Long planId);
    long countByPlanId(Long planId);
}
