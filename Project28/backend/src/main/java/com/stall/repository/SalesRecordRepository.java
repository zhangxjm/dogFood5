package com.stall.repository;

import com.stall.entity.SalesRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalesRecordRepository extends JpaRepository<SalesRecord, Long> {

    List<SalesRecord> findBySalesDateOrderByCreateTimeDesc(LocalDate salesDate);

    List<SalesRecord> findBySalesDateBetweenOrderBySalesDateDesc(LocalDate startDate, LocalDate endDate);

    @Query("SELECT SUM(s.totalAmount) FROM SalesRecord s WHERE s.salesDate = :date")
    BigDecimal sumTotalAmountByDate(@Param("date") LocalDate date);

    @Query("SELECT SUM(s.totalAmount) FROM SalesRecord s WHERE s.salesDate BETWEEN :startDate AND :endDate")
    BigDecimal sumTotalAmountBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT s.categoryId, s.categoryName, SUM(s.quantity) as totalQuantity, SUM(s.totalAmount) as totalAmount " +
           "FROM SalesRecord s WHERE s.salesDate BETWEEN :startDate AND :endDate " +
           "GROUP BY s.categoryId, s.categoryName ORDER BY totalQuantity DESC")
    List<Object[]> findHotSalesBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(s) FROM SalesRecord s WHERE s.salesDate = :date")
    Long countBySalesDate(@Param("date") LocalDate date);

    @Query("SELECT SUM(s.quantity) FROM SalesRecord s WHERE s.salesDate = :date")
    Long sumQuantityByDate(@Param("date") LocalDate date);
}
