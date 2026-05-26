package com.orchard.service.impl;

import com.orchard.entity.Category;
import com.orchard.repository.CategoryRepository;
import com.orchard.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findByActiveTrueOrderBySortOrderAsc();
    }

    @Override
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @Override
    public Category createCategory(Category category) {
        if (category.getActive() == null) {
            category.setActive(true);
        }
        if (category.getSortOrder() == null) {
            category.setSortOrder(0);
        }
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, Category category) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        existing.setName(category.getName());
        existing.setDescription(category.getDescription());
        existing.setImageUrl(category.getImageUrl());
        existing.setPrice(category.getPrice());
        existing.setUnit(category.getUnit());
        existing.setHarvestSeason(category.getHarvestSeason());
        existing.setStartDate(category.getStartDate());
        existing.setEndDate(category.getEndDate());
        existing.setActive(category.getActive());
        existing.setSortOrder(category.getSortOrder());
        return categoryRepository.save(existing);
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
