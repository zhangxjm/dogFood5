package com.afternoontea.repository;

import com.afternoontea.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByCategoryId(Long categoryId);
    List<Inventory> findByChangeType(String changeType);

    @Modifying
    @Query("DELETE FROM Inventory i WHERE i.category.id = :categoryId")
    void deleteByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT i FROM Inventory i WHERE i.recordTime BETWEEN :startTime AND :endTime")
    List<Inventory> findByRecordTimeBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    @Query("SELECT i FROM Inventory i WHERE i.category.id = :categoryId AND i.recordTime BETWEEN :startTime AND :endTime")
    List<Inventory> findByCategoryIdAndRecordTimeBetween(
            @Param("categoryId") Long categoryId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}
