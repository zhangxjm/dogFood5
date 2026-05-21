package com.freshfood.controller;

import com.freshfood.common.Result;
import com.freshfood.service.SaleRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private SaleRecordService saleRecordService;

    @GetMapping("/data")
    public Result<Map<String, Object>> getData() {
        return Result.success(saleRecordService.getDashboardData());
    }

    @GetMapping("/unsalable")
    public Result<List<Map<String, Object>>> getUnsalableProducts(@RequestParam(defaultValue = "30") Integer days,
                                                                   @RequestParam(defaultValue = "10") Integer minQuantity) {
        return Result.success(saleRecordService.getUnsalableProducts(days, minQuantity));
    }
}
