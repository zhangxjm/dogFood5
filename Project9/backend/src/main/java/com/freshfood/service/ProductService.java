package com.freshfood.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.freshfood.entity.Category;
import com.freshfood.entity.Inventory;
import com.freshfood.entity.Product;
import com.freshfood.mapper.InventoryMapper;
import com.freshfood.mapper.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import java.util.List;

@Service
public class ProductService extends ServiceImpl<ProductMapper, Product> {

    @Autowired
    private CategoryService categoryService;
    @Autowired
    private InventoryMapper inventoryMapper;

    public Page<Product> pageList(Integer pageNum, Integer pageSize, String name, Long categoryId) {
        Page<Product> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(name)) {
            wrapper.like(Product::getName, name);
        }
        if (categoryId != null) {
            wrapper.eq(Product::getCategoryId, categoryId);
        }
        wrapper.orderByDesc(Product::getCreateTime);
        Page<Product> resultPage = this.page(page, wrapper);
        List<Product> records = resultPage.getRecords();
        for (Product product : records) {
            Category category = categoryService.getById(product.getCategoryId());
            if (category != null) {
                product.setCategoryName(category.getName());
            }
            LambdaQueryWrapper<Inventory> invWrapper = new LambdaQueryWrapper<>();
            invWrapper.eq(Inventory::getProductId, product.getId());
            Inventory inventory = inventoryMapper.selectOne(invWrapper);
            if (inventory != null) {
                product.setInventoryQuantity(inventory.getQuantity());
            }
        }
        return resultPage;
    }

    public List<Product> listAll() {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Product::getStatus, 1);
        return this.list(wrapper);
    }
}
