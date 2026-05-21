package com.stationery.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.stationery.entity.PurchaseItem;
import com.stationery.mapper.PurchaseItemMapper;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PurchaseItemService extends ServiceImpl<PurchaseItemMapper, PurchaseItem> {

    public List<PurchaseItem> listAll() {
        return list(new LambdaQueryWrapper<PurchaseItem>()
                .eq(PurchaseItem::getStatus, 1)
                .orderByDesc(PurchaseItem::getCreateTime));
    }

    public List<PurchaseItem> listByCategory(Long categoryId) {
        return list(new LambdaQueryWrapper<PurchaseItem>()
                .eq(PurchaseItem::getStatus, 1)
                .eq(PurchaseItem::getCategoryId, categoryId)
                .orderByDesc(PurchaseItem::getCreateTime));
    }

    public boolean saveItem(PurchaseItem item) {
        item.setCreateTime(LocalDateTime.now());
        item.setUpdateTime(LocalDateTime.now());
        item.setStatus(1);
        item.setDeleted(0);
        if (item.getStockQuantity() == null) {
            item.setStockQuantity(0);
        }
        return save(item);
    }

    public boolean updateItem(PurchaseItem item) {
        item.setUpdateTime(LocalDateTime.now());
        return updateById(item);
    }

    public boolean deleteItem(Long id) {
        return removeById(id);
    }

    public boolean updateStock(Long itemId, Integer quantity) {
        PurchaseItem item = getById(itemId);
        if (item != null) {
            item.setStockQuantity(item.getStockQuantity() + quantity);
            item.setUpdateTime(LocalDateTime.now());
            return updateById(item);
        }
        return false;
    }
}
