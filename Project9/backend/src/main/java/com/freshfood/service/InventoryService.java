package com.freshfood.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.freshfood.entity.Inventory;
import com.freshfood.entity.InventoryRecord;
import com.freshfood.entity.Product;
import com.freshfood.mapper.InventoryMapper;
import com.freshfood.mapper.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class InventoryService extends ServiceImpl<InventoryMapper, Inventory> {

    @Autowired
    private ProductMapper productMapper;
    @Autowired
    private InventoryRecordService inventoryRecordService;

    public Page<Inventory> pageList(Integer pageNum, Integer pageSize, Long productId) {
        Page<Inventory> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Inventory> wrapper = new LambdaQueryWrapper<>();
        if (productId != null) {
            wrapper.eq(Inventory::getProductId, productId);
        }
        Page<Inventory> resultPage = this.page(page, wrapper);
        for (Inventory inventory : resultPage.getRecords()) {
            Product product = productMapper.selectById(inventory.getProductId());
            if (product != null) {
                inventory.setProductName(product.getName());
            }
        }
        return resultPage;
    }

    @Transactional(rollbackFor = Exception.class)
    public void checkInventory(Long inventoryId, Integer afterQuantity, String remark, Long operatorId, String operatorName) {
        Inventory inventory = this.getById(inventoryId);
        if (inventory != null) {
            InventoryRecord record = new InventoryRecord();
            record.setProductId(inventory.getProductId());
            record.setBeforeQuantity(inventory.getQuantity());
            record.setAfterQuantity(afterQuantity);
            record.setDiffQuantity(afterQuantity - inventory.getQuantity());
            record.setRemark(remark);
            record.setOperatorId(operatorId);
            record.setOperatorName(operatorName);
            record.setCheckTime(LocalDateTime.now());
            inventoryRecordService.save(record);
            inventory.setQuantity(afterQuantity);
            inventory.setLastCheckTime(LocalDateTime.now());
            this.updateById(inventory);
        }
    }
}
