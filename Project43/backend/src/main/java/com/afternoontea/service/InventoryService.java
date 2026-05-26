package com.afternoontea.service;

import com.afternoontea.entity.Category;
import com.afternoontea.entity.Inventory;
import com.afternoontea.repository.CategoryRepository;
import com.afternoontea.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InventoryService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public Inventory create(Inventory inventory) {
        if (inventory.getCategory() != null && inventory.getCategory().getId() != null) {
            Optional<Category> categoryOpt = categoryRepository.findById(inventory.getCategory().getId());
            if (categoryOpt.isPresent()) {
                Category category = categoryOpt.get();
                int newStock = category.getStock() + inventory.getChangeQuantity();
                if (newStock < 0) {
                    throw new RuntimeException("Insufficient stock for: " + category.getName());
                }
                category.setStock(newStock);
                categoryRepository.save(category);
            }
        }
        return inventoryRepository.save(inventory);
    }

    public void delete(Long id) {
        inventoryRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Inventory> findAll() {
        return inventoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Inventory> findById(Long id) {
        return inventoryRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Inventory> findByCategoryId(Long categoryId) {
        return inventoryRepository.findByCategoryId(categoryId);
    }

    @Transactional(readOnly = true)
    public List<Inventory> findByChangeType(String changeType) {
        return inventoryRepository.findByChangeType(changeType);
    }

    @Transactional(readOnly = true)
    public List<Inventory> findByTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        return inventoryRepository.findByRecordTimeBetween(startTime, endTime);
    }

    @Transactional(readOnly = true)
    public List<Inventory> findByCategoryAndTimeRange(Long categoryId, LocalDateTime startTime, LocalDateTime endTime) {
        return inventoryRepository.findByCategoryIdAndRecordTimeBetween(categoryId, startTime, endTime);
    }
}
