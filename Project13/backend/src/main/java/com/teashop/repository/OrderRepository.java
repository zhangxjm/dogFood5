package com.teashop.repository;

import com.teashop.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findAllByOrderByCreateTimeDesc();

    List<Order> findByStatusOrderByCreateTimeDesc(Integer status);

    @Query("SELECT o FROM Order o WHERE o.createTime BETWEEN :startTime AND :endTime ORDER BY o.createTime DESC")
    List<Order> findByCreateTimeBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.createTime BETWEEN :startTime AND :endTime AND o.status != 0")
    BigDecimal sumTotalAmountByCreateTimeBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createTime BETWEEN :startTime AND :endTime AND o.status != 0")
    Long countByCreateTimeBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
}