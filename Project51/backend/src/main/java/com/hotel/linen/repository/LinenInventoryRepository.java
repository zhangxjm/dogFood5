package com.hotel.linen.repository;

import com.hotel.linen.entity.LinenInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LinenInventoryRepository extends JpaRepository<LinenInventory, Long> {
    List<LinenInventory> findByType(String type);
    List<LinenInventory> findByNameContaining(String name);
}
