package com.stall.service.impl;

import com.stall.dto.CategoryDTO;
import com.stall.entity.StallCategory;
import com.stall.repository.StallCategoryRepository;
import com.stall.service.StallCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StallCategoryServiceImpl implements StallCategoryService {

    @Autowired
    private StallCategoryRepository categoryRepository;

    @Override
    public List<StallCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public List<StallCategory> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue();
    }

    @Override
    public StallCategory getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Override
    public StallCategory createCategory(CategoryDTO dto) {
        StallCategory category = StallCategory.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .unitPrice(dto.getUnitPrice())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();
        return categoryRepository.save(category);
    }

    @Override
    public StallCategory updateCategory(Long id, CategoryDTO dto) {
        StallCategory category = getCategoryById(id);
        if (dto.getName() != null) {
            category.setName(dto.getName());
        }
        if (dto.getDescription() != null) {
            category.setDescription(dto.getDescription());
        }
        if (dto.getUnitPrice() != null) {
            category.setUnitPrice(dto.getUnitPrice());
        }
        if (dto.getIsActive() != null) {
            category.setIsActive(dto.getIsActive());
        }
        return categoryRepository.save(category);
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
