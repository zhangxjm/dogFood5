package com.water.repository;

import com.water.entity.WaterInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaterInventoryRepository extends JpaRepository<WaterInventory, Long> {
}