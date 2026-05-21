package com.hrsystem.repository;

import com.hrsystem.entity.EmploymentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmploymentRecordRepository extends JpaRepository<EmploymentRecord, Long> {
    List<EmploymentRecord> findByEmployeeIdOrderByRecordDateDesc(Long employeeId);
}
