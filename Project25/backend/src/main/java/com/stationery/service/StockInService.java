package com.stationery.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.stationery.entity.PurchaseOrder;
import com.stationery.entity.PurchaseOrderDetail;
import com.stationery.entity.StockIn;
import com.stationery.mapper.StockInMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class StockInService extends ServiceImpl<StockInMapper, StockIn> {

    @Autowired
    private PurchaseOrderService orderService;

    @Autowired
    private PurchaseItemService itemService;

    public List<StockIn> listAll() {
        return list(new LambdaQueryWrapper<StockIn>()
                .orderByDesc(StockIn::getCreateTime));
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean stockIn(StockIn stockIn) {
        String stockInNo = "IN" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        stockIn.setStockInNo(stockInNo);
        stockIn.setStockInDate(LocalDateTime.now());
        stockIn.setCreateTime(LocalDateTime.now());
        stockIn.setUpdateTime(LocalDateTime.now());
        stockIn.setStatus(1);
        stockIn.setDeleted(0);
        
        if (save(stockIn)) {
            List<PurchaseOrderDetail> details = orderService.getOrderDetails(stockIn.getOrderId());
            for (PurchaseOrderDetail detail : details) {
                itemService.updateStock(detail.getItemId(), detail.getQuantity());
            }
            PurchaseOrder order = orderService.getById(stockIn.getOrderId());
            if (order != null) {
                order.setStatus(2);
                order.setUpdateTime(LocalDateTime.now());
                orderService.updateById(order);
            }
            return true;
        }
        return false;
    }
}
