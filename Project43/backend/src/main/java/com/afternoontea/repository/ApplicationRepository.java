package com.afternoontea.repository;

import com.afternoontea.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByDepartmentId(Long departmentId);
    List<Application> findByEmployeeId(Long employeeId);
    List<Application> findByStatus(String status);

    @Query("SELECT a FROM Application a WHERE a.applyTime BETWEEN :startTime AND :endTime")
    List<Application> findByApplyTimeBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    @Query("SELECT a FROM Application a WHERE a.department.id = :departmentId AND a.applyTime BETWEEN :startTime AND :endTime")
    List<Application> findByDepartmentIdAndApplyTimeBetween(
            @Param("departmentId") Long departmentId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}
