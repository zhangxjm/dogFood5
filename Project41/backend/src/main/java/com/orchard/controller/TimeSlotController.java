package com.orchard.controller;

import com.orchard.common.Result;
import com.orchard.entity.TimeSlot;
import com.orchard.service.TimeSlotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/time-slot")
@CrossOrigin
public class TimeSlotController {

    @Autowired
    private TimeSlotService timeSlotService;

    @GetMapping("/list")
    public Result<List<TimeSlot>> list(@RequestParam(required = false) String date) {
        LocalDate queryDate = date != null ? LocalDate.parse(date) : LocalDate.now();
        return Result.success(timeSlotService.getByDate(queryDate));
    }

    @PostMapping
    public Result<TimeSlot> create(@RequestBody TimeSlot timeSlot) {
        timeSlotService.save(timeSlot);
        return Result.success(timeSlot);
    }
}
