package com.freshfood.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.freshfood.entity.InventoryRecord;
import com.freshfood.entity.Product;
import com.freshfood.mapper.InventoryRecordMapper;
import com.freshfood.mapper.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InventoryRecordService extends ServiceImpl<InventoryRecordMapper, InventoryRecord> {

    @Autowired
    private ProductMapper productMapper;

    public Page<InventoryRecord> pageList(Integer pageNum, Integer pageSize, Long productId) {
        Page<InventoryRecord> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<InventoryRecord> wrapper = new LambdaQueryWrapper<>();
        if (productId != null) {
            wrapper.eq(InventoryRecord::getProductId, productId);
        }
        wrapper.orderByDesc(InventoryRecord::getCheckTime);
        Page<InventoryRecord> resultPage = this.page(page, wrapper);
        for (InventoryRecord record : resultPage.getRecords()) {
            Product product = productMapper.selectById(record.getProductId());
            if (product != null) {
                record.setProductName(product.getName());
            }
        }
        return resultPage;
    }
}
