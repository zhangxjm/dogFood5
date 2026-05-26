package com.afternoontea.controller;

import com.afternoontea.entity.Application;
import com.afternoontea.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Application application) {
        try {
            return ResponseEntity.ok(applicationService.create(application));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        applicationService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Application>> findAll() {
        return ResponseEntity.ok(applicationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> findById(@PathVariable Long id) {
        return applicationService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Application>> findByDepartmentId(@PathVariable Long departmentId) {
        return ResponseEntity.ok(applicationService.findByDepartmentId(departmentId));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Application>> findByEmployeeId(@PathVariable Long employeeId) {
        return ResponseEntity.ok(applicationService.findByEmployeeId(employeeId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Application>> findByStatus(@PathVariable String status) {
        return ResponseEntity.ok(applicationService.findByStatus(status));
    }

    @GetMapping("/time-range")
    public ResponseEntity<List<Application>> findByTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        return ResponseEntity.ok(applicationService.findByTimeRange(startTime, endTime));
    }

    @GetMapping("/department/{departmentId}/time-range")
    public ResponseEntity<List<Application>> findByDepartmentAndTimeRange(
            @PathVariable Long departmentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        return ResponseEntity.ok(applicationService.findByDepartmentAndTimeRange(departmentId, startTime, endTime));
    }
}
