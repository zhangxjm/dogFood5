package com.snack.service;

import com.snack.dto.HotSnackDTO;
import com.snack.dto.SaleRecordDTO;
import com.snack.entity.DailyStat;
import com.snack.entity.SaleRecord;
import com.snack.entity.Snack;
import com.snack.repository.DailyStatRepository;
import com.snack.repository.SaleRecordRepository;
import com.snack.repository.SnackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SaleRecordService {

    @Autowired
    private SaleRecordRepository saleRecordRepository;

    @Autowired
    private SnackRepository snackRepository;

    @Autowired
    private DailyStatRepository dailyStatRepository;

    public List<SaleRecord> listByDate(LocalDate date) {
        return saleRecordRepository.findBySaleDateOrderByCreateTimeDesc(date);
    }

    @Transactional
    public SaleRecord create(SaleRecordDTO dto) {
        Snack snack = snackRepository.findById(dto.getSnackId())
                .orElseThrow(() -> new RuntimeException("小吃不存在"));

        SaleRecord record = new SaleRecord();
        record.setSnackId(snack.getId());
        record.setSnackName(snack.getName());
        record.setQuantity(dto.getQuantity());
        record.setUnitPrice(snack.getPrice());
        record.setTotalAmount(snack.getPrice() * dto.getQuantity());
        record.setSaleDate(dto.getSaleDate() != null ? dto.getSaleDate() : LocalDate.now());

        SaleRecord saved = saleRecordRepository.save(record);
        updateDailyStat(saved.getSaleDate());
        return saved;
    }

    private void updateDailyStat(LocalDate date) {
        Double totalRevenue = saleRecordRepository.sumTotalAmountByDate(date);
        Long orderCount = saleRecordRepository.countBySaleDate(date);

        DailyStat stat = dailyStatRepository.findByStatDate(date)
                .orElse(new DailyStat());
        stat.setStatDate(date);
        stat.setTotalRevenue(totalRevenue != null ? totalRevenue : 0.0);
        stat.setTotalOrders(orderCount != null ? orderCount.intValue() : 0);
        dailyStatRepository.save(stat);
    }

    public List<HotSnackDTO> getHotSnacks(LocalDate date) {
        List<Object[]> results = saleRecordRepository.findHotSnacksByDate(date);
        return results.stream()
                .map(row -> new HotSnackDTO(
                        (Long) row[0],
                        (String) row[1],
                        (Long) row[2],
                        (Double) row[3]
                ))
                .collect(Collectors.toList());
    }

    public List<HotSnackDTO> getHotSnacksBetween(LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = saleRecordRepository.findHotSnacksBetweenDates(startDate, endDate);
        return results.stream()
                .map(row -> new HotSnackDTO(
                        (Long) row[0],
                        (String) row[1],
                        (Long) row[2],
                        (Double) row[3]
                ))
                .collect(Collectors.toList());
    }
}
