package com.water.repository;

import com.water.entity.EmployeeClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmployeeClaimRepository extends JpaRepository<EmployeeClaim, Long> {
    
    @Query("SELECT e FROM EmployeeClaim e WHERE e.claimTime BETWEEN :startTime AND :endTime ORDER BY e.claimTime DESC")
    List<EmployeeClaim> findByClaimTimeBetween(@Param("startTime") LocalDateTime startTime, 
                                               @Param("endTime") LocalDateTime endTime);
    
    List<EmployeeClaim> findByEmployeeNo(String employeeNo);
    
    @Query("SELECT SUM(e.quantity) FROM EmployeeClaim e WHERE e.claimTime BETWEEN :startTime AND :endTime")
    Integer sumQuantityByMonth(@Param("startTime") LocalDateTime startTime, 
                               @Param("endTime") LocalDateTime endTime);
    
    @Query("SELECT e.department, SUM(e.quantity) FROM EmployeeClaim e " +
           "WHERE e.claimTime BETWEEN :startTime AND :endTime " +
           "GROUP BY e.department ORDER BY SUM(e.quantity) DESC")
    List<Object[]> sumQuantityByDepartment(@Param("startTime") LocalDateTime startTime, 
                                           @Param("endTime") LocalDateTime endTime);
}