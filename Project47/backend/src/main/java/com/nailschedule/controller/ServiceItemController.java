package com.nailschedule.controller;

import com.nailschedule.common.Result;
import com.nailschedule.entity.ServiceItem;
import com.nailschedule.service.ServiceItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/service")
public class ServiceItemController {

    @Autowired
    private ServiceItemService serviceItemService;

    @GetMapping("/list")
    public Result<List<ServiceItem>> list() {
        return Result.success(serviceItemService.list());
    }

    @GetMapping("/active")
    public Result<List<ServiceItem>> listActive() {
        return Result.success(serviceItemService.listActive());
    }

    @PostMapping("/save")
    public Result<ServiceItem> save(@RequestBody ServiceItem serviceItem) {
        return Result.success(serviceItemService.save(serviceItem));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        serviceItemService.delete(id);
        return Result.success();
    }
}
