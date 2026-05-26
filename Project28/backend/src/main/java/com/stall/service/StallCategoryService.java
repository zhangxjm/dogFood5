package com.stall.service;

import com.stall.dto.CategoryDTO;
import com.stall.entity.StallCategory;

import java.util.List;

public interface StallCategoryService {
    List<StallCategory> getAllCategories();
    List<StallCategory> getActiveCategories();
    StallCategory getCategoryById(Long id);
    StallCategory createCategory(CategoryDTO dto);
    StallCategory updateCategory(Long id, CategoryDTO dto);
    void deleteCategory(Long id);
}
