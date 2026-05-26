package com.afternoontea.controller;

import com.afternoontea.entity.Inventory;
import com.afternoontea.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Inventory inventory) {
        try {
            return ResponseEntity.ok(inventoryService.create(inventory));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        inventoryService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Inventory>> findAll() {
        return ResponseEntity.ok(inventoryService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventory> findById(@PathVariable Long id) {
        return inventoryService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Inventory>> findByCategoryId(@PathVariable Long categoryId) {
        return ResponseEntity.ok(inventoryService.findByCategoryId(categoryId));
    }

    @GetMapping("/type/{changeType}")
    public ResponseEntity<List<Inventory>> findByChangeType(@PathVariable String changeType) {
        return ResponseEntity.ok(inventoryService.findByChangeType(changeType));
    }

    @GetMapping("/time-range")
    public ResponseEntity<List<Inventory>> findByTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        return ResponseEntity.ok(inventoryService.findByTimeRange(startTime, endTime));
    }
}
