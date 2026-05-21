package com.freshfood.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.freshfood.entity.Product;
import com.freshfood.entity.SupplyRecord;
import com.freshfood.entity.Supplier;
import com.freshfood.mapper.ProductMapper;
import com.freshfood.mapper.SupplierMapper;
import com.freshfood.mapper.SupplyRecordMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SupplyRecordService extends ServiceImpl<SupplyRecordMapper, SupplyRecord> {

    @Autowired
    private SupplierMapper supplierMapper;
    @Autowired
    private ProductMapper productMapper;

    public Page<SupplyRecord> pageList(Integer pageNum, Integer pageSize, Long supplierId, Long productId) {
        Page<SupplyRecord> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<SupplyRecord> wrapper = new LambdaQueryWrapper<>();
        if (supplierId != null) {
            wrapper.eq(SupplyRecord::getSupplierId, supplierId);
        }
        if (productId != null) {
            wrapper.eq(SupplyRecord::getProductId, productId);
        }
        wrapper.orderByDesc(SupplyRecord::getCreateTime);
        Page<SupplyRecord> resultPage = this.page(page, wrapper);
        for (SupplyRecord record : resultPage.getRecords()) {
            Supplier supplier = supplierMapper.selectById(record.getSupplierId());
            if (supplier != null) {
                record.setSupplierName(supplier.getName());
            }
            Product product = productMapper.selectById(record.getProductId());
            if (product != null) {
                record.setProductName(product.getName());
            }
        }
        return resultPage;
    }
}
