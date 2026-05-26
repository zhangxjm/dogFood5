package com.nailschedule.controller;

import com.nailschedule.common.Result;
import com.nailschedule.entity.Technician;
import com.nailschedule.service.TechnicianService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/technician")
public class TechnicianController {

    @Autowired
    private TechnicianService technicianService;

    @GetMapping("/list")
    public Result<List<Technician>> list() {
        return Result.success(technicianService.list());
    }

    @GetMapping("/active")
    public Result<List<Technician>> listActive() {
        return Result.success(technicianService.listActive());
    }

    @GetMapping("/{id}")
    public Result<Technician> getById(@PathVariable Long id) {
        return Result.success(technicianService.getById(id));
    }

    @PostMapping("/save")
    public Result<Technician> save(@RequestBody Technician technician) {
        return Result.success(technicianService.save(technician));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        technicianService.delete(id);
        return Result.success();
    }
}
