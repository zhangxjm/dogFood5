package com.snack.controller;

import com.snack.dto.Result;
import com.snack.entity.DailyStat;
import com.snack.service.DailyStatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/stats")
public class DailyStatController {

    @Autowired
    private DailyStatService dailyStatService;

    @GetMapping("/today")
    public Result<DailyStat> getTodayStat() {
        return dailyStatService.getByDate(LocalDate.now())
                .map(Result::success)
                .orElse(Result.success(null));
    }

    @GetMapping
    public Result<DailyStat> getByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return dailyStatService.getByDate(date)
                .map(Result::success)
                .orElse(Result.success(null));
    }

    @GetMapping("/range")
    public Result<List<DailyStat>> listBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return Result.success(dailyStatService.listBetween(startDate, endDate));
    }
}
