package com.water.service;

import com.water.dto.ClaimRequest;
import com.water.dto.DepartmentStatistics;
import com.water.dto.MonthlyStatistics;
import com.water.entity.EmployeeClaim;
import com.water.repository.EmployeeClaimRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class EmployeeClaimService {
    
    @Autowired
    private EmployeeClaimRepository claimRepository;
    
    @Autowired
    private WaterInventoryService inventoryService;
    
    @Transactional
    public EmployeeClaim createClaim(ClaimRequest request) {
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RuntimeException("申领数量必须大于0");
        }
        
        inventoryService.deductStock(request.getQuantity());
        
        EmployeeClaim claim = new EmployeeClaim();
        claim.setEmployeeName(request.getEmployeeName());
        claim.setEmployeeNo(request.getEmployeeNo());
        claim.setDepartment(request.getDepartment());
        claim.setQuantity(request.getQuantity());
        claim.setRemark(request.getRemark());
        
        return claimRepository.save(claim);
    }
    
    public List<EmployeeClaim> getAllClaims() {
        return claimRepository.findAll();
    }
    
    public List<EmployeeClaim> getClaimsByMonth(int year, int month) {
        LocalDateTime startTime = LocalDateTime.of(year, month, 1, 0, 0, 0);
        LocalDateTime endTime = LocalDateTime.of(year, month, 
                LocalDate.of(year, month, 1).lengthOfMonth(), 23, 59, 59);
        return claimRepository.findByClaimTimeBetween(startTime, endTime);
    }
    
    public List<MonthlyStatistics> getMonthlyStatistics(int year) {
        List<MonthlyStatistics> statistics = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        
        for (int month = 1; month <= 12; month++) {
            LocalDateTime startTime = LocalDateTime.of(year, month, 1, 0, 0, 0);
            LocalDateTime endTime = LocalDateTime.of(year, month, 
                    LocalDate.of(year, month, 1).lengthOfMonth(), 23, 59, 59);
            
            List<EmployeeClaim> claims = claimRepository.findByClaimTimeBetween(startTime, endTime);
            Integer totalBuckets = claimRepository.sumQuantityByMonth(startTime, endTime);
            
            String monthStr = LocalDate.of(year, month, 1).format(formatter);
            statistics.add(new MonthlyStatistics(monthStr, claims.size(), 
                    totalBuckets != null ? totalBuckets : 0));
        }
        
        return statistics;
    }
    
    public List<DepartmentStatistics> getDepartmentStatistics(int year, int month) {
        LocalDateTime startTime = LocalDateTime.of(year, month, 1, 0, 0, 0);
        LocalDateTime endTime = LocalDateTime.of(year, month, 
                LocalDate.of(year, month, 1).lengthOfMonth(), 23, 59, 59);
        
        List<Object[]> results = claimRepository.sumQuantityByDepartment(startTime, endTime);
        List<DepartmentStatistics> statistics = new ArrayList<>();
        
        for (Object[] result : results) {
            String department = (String) result[0];
            Long totalBuckets = (Long) result[1];
            statistics.add(new DepartmentStatistics(
                    department != null && !department.isEmpty() ? department : "未分配", 
                    totalBuckets.intValue()));
        }
        
        return statistics;
    }
    
    public Integer getTotalConsumptionThisMonth() {
        LocalDate now = LocalDate.now();
        LocalDateTime startTime = LocalDateTime.of(now.getYear(), now.getMonthValue(), 1, 0, 0, 0);
        LocalDateTime endTime = LocalDateTime.of(now.getYear(), now.getMonthValue(), 
                now.lengthOfMonth(), 23, 59, 59);
        
        Integer total = claimRepository.sumQuantityByMonth(startTime, endTime);
        return total != null ? total : 0;
    }
}