package com.stall.service.impl;

import com.stall.dto.SalesRecordDTO;
import com.stall.entity.SalesRecord;
import com.stall.entity.StallCategory;
import com.stall.repository.SalesRecordRepository;
import com.stall.repository.StallCategoryRepository;
import com.stall.service.SalesRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class SalesRecordServiceImpl implements SalesRecordService {

    @Autowired
    private SalesRecordRepository salesRecordRepository;

    @Autowired
    private StallCategoryRepository categoryRepository;

    @Override
    public List<SalesRecord> getRecordsByDate(LocalDate date) {
        return salesRecordRepository.findBySalesDateOrderByCreateTimeDesc(date);
    }

    @Override
    public List<SalesRecord> getRecordsByDateRange(LocalDate startDate, LocalDate endDate) {
        return salesRecordRepository.findBySalesDateBetweenOrderBySalesDateDesc(startDate, endDate);
    }

    @Override
    public SalesRecord createRecord(SalesRecordDTO dto) {
        StallCategory category = null;
        String categoryName = dto.getCategoryName();

        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
        }

        if (category == null && categoryName != null) {
            final String lookupName = categoryName;
            List<StallCategory> categories = categoryRepository.findAll();
            category = categories.stream()
                    .filter(c -> c.getName().equals(lookupName))
                    .findFirst()
                    .orElse(null);
        }

        if (category != null) {
            categoryName = category.getName();
        }

        BigDecimal unitPrice = dto.getUnitPrice();
        if (unitPrice == null && category != null) {
            unitPrice = category.getUnitPrice();
        }

        BigDecimal totalAmount = dto.getTotalAmount();
        if (totalAmount == null && unitPrice != null && dto.getQuantity() != null) {
            totalAmount = unitPrice.multiply(BigDecimal.valueOf(dto.getQuantity()));
        }

        SalesRecord record = SalesRecord.builder()
                .category(category)
                .categoryName(categoryName)
                .quantity(dto.getQuantity())
                .unitPrice(unitPrice)
                .totalAmount(totalAmount)
                .salesDate(dto.getSalesDate() != null ? LocalDate.parse(dto.getSalesDate()) : LocalDate.now())
                .remark(dto.getRemark())
                .build();

        return salesRecordRepository.save(record);
    }

    @Override
    public SalesRecord updateRecord(Long id, SalesRecordDTO dto) {
        SalesRecord record = salesRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found with id: " + id));

        if (dto.getCategoryId() != null) {
            StallCategory category = categoryRepository.findById(dto.getCategoryId()).orElse(null);
            if (category != null) {
                record.setCategory(category);
                record.setCategoryName(category.getName());
            }
        }

        if (dto.getCategoryName() != null) {
            record.setCategoryName(dto.getCategoryName());
        }

        if (dto.getQuantity() != null) {
            record.setQuantity(dto.getQuantity());
        }

        if (dto.getUnitPrice() != null) {
            record.setUnitPrice(dto.getUnitPrice());
        }

        if (dto.getTotalAmount() != null) {
            record.setTotalAmount(dto.getTotalAmount());
        } else if (dto.getUnitPrice() != null && dto.getQuantity() != null) {
            record.setTotalAmount(dto.getUnitPrice().multiply(BigDecimal.valueOf(dto.getQuantity())));
        }

        if (dto.getSalesDate() != null) {
            record.setSalesDate(LocalDate.parse(dto.getSalesDate()));
        }

        if (dto.getRemark() != null) {
            record.setRemark(dto.getRemark());
        }

        return salesRecordRepository.save(record);
    }

    @Override
    public void deleteRecord(Long id) {
        salesRecordRepository.deleteById(id);
    }

    @Override
    public BigDecimal getTotalAmountByDate(LocalDate date) {
        BigDecimal result = salesRecordRepository.sumTotalAmountByDate(date);
        return result != null ? result : BigDecimal.ZERO;
    }

    @Override
    public BigDecimal getTotalAmountByDateRange(LocalDate startDate, LocalDate endDate) {
        BigDecimal result = salesRecordRepository.sumTotalAmountBetweenDates(startDate, endDate);
        return result != null ? result : BigDecimal.ZERO;
    }

    @Override
    public List<Map<String, Object>> getHotSales(LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = salesRecordRepository.findHotSalesBetweenDates(startDate, endDate);
        List<Map<String, Object>> hotSales = new ArrayList<>();

        for (Object[] result : results) {
            Map<String, Object> item = new HashMap<>();
            item.put("categoryId", result[0]);
            item.put("categoryName", result[1]);
            item.put("totalQuantity", result[2]);
            item.put("totalAmount", result[3]);
            hotSales.add(item);
        }

        return hotSales;
    }

    @Override
    public Map<String, Object> getDailySummary(LocalDate date) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("date", date.toString());
        summary.put("totalAmount", getTotalAmountByDate(date));
        summary.put("recordCount", salesRecordRepository.countBySalesDate(date));
        Long totalQuantity = salesRecordRepository.sumQuantityByDate(date);
        summary.put("totalQuantity", totalQuantity != null ? totalQuantity : 0L);
        summary.put("records", getRecordsByDate(date));
        return summary;
    }

    @Override
    public Map<String, Object> getOverallStatistics() {
        Map<String, Object> stats = new HashMap<>();
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate startOfWeek = today.minusDays(today.getDayOfWeek().getValue() - 1);

        stats.put("todayAmount", getTotalAmountByDate(today));
        stats.put("weekAmount", getTotalAmountByDateRange(startOfWeek, today));
        stats.put("monthAmount", getTotalAmountByDateRange(startOfMonth, today));
        stats.put("hotSalesToday", getHotSales(today, today));
        stats.put("hotSalesWeek", getHotSales(startOfWeek, today));

        return stats;
    }
}
