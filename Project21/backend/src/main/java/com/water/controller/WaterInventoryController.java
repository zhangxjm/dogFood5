package com.water.controller;

import com.water.dto.Result;
import com.water.dto.StockInRequest;
import com.water.entity.InventoryOperation;
import com.water.entity.WaterInventory;
import com.water.service.WaterInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class WaterInventoryController {
    
    @Autowired
    private WaterInventoryService inventoryService;
    
    @GetMapping
    public Result<WaterInventory> getInventory() {
        return Result.success(inventoryService.getInventory());
    }
    
    @PostMapping("/stock-in")
    public Result<WaterInventory> stockIn(@RequestBody StockInRequest request) {
        try {
            return Result.success(inventoryService.stockIn(request));
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }
    
    @GetMapping("/operations")
    public Result<List<InventoryOperation>> getOperationHistory() {
        return Result.success(inventoryService.getOperationHistory());
    }
}