package com.snack.repository;

import com.snack.entity.SaleRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SaleRecordRepository extends JpaRepository<SaleRecord, Long> {
    List<SaleRecord> findBySaleDateOrderByCreateTimeDesc(LocalDate saleDate);

    @Query("SELECT s.snackId, s.snackName, SUM(s.quantity) as totalQuantity, SUM(s.totalAmount) as totalRevenue " +
           "FROM SaleRecord s WHERE s.saleDate = :saleDate GROUP BY s.snackId, s.snackName ORDER BY totalQuantity DESC")
    List<Object[]> findHotSnacksByDate(LocalDate saleDate);

    @Query("SELECT SUM(s.totalAmount) FROM SaleRecord s WHERE s.saleDate = :saleDate")
    Double sumTotalAmountByDate(LocalDate saleDate);

    @Query("SELECT COUNT(s) FROM SaleRecord s WHERE s.saleDate = :saleDate")
    Long countBySaleDate(LocalDate saleDate);

    @Query("SELECT s.snackId, s.snackName, SUM(s.quantity) as totalQuantity, SUM(s.totalAmount) as totalRevenue " +
           "FROM SaleRecord s WHERE s.saleDate BETWEEN :startDate AND :endDate " +
           "GROUP BY s.snackId, s.snackName ORDER BY totalQuantity DESC")
    List<Object[]> findHotSnacksBetweenDates(LocalDate startDate, LocalDate endDate);
}
