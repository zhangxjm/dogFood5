package com.nailschedule.controller;

import com.nailschedule.common.Result;
import com.nailschedule.entity.Appointment;
import com.nailschedule.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping("/date/{date}")
    public Result<List<Map<String, Object>>> findByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return Result.success(appointmentService.findByDate(date));
    }

    @GetMapping("/technician/{technicianId}")
    public Result<List<Map<String, Object>>> findByTechnicianAndDateRange(
            @PathVariable Long technicianId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return Result.success(appointmentService.findByTechnicianAndDateRange(technicianId, startDate, endDate));
    }

    @GetMapping("/list")
    public Result<List<Appointment>> list() {
        return Result.success(appointmentService.findAll());
    }

    @PostMapping("/save")
    public Result<Appointment> save(@RequestBody Appointment appointment) {
        return Result.success(appointmentService.save(appointment));
    }

    @PutMapping("/status/{id}")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        appointmentService.updateStatus(id, status);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        appointmentService.delete(id);
        return Result.success();
    }
}
