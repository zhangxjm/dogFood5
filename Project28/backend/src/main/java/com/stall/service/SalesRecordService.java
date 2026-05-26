package com.stall.service;

import com.stall.dto.SalesRecordDTO;
import com.stall.entity.SalesRecord;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface SalesRecordService {
    List<SalesRecord> getRecordsByDate(LocalDate date);
    List<SalesRecord> getRecordsByDateRange(LocalDate startDate, LocalDate endDate);
    SalesRecord createRecord(SalesRecordDTO dto);
    SalesRecord updateRecord(Long id, SalesRecordDTO dto);
    void deleteRecord(Long id);
    BigDecimal getTotalAmountByDate(LocalDate date);
    BigDecimal getTotalAmountByDateRange(LocalDate startDate, LocalDate endDate);
    List<Map<String, Object>> getHotSales(LocalDate startDate, LocalDate endDate);
    Map<String, Object> getDailySummary(LocalDate date);
    Map<String, Object> getOverallStatistics();
}
