package com.stationery.controller;

import com.stationery.common.Result;
import com.stationery.entity.PurchaseOrder;
import com.stationery.entity.PurchaseOrderDetail;
import com.stationery.service.PurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order")
@CrossOrigin
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService orderService;

    @GetMapping("/list")
    public Result<List<PurchaseOrder>> list() {
        return Result.success(orderService.listAll());
    }

    @GetMapping("/{id}")
    public Result<PurchaseOrder> getById(@PathVariable Long id) {
        return Result.success(orderService.getOrderWithDetails(id));
    }

    @GetMapping("/{id}/details")
    public Result<List<PurchaseOrderDetail>> getDetails(@PathVariable Long id) {
        return Result.success(orderService.getOrderDetails(id));
    }

    @PostMapping
    public Result<Void> save(@RequestBody Map<String, Object> params) {
        PurchaseOrder order = new PurchaseOrder();
        order.setSupplier((String) params.get("supplier"));
        order.setRemark((String) params.get("remark"));
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> detailsList = (List<Map<String, Object>>) params.get("details");
        
        List<PurchaseOrderDetail> details = detailsList.stream().map(map -> {
            PurchaseOrderDetail detail = new PurchaseOrderDetail();
            detail.setItemId(Long.valueOf(map.get("itemId").toString()));
            detail.setItemName((String) map.get("itemName"));
            detail.setSpecification((String) map.get("specification"));
            detail.setUnit((String) map.get("unit"));
            detail.setUnitPrice(new java.math.BigDecimal(map.get("unitPrice").toString()));
            detail.setQuantity(Integer.valueOf(map.get("quantity").toString()));
            detail.setAmount(new java.math.BigDecimal(map.get("amount").toString()));
            return detail;
        }).collect(java.util.stream.Collectors.toList());
        
        if (orderService.saveOrderWithDetails(order, details)) {
            return Result.success();
        }
        return Result.error("保存失败");
    }

    @PostMapping("/approve/{id}")
    public Result<Void> approve(@PathVariable Long id) {
        if (orderService.approveOrder(id)) {
            return Result.success();
        }
        return Result.error("审核失败");
    }
}
