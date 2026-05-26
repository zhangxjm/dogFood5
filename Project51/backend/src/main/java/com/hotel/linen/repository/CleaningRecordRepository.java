package com.hotel.linen.repository;

import com.hotel.linen.entity.CleaningRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CleaningRecordRepository extends JpaRepository<CleaningRecord, Long> {
    List<CleaningRecord> findByLinenId(Long linenId);
    List<CleaningRecord> findByStatus(String status);
}
