package com.stationery.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.stationery.entity.PurchaseOrder;
import com.stationery.entity.PurchaseOrderDetail;
import com.stationery.mapper.PurchaseOrderMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class PurchaseOrderService extends ServiceImpl<PurchaseOrderMapper, PurchaseOrder> {

    @Autowired
    private PurchaseOrderDetailService orderDetailService;

    @Autowired
    private PurchaseItemService itemService;

    public List<PurchaseOrder> listAll() {
        return list(new LambdaQueryWrapper<PurchaseOrder>()
                .orderByDesc(PurchaseOrder::getCreateTime));
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean saveOrderWithDetails(PurchaseOrder order, List<PurchaseOrderDetail> details) {
        String orderNo = "PO" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        order.setOrderNo(orderNo);
        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        order.setStatus(0);
        order.setDeleted(0);
        
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (PurchaseOrderDetail detail : details) {
            totalAmount = totalAmount.add(detail.getAmount());
        }
        order.setTotalAmount(totalAmount);
        
        if (save(order)) {
            for (PurchaseOrderDetail detail : details) {
                detail.setOrderId(order.getId());
                detail.setCreateTime(LocalDateTime.now());
                detail.setUpdateTime(LocalDateTime.now());
                detail.setDeleted(0);
            }
            return orderDetailService.saveBatch(details);
        }
        return false;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean approveOrder(Long orderId) {
        PurchaseOrder order = getById(orderId);
        if (order != null && order.getStatus() == 0) {
            order.setStatus(1);
            order.setUpdateTime(LocalDateTime.now());
            return updateById(order);
        }
        return false;
    }

    public PurchaseOrder getOrderWithDetails(Long orderId) {
        return getById(orderId);
    }

    public List<PurchaseOrderDetail> getOrderDetails(Long orderId) {
        return orderDetailService.list(new LambdaQueryWrapper<PurchaseOrderDetail>()
                .eq(PurchaseOrderDetail::getOrderId, orderId));
    }
}
