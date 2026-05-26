package com.hotel.linen.repository;

import com.hotel.linen.entity.LossRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LossRecordRepository extends JpaRepository<LossRecord, Long> {
    List<LossRecord> findByLinenId(Long linenId);
    List<LossRecord> findByReasonContaining(String reason);
}
