package com.hotel.linen.service;

import com.hotel.linen.entity.CleaningRecord;
import com.hotel.linen.entity.LinenInventory;
import com.hotel.linen.repository.CleaningRecordRepository;
import com.hotel.linen.repository.LinenInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CleaningRecordService {

    @Autowired
    private CleaningRecordRepository repository;

    @Autowired
    private LinenInventoryRepository linenRepository;

    public List<CleaningRecord> findAll() {
        return repository.findAll();
    }

    public Optional<CleaningRecord> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public CleaningRecord save(CleaningRecord record) {
        CleaningRecord saved = repository.save(record);
        if ("已完成".equals(record.getStatus()) && record.getLinenId() != null) {
            LinenInventory linen = linenRepository.findById(record.getLinenId()).orElse(null);
            if (linen != null) {
                linen.setCleanQuantity(linen.getCleanQuantity() + record.getQuantity());
                linen.setDirtyQuantity(Math.max(0, linen.getDirtyQuantity() - record.getQuantity()));
                linenRepository.save(linen);
            }
        }
        return saved;
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public List<CleaningRecord> findByLinenId(Long linenId) {
        return repository.findByLinenId(linenId);
    }
}
