package com.orchard.service.impl;

import com.orchard.entity.TimeSlot;
import com.orchard.repository.TimeSlotRepository;
import com.orchard.service.TimeSlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TimeSlotServiceImpl implements TimeSlotService {

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Override
    public List<TimeSlot> getTimeSlotsByDate(LocalDate date) {
        return timeSlotRepository.findByDate(date);
    }

    @Override
    public List<TimeSlot> getTimeSlotsByDateRange(LocalDate startDate, LocalDate endDate) {
        return timeSlotRepository.findByDateRange(startDate, endDate);
    }

    @Override
    public TimeSlot createTimeSlot(TimeSlot timeSlot) {
        if (timeSlot.getBookedCount() == null) {
            timeSlot.setBookedCount(0);
        }
        if (timeSlot.getActive() == null) {
            timeSlot.setActive(true);
        }
        return timeSlotRepository.save(timeSlot);
    }

    @Override
    public TimeSlot updateTimeSlot(Long id, TimeSlot timeSlot) {
        TimeSlot existing = timeSlotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TimeSlot not found"));
        existing.setDate(timeSlot.getDate());
        existing.setStartTime(timeSlot.getStartTime());
        existing.setEndTime(timeSlot.getEndTime());
        existing.setMaxCapacity(timeSlot.getMaxCapacity());
        existing.setPrice(timeSlot.getPrice());
        existing.setActive(timeSlot.getActive());
        return timeSlotRepository.save(existing);
    }

    @Override
    public void deleteTimeSlot(Long id) {
        timeSlotRepository.deleteById(id);
    }

    @Override
    public TimeSlot getTimeSlotById(Long id) {
        return timeSlotRepository.findById(id).orElse(null);
    }
}
