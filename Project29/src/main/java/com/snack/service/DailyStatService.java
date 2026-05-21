package com.snack.service;

import com.snack.entity.DailyStat;
import com.snack.repository.DailyStatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DailyStatService {

    @Autowired
    private DailyStatRepository dailyStatRepository;

    public Optional<DailyStat> getByDate(LocalDate date) {
        return dailyStatRepository.findByStatDate(date);
    }

    public List<DailyStat> listBetween(LocalDate startDate, LocalDate endDate) {
        return dailyStatRepository.findByStatDateBetweenOrderByStatDateDesc(startDate, endDate);
    }
}
