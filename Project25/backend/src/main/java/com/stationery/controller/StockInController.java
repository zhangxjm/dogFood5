package com.stationery.controller;

import com.stationery.common.Result;
import com.stationery.entity.StockIn;
import com.stationery.service.StockInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/stockIn")
@CrossOrigin
public class StockInController {

    @Autowired
    private StockInService stockInService;

    @GetMapping("/list")
    public Result<List<StockIn>> list() {
        return Result.success(stockInService.listAll());
    }

    @PostMapping
    public Result<Void> stockIn(@RequestBody StockIn stockIn) {
        if (stockInService.stockIn(stockIn)) {
            return Result.success();
        }
        return Result.error("入库失败");
    }
}
