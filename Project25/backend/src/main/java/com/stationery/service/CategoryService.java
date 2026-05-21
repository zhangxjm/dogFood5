package com.stationery.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.stationery.entity.Category;
import com.stationery.mapper.CategoryMapper;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CategoryService extends ServiceImpl<CategoryMapper, Category> {

    public List<Category> listAll() {
        return list(new LambdaQueryWrapper<Category>()
                .eq(Category::getStatus, 1)
                .orderByAsc(Category::getSortOrder));
    }

    public boolean saveCategory(Category category) {
        category.setCreateTime(LocalDateTime.now());
        category.setUpdateTime(LocalDateTime.now());
        category.setStatus(1);
        category.setDeleted(0);
        return save(category);
    }

    public boolean updateCategory(Category category) {
        category.setUpdateTime(LocalDateTime.now());
        return updateById(category);
    }

    public boolean deleteCategory(Long id) {
        return removeById(id);
    }
}
