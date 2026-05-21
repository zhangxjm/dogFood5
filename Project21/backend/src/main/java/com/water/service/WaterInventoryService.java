package com.water.service;

import com.water.dto.StockInRequest;
import com.water.entity.InventoryOperation;
import com.water.entity.WaterInventory;
import com.water.repository.InventoryOperationRepository;
import com.water.repository.WaterInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WaterInventoryService {
    
    @Autowired
    private WaterInventoryRepository inventoryRepository;
    
    @Autowired
    private InventoryOperationRepository operationRepository;
    
    public WaterInventory getInventory() {
        List<WaterInventory> list = inventoryRepository.findAll();
        if (list.isEmpty()) {
            WaterInventory inventory = new WaterInventory();
            inventory.setTotalQuantity(0);
            inventory.setAvailableQuantity(0);
            inventory.setBrand("默认品牌");
            inventory.setPricePerBucket(15.0);
            return inventoryRepository.save(inventory);
        }
        return list.get(0);
    }
    
    @Transactional
    public WaterInventory stockIn(StockInRequest request) {
        WaterInventory inventory = getInventory();
        int beforeQuantity = inventory.getAvailableQuantity();
        
        inventory.setTotalQuantity(inventory.getTotalQuantity() + request.getQuantity());
        inventory.setAvailableQuantity(inventory.getAvailableQuantity() + request.getQuantity());
        
        if (request.getBrand() != null && !request.getBrand().isEmpty()) {
            inventory.setBrand(request.getBrand());
        }
        if (request.getPricePerBucket() != null) {
            inventory.setPricePerBucket(request.getPricePerBucket());
        }
        
        inventory = inventoryRepository.save(inventory);
        
        InventoryOperation operation = new InventoryOperation();
        operation.setOperationType("入库");
        operation.setQuantity(request.getQuantity());
        operation.setBeforeQuantity(beforeQuantity);
        operation.setAfterQuantity(inventory.getAvailableQuantity());
        operation.setOperator(request.getOperator() != null ? request.getOperator() : "系统管理员");
        operation.setRemark(request.getRemark());
        operationRepository.save(operation);
        
        return inventory;
    }
    
    @Transactional
    public void deductStock(int quantity) {
        WaterInventory inventory = getInventory();
        int beforeQuantity = inventory.getAvailableQuantity();
        
        if (inventory.getAvailableQuantity() < quantity) {
            throw new RuntimeException("库存不足");
        }
        
        inventory.setAvailableQuantity(inventory.getAvailableQuantity() - quantity);
        inventoryRepository.save(inventory);
        
        InventoryOperation operation = new InventoryOperation();
        operation.setOperationType("领用");
        operation.setQuantity(quantity);
        operation.setBeforeQuantity(beforeQuantity);
        operation.setAfterQuantity(inventory.getAvailableQuantity());
        operation.setOperator("员工领用");
        operationRepository.save(operation);
    }
    
    public List<InventoryOperation> getOperationHistory() {
        return operationRepository.findAllByOrderByOperationTimeDesc();
    }
}