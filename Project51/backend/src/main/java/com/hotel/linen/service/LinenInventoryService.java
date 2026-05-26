package com.hotel.linen.service;

import com.hotel.linen.entity.LinenInventory;
import com.hotel.linen.repository.LinenInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LinenInventoryService {

    @Autowired
    private LinenInventoryRepository repository;

    public List<LinenInventory> findAll() {
        return repository.findAll();
    }

    public Optional<LinenInventory> findById(Long id) {
        return repository.findById(id);
    }

    public LinenInventory save(LinenInventory linen) {
        return repository.save(linen);
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    public List<LinenInventory> findByType(String type) {
        return repository.findByType(type);
    }

    public LinenInventory addCleanQuantity(Long id, Integer quantity) {
        LinenInventory linen = repository.findById(id).orElse(null);
        if (linen != null) {
            linen.setCleanQuantity(linen.getCleanQuantity() + quantity);
            linen.setDirtyQuantity(Math.max(0, linen.getDirtyQuantity() - quantity));
            return repository.save(linen);
        }
        return null;
    }

    public LinenInventory addDirtyQuantity(Long id, Integer quantity) {
        LinenInventory linen = repository.findById(id).orElse(null);
        if (linen != null) {
            linen.setDirtyQuantity(linen.getDirtyQuantity() + quantity);
            linen.setCleanQuantity(Math.max(0, linen.getCleanQuantity() - quantity));
            return repository.save(linen);
        }
        return null;
    }

    public LinenInventory useLinen(Long id, Integer quantity) {
        LinenInventory linen = repository.findById(id).orElse(null);
        if (linen != null && linen.getCleanQuantity() >= quantity) {
            linen.setCleanQuantity(linen.getCleanQuantity() - quantity);
            linen.setInUseQuantity(linen.getInUseQuantity() + quantity);
            return repository.save(linen);
        }
        return null;
    }

    public LinenInventory returnLinen(Long id, Integer quantity) {
        LinenInventory linen = repository.findById(id).orElse(null);
        if (linen != null) {
            linen.setInUseQuantity(Math.max(0, linen.getInUseQuantity() - quantity));
            linen.setDirtyQuantity(linen.getDirtyQuantity() + quantity);
            return repository.save(linen);
        }
        return null;
    }

    public LinenInventory reduceStock(Long id, Integer quantity) {
        LinenInventory linen = repository.findById(id).orElse(null);
        if (linen != null) {
            linen.setTotalQuantity(Math.max(0, linen.getTotalQuantity() - quantity));
            linen.setDirtyQuantity(Math.max(0, linen.getDirtyQuantity() - quantity));
            return repository.save(linen);
        }
        return null;
    }
}
