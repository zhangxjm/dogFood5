package com.company.teambuilding.repository;

import com.company.teambuilding.entity.TeamBuildingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TeamBuildingPlanRepository extends JpaRepository<TeamBuildingPlan, Long> {
    List<TeamBuildingPlan> findByStatusOrderByCreatedAtDesc(String status);
    List<TeamBuildingPlan> findAllByOrderByCreatedAtDesc();
}
