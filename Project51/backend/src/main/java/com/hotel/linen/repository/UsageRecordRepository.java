package com.hotel.linen.repository;

import com.hotel.linen.entity.UsageRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsageRecordRepository extends JpaRepository<UsageRecord, Long> {
    List<UsageRecord> findByLinenId(Long linenId);
    List<UsageRecord> findByStatus(String status);
    List<UsageRecord> findByUserName(String userName);
}
