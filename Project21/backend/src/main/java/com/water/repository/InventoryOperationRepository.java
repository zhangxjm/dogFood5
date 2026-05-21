package com.water.repository;

import com.water.entity.InventoryOperation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventoryOperationRepository extends JpaRepository<InventoryOperation, Long> {
    
    List<InventoryOperation> findAllByOrderByOperationTimeDesc();
    
    @Query("SELECT i FROM InventoryOperation i WHERE i.operationTime BETWEEN :startTime AND :endTime ORDER BY i.operationTime DESC")
    List<InventoryOperation> findByOperationTimeBetween(@Param("startTime") LocalDateTime startTime, 
                                                        @Param("endTime") LocalDateTime endTime);
}