package com.company.teambuilding.controller;

import com.company.teambuilding.common.Result;
import com.company.teambuilding.entity.Participant;
import com.company.teambuilding.service.ParticipantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/participants")
public class ParticipantController {

    @Autowired
    private ParticipantService participantService;

    @GetMapping("/plan/{planId}")
    public Result<List<Participant>> findByPlanId(@PathVariable Long planId) {
        return Result.success(participantService.findByPlanId(planId));
    }

    @GetMapping("/{id}")
    public Result<Participant> findById(@PathVariable Long id) {
        Optional<Participant> participant = participantService.findById(id);
        return participant.map(Result::success).orElseGet(() -> Result.error("Participant not found"));
    }

    @PostMapping
    public Result<Participant> create(@RequestBody Participant participant) {
        return Result.success(participantService.save(participant));
    }

    @PutMapping("/{id}")
    public Result<Participant> update(@PathVariable Long id, @RequestBody Participant participant) {
        participant.setId(id);
        return Result.success(participantService.save(participant));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        participantService.delete(id);
        return Result.success();
    }
}
