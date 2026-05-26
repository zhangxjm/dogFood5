package com.orchard.repository;

import com.orchard.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    @Query("SELECT t FROM TimeSlot t WHERE t.date = :date AND t.active = true ORDER BY t.startTime")
    List<TimeSlot> findByDate(@Param("date") LocalDate date);

    @Query("SELECT t FROM TimeSlot t WHERE t.date >= :startDate AND t.date <= :endDate AND t.active = true ORDER BY t.date, t.startTime")
    List<TimeSlot> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
