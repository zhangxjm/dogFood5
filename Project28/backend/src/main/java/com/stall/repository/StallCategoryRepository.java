package com.stall.repository;

import com.stall.entity.StallCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StallCategoryRepository extends JpaRepository<StallCategory, Long> {
    List<StallCategory> findByIsActiveTrue();
}
