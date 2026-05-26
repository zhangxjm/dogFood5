package com.company.teambuilding.controller;

import com.company.teambuilding.common.Result;
import com.company.teambuilding.dto.PlanStatisticsDTO;
import com.company.teambuilding.entity.TeamBuildingPlan;
import com.company.teambuilding.service.TeamBuildingPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/plans")
public class TeamBuildingPlanController {

    @Autowired
    private TeamBuildingPlanService planService;

    @GetMapping
    public Result<List<TeamBuildingPlan>> findAll() {
        return Result.success(planService.findAll());
    }

    @GetMapping("/{id}")
    public Result<TeamBuildingPlan> findById(@PathVariable Long id) {
        Optional<TeamBuildingPlan> plan = planService.findById(id);
        return plan.map(Result::success).orElseGet(() -> Result.error("Plan not found"));
    }

    @PostMapping
    public Result<TeamBuildingPlan> create(@RequestBody TeamBuildingPlan plan) {
        return Result.success(planService.save(plan));
    }

    @PutMapping("/{id}")
    public Result<TeamBuildingPlan> update(@PathVariable Long id, @RequestBody TeamBuildingPlan plan) {
        plan.setId(id);
        return Result.success(planService.save(plan));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        planService.delete(id);
        return Result.success();
    }

    @GetMapping("/{id}/statistics")
    public Result<PlanStatisticsDTO> getStatistics(@PathVariable Long id) {
        return Result.success(planService.getStatistics(id));
    }
}
