package com.teashop.service;

import com.teashop.dto.DailySummaryDTO;
import com.teashop.dto.OrderCreateDTO;
import com.teashop.entity.Order;
import com.teashop.entity.OrderItem;
import com.teashop.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    private final AtomicLong orderCounter = new AtomicLong(System.currentTimeMillis() % 10000);

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreateTimeDesc();
    }

    public List<Order> getOrdersByStatus(Integer status) {
        return orderRepository.findByStatusOrderByCreateTimeDesc(status);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Transactional
    public Order createOrder(OrderCreateDTO dto) {
        Order order = new Order();
        order.setOrderNo(generateOrderNo());
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerPhone(dto.getCustomerPhone());
        order.setTotalAmount(dto.getTotalAmount());
        order.setStatus(1);
        order.setRemark(dto.getRemark());

        dto.getItems().forEach(itemDTO -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setDrinkId(itemDTO.getDrinkId());
            item.setDrinkName(itemDTO.getDrinkName());
            item.setPrice(itemDTO.getPrice());
            item.setQuantity(itemDTO.getQuantity());
            item.setSubtotal(itemDTO.getPrice().multiply(new BigDecimal(itemDTO.getQuantity())));
            order.getItems().add(item);
        });

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatus(Long id, Integer status) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.setStatus(status);
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public DailySummaryDTO getDailySummary(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        List<Order> orders = orderRepository.findByCreateTimeBetween(startOfDay, endOfDay);
        BigDecimal totalRevenue = orderRepository.sumTotalAmountByCreateTimeBetween(startOfDay, endOfDay);
        Long totalOrders = orderRepository.countByCreateTimeBetween(startOfDay, endOfDay);

        DailySummaryDTO summary = new DailySummaryDTO();
        summary.setDate(date);
        summary.setTotalOrders(totalOrders);
        summary.setTotalRevenue(totalRevenue);
        summary.setOrders(orders);
        return summary;
    }

    private String generateOrderNo() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        long seq = orderCounter.incrementAndGet() % 10000;
        return "ORD" + datePart + String.format("%04d", seq);
    }
}