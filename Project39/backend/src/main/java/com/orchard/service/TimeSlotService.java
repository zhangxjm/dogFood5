package com.orchard.service;

import com.orchard.entity.TimeSlot;

import java.time.LocalDate;
import java.util.List;

public interface TimeSlotService {
    List<TimeSlot> getTimeSlotsByDate(LocalDate date);
    List<TimeSlot> getTimeSlotsByDateRange(LocalDate startDate, LocalDate endDate);
    TimeSlot createTimeSlot(TimeSlot timeSlot);
    TimeSlot updateTimeSlot(Long id, TimeSlot timeSlot);
    void deleteTimeSlot(Long id);
    TimeSlot getTimeSlotById(Long id);
}
