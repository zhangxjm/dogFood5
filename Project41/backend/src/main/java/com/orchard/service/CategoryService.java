package com.orchard.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.orchard.entity.Category;

import java.util.List;

public interface CategoryService extends IService<Category> {
    List<Category> listAll();
}
