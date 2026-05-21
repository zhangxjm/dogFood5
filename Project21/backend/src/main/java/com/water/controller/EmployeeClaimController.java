package com.water.controller;

import com.water.dto.ClaimRequest;
import com.water.dto.DepartmentStatistics;
import com.water.dto.MonthlyStatistics;
import com.water.dto.Result;
import com.water.entity.EmployeeClaim;
import com.water.service.EmployeeClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class EmployeeClaimController {
    
    @Autowired
    private EmployeeClaimService claimService;
    
    @PostMapping
    public Result<EmployeeClaim> createClaim(@RequestBody ClaimRequest request) {
        try {
            return Result.success(claimService.createClaim(request));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    @GetMapping
    public Result<List<EmployeeClaim>> getAllClaims() {
        return Result.success(claimService.getAllClaims());
    }
    
    @GetMapping("/monthly")
    public Result<List<EmployeeClaim>> getClaimsByMonth(
            @RequestParam int year, 
            @RequestParam int month) {
        return Result.success(claimService.getClaimsByMonth(year, month));
    }
    
    @GetMapping("/statistics/monthly")
    public Result<List<MonthlyStatistics>> getMonthlyStatistics(@RequestParam int year) {
        return Result.success(claimService.getMonthlyStatistics(year));
    }
    
    @GetMapping("/statistics/department")
    public Result<List<DepartmentStatistics>> getDepartmentStatistics(
            @RequestParam int year, 
            @RequestParam int month) {
        return Result.success(claimService.getDepartmentStatistics(year, month));
    }
    
    @GetMapping("/statistics/monthly-consumption")
    public Result<Integer> getMonthlyConsumption() {
        return Result.success(claimService.getTotalConsumptionThisMonth());
    }
}