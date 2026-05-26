package com.company.teambuilding.service;

import com.company.teambuilding.entity.Participant;
import com.company.teambuilding.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ParticipantService {

    @Autowired
    private ParticipantRepository participantRepository;

    public List<Participant> findByPlanId(Long planId) {
        return participantRepository.findByPlanIdOrderByCreatedAtDesc(planId);
    }

    public Optional<Participant> findById(Long id) {
        return participantRepository.findById(id);
    }

    public Participant save(Participant participant) {
        return participantRepository.save(participant);
    }

    public void delete(Long id) {
        participantRepository.deleteById(id);
    }
}
