package com.company.teambuilding.service;

import com.company.teambuilding.dto.PlanStatisticsDTO;
import com.company.teambuilding.entity.TeamBuildingPlan;
import com.company.teambuilding.repository.ExpenseRepository;
import com.company.teambuilding.repository.ParticipantRepository;
import com.company.teambuilding.repository.TeamBuildingPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class TeamBuildingPlanService {

    @Autowired
    private TeamBuildingPlanRepository planRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    public List<TeamBuildingPlan> findAll() {
        return planRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<TeamBuildingPlan> findById(Long id) {
        return planRepository.findById(id);
    }

    public TeamBuildingPlan save(TeamBuildingPlan plan) {
        return planRepository.save(plan);
    }

    @Transactional
    public void delete(Long id) {
        participantRepository.deleteByPlanId(id);
        expenseRepository.deleteByPlanId(id);
        planRepository.deleteById(id);
    }

    public PlanStatisticsDTO getStatistics(Long planId) {
        PlanStatisticsDTO dto = new PlanStatisticsDTO();
        dto.setPlanId(planId);
        dto.setParticipantCount(participantRepository.countByPlanId(planId));
        dto.setTotalExpense(expenseRepository.sumAmountByPlanId(planId));
        return dto;
    }
}
