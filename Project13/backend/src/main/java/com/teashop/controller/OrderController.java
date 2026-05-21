package com.teashop.controller;

import com.teashop.common.Result;
import com.teashop.dto.DailySummaryDTO;
import com.teashop.dto.OrderCreateDTO;
import com.teashop.entity.Order;
import com.teashop.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public Result<List<Order>> getAllOrders() {
        return Result.success(orderService.getAllOrders());
    }

    @GetMapping("/status/{status}")
    public Result<List<Order>> getOrdersByStatus(@PathVariable Integer status) {
        return Result.success(orderService.getOrdersByStatus(status));
    }

    @GetMapping("/{id}")
    public Result<Order> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(Result::success)
                .orElse(Result.error("Order not found"));
    }

    @PostMapping
    public Result<Order> createOrder(@RequestBody OrderCreateDTO orderCreateDTO) {
        return Result.success(orderService.createOrder(orderCreateDTO));
    }

    @PutMapping("/{id}/status")
    public Result<Order> updateOrderStatus(@PathVariable Long id, @RequestParam Integer status) {
        try {
            return Result.success(orderService.updateOrderStatus(id, status));
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    @GetMapping("/summary/daily")
    public Result<DailySummaryDTO> getDailySummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        return Result.success(orderService.getDailySummary(date));
    }
}