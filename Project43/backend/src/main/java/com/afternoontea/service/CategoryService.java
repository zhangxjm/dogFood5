package com.afternoontea.service;

import com.afternoontea.entity.Category;
import com.afternoontea.repository.CategoryRepository;
import com.afternoontea.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public Category create(Category category) {
        return categoryRepository.save(category);
    }

    public Category update(Long id, Category category) {
        Optional<Category> existing = categoryRepository.findById(id);
        if (existing.isPresent()) {
            Category c = existing.get();
            c.setName(category.getName());
            c.setType(category.getType());
            c.setDescription(category.getDescription());
            c.setStock(category.getStock());
            c.setPrice(category.getPrice());
            return categoryRepository.save(c);
        }
        return null;
    }

    public void delete(Long id) {
        inventoryRepository.deleteByCategoryId(id);
        categoryRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Category> findById(Long id) {
        return categoryRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Category> findByType(String type) {
        return categoryRepository.findByType(type);
    }

    public Category updateStock(Long id, Integer stock) {
        Optional<Category> existing = categoryRepository.findById(id);
        if (existing.isPresent()) {
            Category c = existing.get();
            c.setStock(stock);
            return categoryRepository.save(c);
        }
        return null;
    }
}
