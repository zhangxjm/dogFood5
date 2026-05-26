package com.hotel.linen.service;

import com.hotel.linen.entity.LinenInventory;
import com.hotel.linen.entity.UsageRecord;
import com.hotel.linen.repository.LinenInventoryRepository;
import com.hotel.linen.repository.UsageRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UsageRecordService {

    @Autowired
    private UsageRecordRepository repository;

    @Autowired
    private LinenInventoryRepository linenRepository;

    public List<UsageRecord> findAll() {
        return repository.findAll();
    }

    public Optional<UsageRecord> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public UsageRecord save(UsageRecord record) {
        if ("已领用".equals(record.getStatus()) && record.getLinenId() != null) {
            LinenInventory linen = linenRepository.findById(record.getLinenId()).orElse(null);
            if (linen != null && linen.getCleanQuantity() >= record.getQuantity()) {
                linen.setCleanQuantity(linen.getCleanQuantity() - record.getQuantity());
                linen.setInUseQuantity(linen.getInUseQuantity() + record.getQuantity());
                linenRepository.save(linen);
            }
        }
        return repository.save(record);
    }

    @Transactional
    public UsageRecord returnLinen(Long id) {
        UsageRecord record = repository.findById(id).orElse(null);
        if (record != null && "已领用".equals(record.getStatus())) {
            LinenInventory linen = linenRepository.findById(record.getLinenId()).orElse(null);
            if (linen != null) {
                linen.setInUseQuantity(Math.max(0, linen.getInUseQuantity() - record.getQuantity()));
                linen.setDirtyQuantity(linen.getDirtyQuantity() + record.getQuantity());
                linenRepository.save(linen);
            }
            record.setStatus("已归还");
            record.setReturnTime(java.time.LocalDateTime.now());
            return repository.save(record);
        }
        return null;
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public List<UsageRecord> findByLinenId(Long linenId) {
        return repository.findByLinenId(linenId);
    }
}
