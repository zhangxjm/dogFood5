package com.nailschedule.controller;

import com.nailschedule.common.Result;
import com.nailschedule.entity.Schedule;
import com.nailschedule.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/range")
    public Result<List<Map<String, Object>>> findByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return Result.success(scheduleService.findByDateRange(startDate, endDate));
    }

    @GetMapping("/technician/{technicianId}")
    public Result<List<Schedule>> findByTechnicianAndDate(
            @PathVariable Long technicianId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return Result.success(scheduleService.findByTechnicianAndDate(technicianId, date));
    }

    @PostMapping("/save")
    public Result<Schedule> save(@RequestBody Schedule schedule) {
        return Result.success(scheduleService.save(schedule));
    }

    @PostMapping("/batch")
    public Result<Void> batchSave(@RequestBody List<Schedule> schedules) {
        scheduleService.batchSave(schedules);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        scheduleService.delete(id);
        return Result.success();
    }
}
