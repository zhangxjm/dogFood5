package com.hotel.linen.service;

import com.hotel.linen.entity.LinenInventory;
import com.hotel.linen.entity.LossRecord;
import com.hotel.linen.repository.LinenInventoryRepository;
import com.hotel.linen.repository.LossRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class LossRecordService {

    @Autowired
    private LossRecordRepository repository;

    @Autowired
    private LinenInventoryRepository linenRepository;

    public List<LossRecord> findAll() {
        return repository.findAll();
    }

    public Optional<LossRecord> findById(Long id) {
        return repository.findById(id);
    }

    @Transactional
    public LossRecord save(LossRecord record) {
        LossRecord saved = repository.save(record);
        if (record.getLinenId() != null) {
            LinenInventory linen = linenRepository.findById(record.getLinenId()).orElse(null);
            if (linen != null) {
                linen.setTotalQuantity(Math.max(0, linen.getTotalQuantity() - record.getQuantity()));
                if (linen.getDirtyQuantity() >= record.getQuantity()) {
                    linen.setDirtyQuantity(linen.getDirtyQuantity() - record.getQuantity());
                } else {
                    int remaining = record.getQuantity() - linen.getDirtyQuantity();
                    linen.setDirtyQuantity(0);
                    linen.setInUseQuantity(Math.max(0, linen.getInUseQuantity() - remaining));
                }
                linenRepository.save(linen);
            }
        }
        return saved;
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public List<LossRecord> findByLinenId(Long linenId) {
        return repository.findByLinenId(linenId);
    }
}
