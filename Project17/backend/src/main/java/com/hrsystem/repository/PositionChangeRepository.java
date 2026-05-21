package com.hrsystem.repository;

import com.hrsystem.entity.PositionChange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PositionChangeRepository extends JpaRepository<PositionChange, Long> {
    List<PositionChange> findByEmployeeIdOrderByChangeDateDesc(Long employeeId);
}
